import prisma from "@/lib/prisma";

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ai-skill-hub.vercel.app";

  let items = "";

  try {
    const posts = await prisma.post.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { createdAt: "desc" },
      take: 50,
      select: {
        title: true,
        slug: true,
        excerpt: true,
        type: true,
        createdAt: true,
        updatedAt: true,
        author: { select: { name: true } },
      },
    });

    const pathMap: Record<string, string> = {
      ARTICLE: "articles",
      CARD: "cards",
      TEMPLATE: "templates",
    };

    items = posts
      .map((post) => {
        const path = pathMap[post.type] || "articles";
        const url = `${baseUrl}/${path}/${post.slug}`;
        return `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${url}</link>
      <guid>${url}</guid>
      <description><![CDATA[${post.excerpt || post.title}]]></description>
      <author>${post.author?.name || "AI Skill Hub"}</author>
      <pubDate>${new Date(post.createdAt).toUTCString()}</pubDate>
    </item>`;
      })
      .join("");
  } catch {
    // Fallback: return feed without items if DB unavailable
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>AI Skill Hub</title>
    <link>${baseUrl}</link>
    <description>一个专注于 AI Agent 技能、场景解决方案和工作流的分享社区</description>
    <language>zh-CN</language>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
