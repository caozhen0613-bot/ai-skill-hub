import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sparkles, ArrowRight } from 'lucide-react';
import type { Post } from '@/generated/prisma';

interface KnowledgeCardProps {
  post: Post & {
    tags?: { tag: { name: string } }[];
    _count?: { likes: number; comments: number };
  };
}

export function KnowledgeCard({ post }: KnowledgeCardProps) {
  return (
    <Link href={`/cards/${post.slug}`}>
      <Card className="h-full hover:shadow-md transition-shadow border-0 bg-white dark:bg-gray-800">
        <CardHeader>
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="h-6 w-6 text-amber-500" />
          </div>
          <CardTitle className="text-lg line-clamp-2">{post.title}</CardTitle>
          <CardDescription className="line-clamp-3">
            {post.excerpt || post.content.substring(0, 120)}...
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags?.map(({ tag }) => (
              <Badge key={tag.name} variant="outline">
                {tag.name}
              </Badge>
            ))}
          </div>
          <Button variant="ghost" className="p-0">
            查看详情
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    </Link>
  );
}
