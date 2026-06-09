import { Metadata } from 'next';
import { getPosts } from '@/actions/content';
import { PostType, Status } from '@/generated/prisma';
import { ArticlesContent } from '@/components/content/ArticlesContent';

export const metadata: Metadata = {
  title: '文章',
  description: '探索 AI Agent 开发的技术文章和教程，从入门到进阶',
  openGraph: {
    title: 'AI Skill Hub 文章',
    description: '探索 AI Agent 开发的技术文章和教程',
  },
};

export default async function ArticlesPage() {
  let posts: any[] = [];

  try {
    const result = await getPosts({ type: PostType.ARTICLE, status: Status.PUBLISHED, take: 50 });
    if (result.success && result.posts) {
      posts = result.posts;
    }
  } catch {
    // Use empty state
  }

  return <ArticlesContent initialPosts={posts} />;
}
