import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getPosts } from '@/actions/content';
import { TemplateCard } from '@/components/content/TemplateCard';
import { PostType, Status } from '@/generated/prisma';
import type { Post } from '@/generated/prisma';

export const metadata: Metadata = {
  title: '模板库',
  description: '可直接使用的 AI Agent 代码模板和项目框架，快速开始项目开发',
  openGraph: {
    title: 'AI Skill Hub 模板库',
    description: '可直接使用的代码模板和项目框架',
  },
};

export default async function TemplatesPage() {
  const { success, posts } = await getPosts({ 
    type: PostType.TEMPLATE, 
    status: Status.PUBLISHED 
  });

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
          <h1 className="text-4xl font-bold mb-4">模板</h1>
          <p className="text-muted-foreground text-lg">可直接使用的代码模板和项目框架</p>
        </div>
        
        {success && posts && posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post: Post) => (
              <TemplateCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">暂无模板</p>
          </div>
        )}
      </div>
    </div>
  );
}
