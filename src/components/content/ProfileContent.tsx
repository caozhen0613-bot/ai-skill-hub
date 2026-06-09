'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, FileText, Code, LogIn } from 'lucide-react';
import { ArticleCard } from '@/components/content/ArticleCard';
import { KnowledgeCard } from '@/components/content/KnowledgeCard';
import { TemplateCard } from '@/components/content/TemplateCard';

export function ProfileContent({
  session,
  bookmarks,
  myPosts,
}: {
  session: any;
  bookmarks: any[];
  myPosts: any[];
}) {
  const [activeTab, setActiveTab] = useState('bookmarks');

  if (!session) {
    return (
      <div className="min-h-screen py-12">
        <div style={{ width: '100%', maxWidth: '1280px', margin: '0 auto', padding: '0 1rem' }}>
          <div className="text-center py-16">
            <LogIn className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">请先登录</h2>
            <p className="text-muted-foreground mb-4">登录后即可查看个人主页和收藏内容</p>
            <Button href="/api/auth/signin">前往登录</Button>
          </div>
        </div>
      </div>
    );
  }

  const user = session.user || {};
  const userArticles = myPosts.filter((p: any) => p.type === 'ARTICLE');
  const userCards = myPosts.filter((p: any) => p.type === 'CARD');
  const userTemplates = myPosts.filter((p: any) => p.type === 'TEMPLATE');
  const totalPosts = userArticles.length + userCards.length + userTemplates.length;

  return (
    <div className="min-h-screen py-12">
      <div style={{ width: '100%', maxWidth: '1280px', margin: '0 auto', padding: '0 1rem' }}>
        <div className="mb-8 p-6 bg-background rounded-lg shadow-sm border">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-3xl font-bold">
              {(user.name || user.email || 'U')[0].toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-bold">{user.name || '未命名用户'}</h1>
              <p className="text-muted-foreground">
                {(user as any).role === 'ADMIN' ? '管理员' : 'AI 开发者'} · 分享了 {totalPosts} 个内容
              </p>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="mb-6">
            <TabsTrigger value="bookmarks" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              我的收藏
              <Badge variant="secondary">{bookmarks.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="articles" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              我的文章
              <Badge variant="secondary">{userArticles.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="cards" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              我的知识库
              <Badge variant="secondary">{userCards.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="templates" className="flex items-center gap-2">
              <Code className="w-4 h-4" />
              我的模板
              <Badge variant="secondary">{userTemplates.length}</Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="bookmarks">
            {bookmarks.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {bookmarks.map(({ post }: any) => {
                  if (post.type === 'ARTICLE') return <ArticleCard key={post.id} post={post} />;
                  if (post.type === 'CARD') return <KnowledgeCard key={post.id} post={post} />;
                  if (post.type === 'TEMPLATE') return <TemplateCard key={post.id} post={post} />;
                  return null;
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold mb-2">还没有收藏任何内容</h3>
                <p className="text-muted-foreground mb-4">浏览首页，找到你喜欢的内容并收藏吧！</p>
                <Button href="/">去首页</Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="articles">
            {userArticles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userArticles.map((post: any) => (
                  <ArticleCard key={post.id} post={post} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold mb-2">还没有发布任何文章</h3>
                <p className="text-muted-foreground mb-4">分享你的知识和经验，帮助更多人！</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="cards">
            {userCards.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userCards.map((post: any) => (
                  <KnowledgeCard key={post.id} post={post} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold mb-2">还没有发布任何知识库卡片</h3>
                <p className="text-muted-foreground mb-4">整理你的经验，创建结构化的解决方案！</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="templates">
            {userTemplates.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userTemplates.map((post: any) => (
                  <TemplateCard key={post.id} post={post} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold mb-2">还没有发布任何模板</h3>
                <p className="text-muted-foreground mb-4">分享你的代码和项目模板，帮助更多开发者！</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
