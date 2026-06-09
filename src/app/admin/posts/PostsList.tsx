'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2, Eye, EyeOff, Star, Pin } from 'lucide-react';
import { deletePostAction, toggleStatusAction } from './actions';

export default function AdminPostsPage({
  posts,
  total,
  currentType,
  currentStatus,
  currentPage,
}: {
  posts: any[];
  total: number;
  currentType?: string;
  currentStatus?: string;
  currentPage: number;
}) {
  const typeLabels: Record<string, string> = {
    ARTICLE: '文章',
    CARD: '知识库',
    TEMPLATE: '模板',
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">内容管理</h1>
        <Link href="/admin/posts/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            创建内容
          </Button>
        </Link>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        <Link
          href="/admin/posts"
          className={`px-3 py-1.5 rounded-md text-sm ${!currentType && !currentStatus ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'}`}
        >
          全部
        </Link>
        {['ARTICLE', 'CARD', 'TEMPLATE'].map((t) => (
          <Link
            key={t}
            href={`/admin/posts?type=${t}`}
            className={`px-3 py-1.5 rounded-md text-sm ${currentType === t ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'}`}
          >
            {typeLabels[t]}
          </Link>
        ))}
        <Link
          href="/admin/posts?status=DRAFT"
          className={`px-3 py-1.5 rounded-md text-sm ${currentStatus === 'DRAFT' ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'}`}
        >
          草稿
        </Link>
      </div>

      {posts.length > 0 ? (
        <div className="space-y-3">
          {posts.map((post: any) => (
            <div key={post.id} className="flex items-center justify-between p-4 bg-card rounded-lg border hover:shadow-sm transition-shadow">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-medium truncate">{post.title}</h3>
                  {post.featured && <Star className="h-3.5 w-3.5 text-yellow-500" />}
                  {post.isPinned && <Pin className="h-3.5 w-3.5 text-blue-500" />}
                  <Badge variant={post.status === 'PUBLISHED' ? 'default' : 'secondary'}>
                    {post.status === 'PUBLISHED' ? '已发布' : '草稿'}
                  </Badge>
                  <Badge variant="outline">{typeLabels[post.type]}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {post.author?.name || '未知作者'} · {post._count?.comments || 0} 评论 · {post._count?.likes || 0} 点赞 · {post._count?.bookmarks || 0} 收藏
                  {' · '}{post.createdAt.toLocaleDateString('zh-CN')}
                </p>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <Link href={`/admin/posts/${post.id}/edit`}>
                  <Button variant="ghost" size="sm">
                    <Pencil className="h-4 w-4" />
                  </Button>
                </Link>
                <form action={toggleStatusAction.bind(null, post.id, post.status)}>
                  <Button variant="ghost" size="sm" type="submit">
                    {post.status === 'PUBLISHED' ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </form>
                <form action={deletePostAction.bind(null, post.id)}>
                  <Button variant="ghost" size="sm" type="submit" className="text-destructive hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </div>
          ))}

          {total > 20 && (
            <div className="flex justify-center gap-2 mt-8">
              {currentPage > 1 && (
                <Link
                  href={`/admin/posts?page=${currentPage - 1}${currentType ? `&type=${currentType}` : ''}${currentStatus ? `&status=${currentStatus}` : ''}`}
                  className="px-4 py-2 rounded-md bg-muted hover:bg-muted/80 text-sm"
                >
                  上一页
                </Link>
              )}
              <span className="px-4 py-2 text-sm text-muted-foreground">
                第 {currentPage} 页 / 共 {Math.ceil(total / 20)} 页
              </span>
              {currentPage < Math.ceil(total / 20) && (
                <Link
                  href={`/admin/posts?page=${currentPage + 1}${currentType ? `&type=${currentType}` : ''}${currentStatus ? `&status=${currentStatus}` : ''}`}
                  className="px-4 py-2 rounded-md bg-muted hover:bg-muted/80 text-sm"
                >
                  下一页
                </Link>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">暂无内容</p>
        </div>
      )}
    </div>
  );
}
