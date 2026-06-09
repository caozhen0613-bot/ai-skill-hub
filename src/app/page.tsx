import React from 'react';
import { Metadata } from 'next';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Sparkles, BookOpen, Code, Search, ArrowRight } from "lucide-react";
import { getPosts } from '@/actions/content';
import { ArticleCard } from '@/components/content/ArticleCard';
import { KnowledgeCard } from '@/components/content/KnowledgeCard';
import { TemplateCard } from '@/components/content/TemplateCard';
import { PostType, Status } from '@/generated/prisma';
import type { Post } from '@/generated/prisma';

export const metadata: Metadata = {
  title: 'AI Skill Hub - 发现 AI Agent 的无限可能',
  description: '小而精的 AI 技能社区，专注于 AI Agent 技能、场景解决方案和工作流的分享平台',
};

export default async function Home() {
  const [
    { posts: articles = [] },
    { posts: cards = [] },
    { posts: templates = [] }
  ] = await Promise.all([
    getPosts({ type: PostType.ARTICLE, status: Status.PUBLISHED, take: 3 }),
    getPosts({ type: PostType.CARD, status: Status.PUBLISHED, take: 3 }),
    getPosts({ type: PostType.TEMPLATE, status: Status.PUBLISHED, take: 3 })
  ]);

  const typedArticles = articles as Post[];
  const typedCards = cards as Post[];
  const typedTemplates = templates as Post[];

  return (
    <div className="min-h-screen">
      <section className="py-20 md:py-32">
        <div style={{ width: '100%', maxWidth: '1280px', margin: '0 auto', padding: '0 1rem' }}>
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-2 text-sm mb-6">
              <Sparkles className="h-4 w-4" />
              <span>发现 AI Agent 的无限可能</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              小而精的 AI 技能社区
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              专注于 AI Agent 技能、场景解决方案和工作流的分享平台，帮助你快速找到实用的学习资源。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <div className="relative w-full max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="search"
                  placeholder="搜索文章、知识库或模板..."
                  className="w-full pl-10 pr-4 py-3 rounded-lg border bg-background"
                />
              </div>
              <Button size="lg">
                开始探索
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-muted/50">
        <div style={{ width: '100%', maxWidth: '1280px', margin: '0 auto', padding: '0 1rem' }}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <BookOpen className="h-8 w-8 mb-2 text-primary" />
                <CardTitle>图文文章</CardTitle>
                <CardDescription>
                  深度解析 AI Agent 开发的技术文章，从基础到进阶。
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="ghost" className="w-full justify-start p-0" href="/articles">
                  浏览文章
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <Sparkles className="h-8 w-8 mb-2 text-primary" />
                <CardTitle>知识库卡片</CardTitle>
                <CardDescription>
                  结构化的场景解决方案，快速找到适用的 AI 方案。
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="ghost" className="w-full justify-start p-0" href="/cards">
                  探索知识库
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <Code className="h-8 w-8 mb-2 text-primary" />
                <CardTitle>代码模板</CardTitle>
                <CardDescription>
                  可直接使用的 AI Agent 代码模板，快速开始项目开发。
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="ghost" className="w-full justify-start p-0" href="/templates">
                  查看模板
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div style={{ width: '100%', maxWidth: '1280px', margin: '0 auto', padding: '0 1rem' }}>
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold">最新文章</h2>
              <p className="text-muted-foreground mt-2">探索最新的 AI 技术文章和教程</p>
            </div>
            <Button variant="outline" href="/articles">
              查看全部
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {typedArticles.length > 0 ? (
              typedArticles.map((article) => (
                <ArticleCard key={article.id} post={article} />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground">暂无文章</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/50">
        <div style={{ width: '100%', maxWidth: '1280px', margin: '0 auto', padding: '0 1rem' }}>
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold">精选知识库</h2>
              <p className="text-muted-foreground mt-2">结构化的场景解决方案卡片</p>
            </div>
            <Button variant="outline" href="/cards">
              查看全部
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {typedCards.length > 0 ? (
              typedCards.map((card) => (
                <KnowledgeCard key={card.id} post={card} />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground">暂无知识库卡片</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div style={{ width: '100%', maxWidth: '1280px', margin: '0 auto', padding: '0 1rem' }}>
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold">实用模板</h2>
              <p className="text-muted-foreground mt-2">可直接使用的代码模板和项目框架</p>
            </div>
            <Button variant="outline" href="/templates">
              查看全部
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {typedTemplates.length > 0 ? (
              typedTemplates.map((template) => (
                <TemplateCard key={template.id} post={template} />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground">暂无模板</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
