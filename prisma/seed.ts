import { PrismaClient, PostType, Status, NavType, StorageType, Role } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // ---------- 创建示例用户 ----------
  const admin = await prisma.user.upsert({
    where: { email: "admin@aiskillhub.com" },
    update: {},
    create: {
      email: "admin@aiskillhub.com",
      name: "管理员",
      role: Role.ADMIN,
    },
  });

  const user = await prisma.user.upsert({
    where: { email: "demo@aiskillhub.com" },
    update: {},
    create: {
      email: "demo@aiskillhub.com",
      name: "AI 探索者",
      role: Role.USER,
    },
  });

  console.log("✅ 用户创建完成");

  // ---------- 创建标签 ----------
  const tags = await Promise.all([
    prisma.tag.upsert({ where: { name: "入门" }, update: {}, create: { name: "入门" } }),
    prisma.tag.upsert({ where: { name: "教程" }, update: {}, create: { name: "教程" } }),
    prisma.tag.upsert({ where: { name: "RAG" }, update: {}, create: { name: "RAG" } }),
    prisma.tag.upsert({ where: { name: "提示词" }, update: {}, create: { name: "提示词" } }),
    prisma.tag.upsert({ where: { name: "多Agent" }, update: {}, create: { name: "多Agent" } }),
    prisma.tag.upsert({ where: { name: "最佳实践" }, update: {}, create: { name: "最佳实践" } }),
    prisma.tag.upsert({ where: { name: "工具集" }, update: {}, create: { name: "工具集" } }),
    prisma.tag.upsert({ where: { name: "自动化" }, update: {}, create: { name: "自动化" } }),
    prisma.tag.upsert({ where: { name: "架构" }, update: {}, create: { name: "架构" } }),
  ]);

  console.log("✅ 标签创建完成");

  // ---------- 创建 3 篇文章 ----------
  const article1 = await prisma.post.upsert({
    where: { slug: "ai-agent-getting-started" },
    update: {},
    create: {
      title: "AI Agent 开发入门：从零开始构建智能助手",
      slug: "ai-agent-getting-started",
      content: `# AI Agent 开发入门

## 什么是 AI Agent

AI Agent 是能够自主感知环境、做出决策并执行动作的智能实体。与传统 AI 模型不同，Agent 具有以下核心特征：

- **自主性**：能够独立运行而不需要持续的人工干预
- **反应性**：能够感知环境变化并做出响应
- **主动性**：能够主动采取行动来达成目标

## 为什么需要 AI Agent

在当今复杂的技术环境中，单一模型难以胜任复杂的任务。AI Agent 通过组合多种能力，可以：

1. 理解复杂指令并拆解为可执行的步骤
2. 调用外部工具和 API
3. 记住上下文并做出连贯的决策
4. 根据反馈不断改进自己的行为

## 构建第一个 Agent

### 步骤1：定义 Agent 的目标

首先明确你的 Agent 要解决什么问题。例如：

- 自动回复客户邮件
- 数据分析和可视化
- 代码审查助手

### 步骤2：选择基础模型

根据任务复杂度选择合适的基础模型：
- 简单文本任务：GPT-4o-mini 或 DeepSeek
- 复杂推理任务：GPT-4o 或 Claude 3.5 Sonnet
- 代码任务：专门的代码模型

### 步骤3：设计工具集成

Agent 需要调用外部工具来完成实际任务：

\`\`\`python
tools = [
    search_web,
    read_file,
    write_file,
    send_email,
    query_database,
]
\`\`\`

### 步骤4：实现决策循环

核心的 Agent 循环通常包含四个阶段：观察 → 思考 → 行动 → 反馈。

## 下一步

掌握了基础概念后，建议你继续阅读「最佳实践」文章来了解生产环境的部署技巧。`,
      excerpt: "本文详细介绍如何使用现代 AI 技术构建功能强大的 Agent，从概念到实践，逐步构建你的第一个智能助手。",
      type: PostType.ARTICLE,
      status: Status.PUBLISHED,
      authorId: admin.id,
      viewCount: 1250,
      tags: {
        create: [
          { tagId: tags[0].id },
          { tagId: tags[1].id },
        ],
      },
    },
  });

  const article2 = await prisma.post.upsert({
    where: { slug: "llm-prompt-engineering" },
    update: {},
    create: {
      title: "LLM 提示工程最佳实践",
      slug: "llm-prompt-engineering",
      content: `# LLM 提示工程最佳实践

## 基础原则

好的提示工程是一门艺术，也是一门科学。以下是经过验证的最佳实践：

### 1. 清晰明确

\`\`\`
❌ 差：「写一些关于 Python 的内容」
✅ 好：「请写一份面向初学者的 Python 异步编程教程，包含代码示例和常见陷阱」
\`\`\`

### 2. 提供上下文

给 AI 提供足够的背景信息能让输出质量大幅提升。

### 3. 结构化输出

明确要求特定格式：
- Markdown 格式
- JSON 输出
- 表格形式

## 进阶技巧

### Chain of Thought

鼓励模型逐步推理：

\`\`\`
请逐步分析这个问题，然后在最后给出答案。
\`\`\`

### Few-Shot Learning

提供几个高质量的示例能显著改善输出质量。

## 常见陷阱

1. 提示词过长导致上下文丢失
2. 指令冲突
3. 缺乏错误处理逻辑`,
      excerpt: "探索如何设计有效的提示词，让 AI 产生更准确、更有用的响应，包含大量实战示例。",
      type: PostType.ARTICLE,
      status: Status.PUBLISHED,
      authorId: user.id,
      viewCount: 2100,
      tags: {
        create: [
          { tagId: tags[3].id },
          { tagId: tags[5].id },
        ],
      },
    },
  });

  const article3 = await prisma.post.upsert({
    where: { slug: "multi-agent-architecture" },
    update: {},
    create: {
      title: "多 Agent 协作架构设计",
      slug: "multi-agent-architecture",
      content: `# 多 Agent 协作架构设计

## 为什么需要多 Agent

单个 Agent 的能力是有限的。多 Agent 系统可以实现：

1. **任务分解**：复杂任务被拆解为子任务
2. **专业化**：每个 Agent 专注于自己擅长的领域
3. **容错性**：某个 Agent 失败不影响整体

## 常见架构模式

### 层级式
一个主 Agent 协调多个子 Agent。

### 联邦式
多个对等 Agent 通过通信协议协作。

### 混合式
结合层级和联邦的优势。

## 实现要点

1. 通信协议设计
2. 任务分配策略
3. 冲突解决机制
4. 状态同步`,
      excerpt: "深入研究多个 AI Agent 如何协同工作，处理复杂的任务和问题，覆盖主流架构模式。",
      type: PostType.ARTICLE,
      status: Status.PUBLISHED,
      authorId: user.id,
      viewCount: 890,
      tags: {
        create: [
          { tagId: tags[4].id },
          { tagId: tags[8].id },
        ],
      },
    },
  });

  console.log("✅ 文章创建完成");

  // ---------- 创建 5 张知识库卡片 ----------
  const cards = [
    {
      slug: "ai-code-review",
      title: "AI 代码审查方案",
      content: "使用 AI Agent 自动审查代码质量、发现潜在 Bug 并提供改进建议。涵盖 GitHub PR 集成、规则自定义和团队协作。",
      excerpt: "自动化代码审查流程，提升代码质量",
      tags: [5, 2],
    },
    {
      slug: "customer-support-bot",
      title: "智能客服机器人",
      content: "基于 RAG 和 LLM 构建的多渠道智能客服系统。支持知识库检索、多轮对话、情感分析和工单自动生成。",
      excerpt: "多渠道智能客服系统解决方案",
      tags: [2, 7],
    },
    {
      slug: "data-analysis-agent",
      title: "数据分析 Agent",
      content: "自动执行数据分析任务的 AI Agent。从数据清洗、可视化到洞察生成，全程自动化。支持自然语言查询。",
      excerpt: "自然语言驱动的自动化数据分析",
      tags: [6, 1],
    },
    {
      slug: "workflow-orchestrator",
      title: "工作流编排器",
      content: "通用的 AI 工作流编排框架。拖拽式设计、条件分支、并行执行、错误重试。支持 Python/Node 脚本嵌入。",
      excerpt: "可视化 AI 工作流编排框架",
      tags: [7, 5],
    },
    {
      slug: "knowledge-base-builder",
      title: "知识库自动构建",
      content: "从文档自动构建结构化知识库的完整方案。包含文档解析、向量化、索引构建和语义搜索。支持 PDF/Word/Markdown。",
      excerpt: "自动构建和维护语义知识库",
      tags: [2, 6],
    },
  ];

  for (const card of cards) {
    await prisma.post.upsert({
      where: { slug: card.slug },
      update: {},
      create: {
        title: card.title,
        slug: card.slug,
        content: card.content,
        excerpt: card.excerpt,
        type: PostType.CARD,
        status: Status.PUBLISHED,
        authorId: admin.id,
        viewCount: Math.floor(Math.random() * 2000),
        tags: {
          create: card.tags.map((tagIdx) => ({ tagId: tags[tagIdx].id })),
        },
      },
    });
  }

  console.log("✅ 知识库卡片创建完成");

  // ---------- 创建 3 个模板 ----------
  const templates = [
    {
      slug: "langchain-agent-template",
      title: "LangChain Agent 模板",
      content: `# LangChain Agent 模板\n\n基于 LangChain 的全功能 Agent 模板，支持工具调用、记忆管理和流式输出。\n\n\`\`\`python\nfrom langchain.agents import initialize_agent\nfrom langchain.tools import Tool\n\ndef create_agent():\n    tools = [...]\n    agent = initialize_agent(tools, llm)\n    return agent\n\`\`\``,
      excerpt: "开箱即用的 LangChain Agent 项目模板",
      tags: [6, 1],
    },
    {
      slug: "nextjs-ai-chat-template",
      title: "Next.js AI 聊天应用",
      content: `# Next.js AI 聊天应用模板\n\n基于 Next.js 14 + Vercel AI SDK 的全栈聊天应用模板。支持流式响应、会话管理、Markdown 渲染。\n\n\`\`\`tsx\nimport { useChat } from 'ai/react'\n\nexport default function Chat() {\n  const { messages, input, handleSubmit } = useChat()\n  return <div>...</div>\n}\n\`\`\``,
      excerpt: "Next.js 全栈 AI 聊天应用快速启动模板",
      tags: [1, 5],
    },
    {
      slug: "discord-bot-agent",
      title: "Discord AI Bot 模板",
      content: `# Discord AI Bot 模板\n\n基于 discord.py + LangChain 的智能 Discord Bot。支持 slash 命令、上下文对话、多频道管理。\n\n\`\`\`python\n@bot.slash_command(name="ask")\nasync def ask(ctx, question: str):\n    response = agent.run(question)\n    await ctx.respond(response)\n\`\`\``,
      excerpt: "Discord 智能机器人快速开发模板",
      tags: [6, 7],
    },
  ];

  for (const template of templates) {
    await prisma.post.upsert({
      where: { slug: template.slug },
      update: {},
      create: {
        title: template.title,
        slug: template.slug,
        content: template.content,
        excerpt: template.excerpt,
        type: PostType.TEMPLATE,
        status: Status.PUBLISHED,
        authorId: user.id,
        viewCount: Math.floor(Math.random() * 1500),
        tags: {
          create: template.tags.map((tagIdx) => ({ tagId: tags[tagIdx].id })),
        },
      },
    });
  }

  console.log("✅ 模板创建完成");

  // ---------- 创建导航 ----------
  const navItems = [
    { label: "首页", slug: null, type: NavType.PAGE, sortOrder: 0 },
    { label: "文章", slug: "articles", type: NavType.PAGE, sortOrder: 1 },
    { label: "知识库", slug: "cards", type: NavType.PAGE, sortOrder: 2 },
    { label: "模板", slug: "templates", type: NavType.PAGE, sortOrder: 3 },
    { label: "资源", slug: "resources", type: NavType.PAGE, sortOrder: 4 },
  ];

  for (const nav of navItems) {
    await prisma.navigation.upsert({
      where: { slug: nav.slug || `home-${nav.sortOrder}` },
      update: {},
      create: {
        label: nav.label,
        slug: nav.slug,
        type: nav.type,
        sortOrder: nav.sortOrder,
        isVisible: true,
      },
    });
  }

  console.log("✅ 导航创建完成");

  // ---------- 创建示例评论 ----------
  const sampleComments = [
    { content: "非常好的文章！学到了很多！", authorId: user.id, postId: article1.id },
    { content: "请问有完整的代码例子吗？", authorId: admin.id, postId: article1.id },
    { content: "多 Agent 架构这部分讲得很清晰", authorId: user.id, postId: article3.id },
    { content: "提示工程的例子很实用，已收藏", authorId: admin.id, postId: article2.id },
  ];

  for (const comment of sampleComments) {
    await prisma.comment.create({
      data: comment,
    });
  }

  console.log("✅ 评论创建完成");

  // ---------- 创建示例点赞和收藏 ----------
  await prisma.like.create({ data: { userId: user.id, postId: article1.id } });
  await prisma.like.create({ data: { userId: admin.id, postId: article2.id } });
  await prisma.bookmark.create({ data: { userId: user.id, postId: article1.id } });
  await prisma.bookmark.create({ data: { userId: user.id, postId: article2.id } });

  console.log("✅ 互动数据创建完成");

  console.log("\n🎉 种子数据全部创建完成！");
  console.log("   - 2 个用户（1 管理员 + 1 普通用户）");
  console.log("   - 9 个标签");
  console.log("   - 3 篇文章");
  console.log("   - 5 张知识库卡片");
  console.log("   - 3 个模板");
  console.log("   - 5 个导航项");
  console.log("   - 4 条评论");
  console.log("   - 2 个点赞 + 2 个收藏");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("种子数据创建失败:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
