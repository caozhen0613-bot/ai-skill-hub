import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Eye, MessageSquare } from 'lucide-react';
import type { Post } from '@/generated/prisma';
import { PostType } from '@/generated/prisma';

interface ArticleCardProps {
  post: Post & {
    tags?: { tag: { name: string } }[];
    _count?: { likes: number; comments: number };
  };
}

export function ArticleCard({ post }: ArticleCardProps) {
  return (
    <Link href={`/articles/${post.slug}`}>
      <Card className="h-full hover:shadow-md transition-shadow border-0 bg-white dark:bg-gray-800">
        <CardHeader>
          <div className="flex flex-wrap gap-2 mb-3">
            {post.tags?.map(({ tag }) => (
              <Badge key={tag.name} variant="secondary">
                {tag.name}
              </Badge>
            ))}
          </div>
          <CardTitle className="text-xl line-clamp-2">{post.title}</CardTitle>
          <CardDescription className="line-clamp-3">
            {post.excerpt || post.content.substring(0, 150)}...
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(post.createdAt)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              <span>{post.viewCount}</span>
            </div>
            {post._count && (
              <div className="flex items-center gap-1">
                <MessageSquare className="w-4 h-4" />
                <span>{post._count.comments}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{estimateReadTime(post.content)} min read</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function estimateReadTime(content: string) {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
}
