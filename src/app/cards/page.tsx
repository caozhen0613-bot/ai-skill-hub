import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getPosts } from '@/actions/content';
import { KnowledgeCard } from '@/components/content/KnowledgeCard';
import { PostType, Status } from '@/generated/prisma';
import type { Post } from '@/generated/prisma';

export const metadata: Metadata = {
  title: '知识库',
  description: '结构化的 AI Agent 场景解决方案卡片，快速找到适用的 AI 方案',
  openGraph: {
    title: 'AI Skill Hub 知识库',
    description: '结构化的场景解决方案卡片',
  },
};

export default async function CardsPage() {
  const { success, posts = [] } = await getPosts({ 
    type: PostType.CARD, 
    status: Status.PUBLISHED 
  });

  const typedPosts = posts as Post[] || [];

  return (
    <div className="min-h-screen py-20">
      <div style={{ 
        width: '100%', 
        maxWidth: '1280px', 
        margin: '0 auto', 
        padding: '0 1rem' 
      }}>
        <div className="mb-12">
          <Button variant="ghost" className="p-0 mb-4" href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            返回首页
          </Button>
          <h1 className="text-4xl font-bold mb-4">知识库</h1>
          <p className="text-muted-foreground text-lg">结构化的场景解决方案卡片</p>
        </div>
        
        {success && typedPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {typedPosts.map((post) => (
              <KnowledgeCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">暂无知识库卡片</p>
          </div>
        )}
      </div>
    </div>
  );
}
