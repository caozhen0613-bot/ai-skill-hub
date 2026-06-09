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
step() { echo -e "\n${BLUE}=== $* ===${NC}"; }

PROJECT_DIR="/opt/ai-skill-hub"
GITHUB_REPO=""
STEP_TOTAL=7
STEP_CURRENT=0

progress() {
  STEP_CURRENT=$((STEP_CURRENT + 1))
  echo -e "${BLUE}[${STEP_CURRENT}/${STEP_TOTAL}]${NC} $*"
}

usage() {
  cat <<EOF
用法: $0 [选项]

选项:
  -r, --repo URL      Git 仓库地址 (必填, 仅首次)
  -d, --dir PATH      项目目录 (默认: /opt/ai-skill-hub)
  --skip-swap         跳过 swap 创建
  --skip-docker       跳过 Docker 安装
  -h, --help          显示帮助

示例:
  # 首次部署
  $0 -r git@github.com:user/ai-skill-hub.git

  # 更新部署 (已存在代码)
  $0
EOF
  exit 0
}

SKIP_SWAP=false
SKIP_DOCKER=false

while [[ $# -gt 0 ]]; do
  case $1 in
    -r|--repo) GITHUB_REPO="$2"; shift 2 ;;
    -d|--dir)  PROJECT_DIR="$2"; shift 2 ;;
    --skip-swap) SKIP_SWAP=true; shift ;;
    --skip-docker) SKIP_DOCKER=true; shift ;;
    -h|--help) usage ;;
    *) err "未知参数: $1"; usage ;;
  esac
done

echo ""
echo "╔══════════════════════════════════════════╗"
echo "║       AI Skill Hub  一键部署脚本         ║"
echo "║   适配: Ubuntu 22.04 / 阿里云 ECS        ║"
echo "╚══════════════════════════════════════════╝"
echo ""

progress "检查系统环境"

if [[ "$(id -u)" -ne 0 ]]; then
  err "请以 root 身份运行: sudo bash deploy.sh"
  exit 1
fi

MEM_TOTAL=$(grep MemTotal /proc/meminfo | awk '{print $2}')
MEM_MB=$((MEM_TOTAL / 1024))
log "内存: ${MEM_MB} MiB"

DISK_FREE=$(df /opt --output=avail 2>/dev/null | tail -1 || df / --output=avail | tail -1)
DISK_MB=$((DISK_FREE / 1024))
log "可用磁盘: ${DISK_MB} MiB"

if [[ $DISK_MB -lt 5120 ]]; then
  warn "磁盘剩余空间 < 5 GiB, 建议扩容后再部署"
fi

progress "安装系统依赖"

if command -v docker &>/dev/null && $SKIP_DOCKER; then
  log "Docker 已安装, 跳过"
else
  if ! command -v docker &>/dev/null; then
    log "正在安装 Docker..."
    curl -fsSL https://get.docker.com | sh
    systemctl enable docker
    systemctl start docker
  fi

  if ! docker compose version &>/dev/null 2>&1; then
    log "安装 docker compose 插件..."
    apt-get update -qq && apt-get install -y -qq docker-compose-plugin
  fi
fi

log "Docker 版本: $(docker --version)"
log "Compose 版本: $(docker compose version 2>/dev/null || echo 'N/A')"

progress "配置 swap 防止内存溢出"

SWAP_TOTAL=$(free -m | awk '/^Swap:/ {print $2}')
if [[ $SKIP_SWAP == true ]]; then
  log "跳过 swap 创建"
elif [[ $SWAP_TOTAL -ge 1024 ]]; then
  log "Swap 已存在 (${SWAP_TOTAL} MiB), 跳过"
else
  log "创建 2 GiB swap 文件..."
  fallocate -l 2G /swapfile 2>/dev/null || dd if=/dev/zero of=/swapfile bs=1M count=2048
  chmod 600 /swapfile
  mkswap /swapfile
  swapon /swapfile
  if ! grep -q /swapfile /etc/fstab; then
    echo '/swapfile none swap sw 0 0' >> /etc/fstab
  fi
  log "Swap 配置完成: 2 GiB"
fi

progress "获取项目代码"

if [[ -d "$PROJECT_DIR/.git" ]]; then
  log "项目已存在, 拉取最新代码..."
  cd "$PROJECT_DIR"
  git fetch origin
  CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
  git reset --hard "origin/$CURRENT_BRANCH"
  log "代码已更新到 $(git rev-parse --short HEAD)"
