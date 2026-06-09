import React from 'react';
import Link from 'next/link';
import { getDashboardStats } from '@/actions/admin';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Users, MessageSquare, Tags } from 'lucide-react';

export default async function AdminDashboardPage() {
  const { success, stats } = await getDashboardStats();

  if (!success || !stats) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">无法加载统计数据</p>
      </div>
    );
  }

  const statCards = [
    { label: '总内容数', value: stats.totalPosts, icon: FileText, href: '/admin/posts' },
    { label: '总用户数', value: stats.totalUsers, icon: Users, href: '/admin/users' },
    { label: '总评论数', value: stats.totalComments, icon: MessageSquare, href: '/admin/comments' },
    { label: '总标签数', value: stats.totalTags, icon: Tags, href: '/admin/posts' },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">管理概览</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link key={card.label} href={card.href}>
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {card.label}
                  </CardTitle>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{card.value}</div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* 各类型内容分布 */}
      <div className="mb-12">
        <h2 className="text-xl font-semibold mb-4">内容分布</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {stats.postsByType.map((item: any) => (
            <Card key={item.type}>
              <CardHeader>
                <CardTitle className="text-sm">
                  {item.type === 'ARTICLE' ? '文章' : item.type === 'CARD' ? '知识库卡片' : '模板'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{item._count}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* 最近内容 */}
      <div>
        <h2 className="text-xl font-semibold mb-4">最近发布</h2>
        <div className="space-y-3">
          {stats.recentPosts.map((post: any) => (
            <Card key={post.id}>
              <CardContent className="flex items-center justify-between py-4">
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/admin/posts`}
                    className="font-medium hover:text-primary truncate block"
                  >
                    {post.title}
                  </Link>
                  <p className="text-sm text-muted-foreground">
                    {post.author?.name || '未知作者'} · {post.type === 'ARTICLE' ? '文章' : post.type === 'CARD' ? '卡片' : '模板'}
                    {' · '}{post._count.comments} 评论 · {post._count.likes} 点赞
                  </p>
                </div>
                <span className="text-sm text-muted-foreground whitespace-nowrap ml-4">
                  {post.createdAt.toLocaleDateString('zh-CN')}
                </span>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}