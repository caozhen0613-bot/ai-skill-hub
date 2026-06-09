#!/usr/bin/env bash
set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[1;34m'
NC='\033[0m'

log()  { echo -e "${GREEN}[INFO]${NC}  $*"; }
warn() { echo -e "${YELLOW}[WARN]${NC}  $*"; }
err()  { echo -e "${RED}[ERR]${NC}   $*"; }

PROJECT_DIR="/opt/ai-skill-hub"
GITHUB_REPO="https://github.com/caozhen0613-bot/ai-skill-hub.git"
PG_PASSWORD="ai-skill-hub@2026"
SITE_URL="http://39.105.67.38"

echo ""
echo "╔══════════════════════════════════════════╗"
echo "║     AI Skill Hub  国内网络一键部署       ║"
echo "║   适配: Ubuntu 22.04 / 阿里云 ECS        ║"
echo "║   策略: 主机直装 (不用Docker)             ║"
echo "╚══════════════════════════════════════════╝"
echo ""

if [[ "$(id -u)" -ne 0 ]]; then
  err "请以 root 身份运行: sudo bash deploy.sh"
  exit 1
fi

MEM_TOTAL=$(grep MemTotal /proc/meminfo | awk '{print $2}')
MEM_MB=$((MEM_TOTAL / 1024))
log "内存: ${MEM_MB} MiB"

STEPS=6
step() { echo -e "\n${BLUE}[$((++I))/6]${NC} $*"; }
I=0

# ========== 1. 安装 Node.js 22 ==========
step "安装 Node.js 22"

if command -v node &>/dev/null && node -v | grep -q "v22"; then
  log "Node.js $(node -v) 已安装, 跳过"
else
  log "通过 NodeSource 国内源安装..."
  curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
  apt-get install -y nodejs
  log "Node.js $(node -v) 安装完成"
fi

npm config set registry https://registry.npmmirror.com
npm config set disturl https://npmmirror.com/dist
log "npm 镜像源已切换到 npmmirror.com"

# ========== 2. 安装 PostgreSQL 16 ==========
step "安装 PostgreSQL 16"

if command -v psql &>/dev/null && pg_isready &>/dev/null 2>&1; then
  log "PostgreSQL 已在运行, 跳过"
else
  apt-get update -qq
  apt-get install -y -qq postgresql-16 postgresql-client-16
  systemctl enable postgresql
  systemctl start postgresql
fi

log "配置数据库..."
su - postgres -c "psql -c \"ALTER USER postgres WITH PASSWORD '${PG_PASSWORD}';\" 2>/dev/null" || true

if su - postgres -c "psql -lqt | cut -d \| -f 1 | grep -qw ai-skill-hub" 2>/dev/null; then
  log "数据库 ai-skill-hub 已存在"
else
  su - postgres -c "createdb ai-skill-hub"
  log "数据库 ai-skill-hub 创建完成"
fi

# 允许本地密码登录
PG_HBA=$(find /etc/postgresql -name pg_hba.conf 2>/dev/null | head -1)
if [[ -n "$PG_HBA" ]]; then
  sed -i 's/local   all             all                                     peer/local   all             all                                     md5/' "$PG_HBA"
  systemctl restart postgresql
fi

# ========== 3. 获取代码 ==========
step "获取项目代码"

if [[ -d "$PROJECT_DIR/.git" ]]; then
  log "项目已存在, 拉取最新代码..."
  cd "$PROJECT_DIR"
  git pull origin main 2>/dev/null || git reset --hard origin/main
  log "代码已更新: $(git rev-parse --short HEAD)"
else
  log "克隆仓库..."
  mkdir -p /opt
  rm -rf "$PROJECT_DIR"
  git clone "$GITHUB_REPO" "$PROJECT_DIR"
  cd "$PROJECT_DIR"
  log "代码克隆完成"
fi

# ========== 4. 安装依赖 ==========
step "安装项目依赖"

cd "$PROJECT_DIR"
rm -rf node_modules package-lock.json
npm install
npx prisma generate
log "依赖安装完成"

# ========== 5. 配置环境 + 初始化数据库 ==========
step "初始化数据库与构建"

AUTH_SECRET=$(openssl rand -base64 48)

cat > "$PROJECT_DIR/.env" << ENVEOF
DATABASE_URL="postgresql://postgres:${PG_PASSWORD}@localhost:5432/ai-skill-hub?schema=public"
AUTH_SECRET="${AUTH_SECRET}"
AUTH_GITHUB_ID=""
AUTH_GITHUB_SECRET=""
NEXT_PUBLIC_SITE_URL="${SITE_URL}"
ENVEOF

log ".env 配置完成"
log "AUTH_SECRET: ${AUTH_SECRET:0:16}..."

npx prisma db push
log "数据库表创建完成"

npx tsx prisma/seed.ts
log "种子数据导入完成"

log "构建生产版本 (约 1-2 分钟)..."
npm run build
log "构建完成"

# ========== 6. 启动服务 ==========
step "启动服务"

npm install -g pm2 --registry=https://registry.npmmirror.com
pm2 delete ai-skill-hub 2>/dev/null || true

pm2 start ./node_modules/.bin/next --name "ai-skill-hub" -- start -p 3000
pm2 startup
pm2 save

sleep 10

# 最终验证
STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 2>/dev/null || echo "000")

echo ""
echo "╔══════════════════════════════════════════╗"
echo "║           部署完成                        ║"
echo "╠══════════════════════════════════════════╣"
echo "║                                          ║"
echo "║  HTTP 状态: ${STATUS}                         ║"
echo "║  访问地址 : ${SITE_URL}      ║"
echo "║  管理后台 : ${SITE_URL}/admin              ║"
echo "║                                          ║"
echo "║  常用命令:                                ║"
echo "║    pm2 status                 查看状态    ║"
echo "║    pm2 logs ai-skill-hub      查看日志    ║"
echo "║    pm2 restart ai-skill-hub   重启服务    ║"
echo "║                                          ║"
echo "╚══════════════════════════════════════════╝"
echo ""

log "下一步:"
log "  1. 阿里云安全组放行 3000 端口 (或 80 端口)"
log "  2. 用公网 IP ${SITE_URL} 访问网站"
log "  3. 如需用域名, 配置 DNS 解析到 39.105.67.38"