else
  if [[ -z "$GITHUB_REPO" ]]; then
    err "首次部署需要 -r 参数指定 Git 仓库地址"
    exit 1
  fi
  log "克隆仓库: $GITHUB_REPO"
  mkdir -p "$(dirname "$PROJECT_DIR")"
  git clone "$GITHUB_REPO" "$PROJECT_DIR"
  cd "$PROJECT_DIR"
  log "代码克隆完成"
fi

progress "配置环境变量"

cd "$PROJECT_DIR"
ENV_FILE="$PROJECT_DIR/.env"

if [[ -f "$ENV_FILE" ]]; then
  log ".env 文件已存在, 跳过创建"
else
  log "创建 .env 文件..."

  if [[ -f ".env.example" ]]; then
    cp .env.example "$ENV_FILE"

    AUTH_SECRET=$(openssl rand -base64 48)
    sed -i "s|AUTH_SECRET=.*|AUTH_SECRET=\"$AUTH_SECRET\"|" "$ENV_FILE"
    log "AUTH_SECRET 已自动生成"
  else
    cat > "$ENV_FILE" << 'ENVEOF'
DATABASE_URL="postgresql://postgres:__CHANGE_ME__@db:5432/ai-skill-hub?schema=public"
AUTH_SECRET="__CHANGE_ME__"
AUTH_GITHUB_ID=""
AUTH_GITHUB_SECRET=""
NEXT_PUBLIC_SITE_URL="http://localhost"
R2_ENDPOINT=""
R2_ACCESS_KEY_ID=""
R2_SECRET_ACCESS_KEY=""
R2_BUCKET_NAME="ai-skill-hub"
ENVEOF
  fi

  warn "请编辑 $ENV_FILE 填入必要配置 (GitHub OAuth 等)"
  warn "编辑完成后按 Ctrl+X 退出"
  echo ""
  read -rp "按回车打开编辑器..." _
  ${EDITOR:-nano} "$ENV_FILE"

  POSTGRES_PASSWORD=$(grep -oP 'POSTGRES_PASSWORD=\K.*' "$ENV_FILE" 2>/dev/null || echo "")
  if [[ -z "$POSTGRES_PASSWORD" ]]; then
    warn "未找到 POSTGRES_PASSWORD, 将使用默认值"
  fi
fi

log "加载环境变量..."
set -a
# shellcheck source=/dev/null
source "$ENV_FILE" 2>/dev/null || true
set +a

progress "构建并启动服务"

log "构建 Docker 镜像 (首次约 3-5 分钟)..."
docker compose build --no-cache app 2>&1 | tail -20

log "启动所有服务..."
docker compose up -d

log "等待数据库就绪..."
RETRIES=0
while [[ $RETRIES -lt 30 ]]; do
  if docker compose exec -T db pg_isready -U "${POSTGRES_USER:-postgres}" &>/dev/null; then
    log "数据库已就绪"
    break
  fi
  sleep 2
  RETRIES=$((RETRIES + 1))
done

if [[ $RETRIES -ge 30 ]]; then
  err "数据库启动超时, 请检查: docker compose logs db"
  exit 1
fi

progress "初始化数据库"

log "执行 prisma db push..."
docker compose exec -T app npx prisma db push

log "灌入种子数据..."
docker compose exec -T app npx tsx prisma/seed.ts

progress "部署完成!"

echo ""
echo "╔══════════════════════════════════════════╗"
echo "║           部署成功! 🎉                    ║"
echo "╠══════════════════════════════════════════╣"
echo "║                                          ║"
echo "║  访问地址: http://$(curl -s ifconfig.me 2>/dev/null || hostname -I | awk '{print $1}')"
echo "║  管理后台: http://$(curl -s ifconfig.me 2>/dev/null || hostname -I | awk '{print $1}')/admin"
echo "║                                          ║"
echo "║  常用命令:                                ║"
echo "║    docker compose ps         查看服务状态  ║"
echo "║    docker compose logs -f app 查看应用日志  ║"
echo "║    docker compose restart app 重启应用     ║"
echo "║    docker compose down        停止服务     ║"
echo "║    docker compose up -d       启动服务     ║"
echo "║                                          ║"
echo "╚══════════════════════════════════════════╝"
echo ""

log "下一步:"
log "  1. 打开阿里云安全组, 放行 80 / 443 端口"
log "  2. 配置域名 DNS 解析到本机公网 IP"
log "  3. 如需 HTTPS, 配置 SSL 证书到 ./ssl/ 目录"
