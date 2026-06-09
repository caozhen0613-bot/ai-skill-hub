import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Code, Copy, ExternalLink } from 'lucide-react';
import type { Post } from '@/generated/prisma';

interface TemplateCardProps {
  post: Post & {
    tags?: { tag: { name: string } }[];
    _count?: { likes: number; comments: number };
  };
}

export function TemplateCard({ post }: TemplateCardProps) {
  return (
    <Link href={`/templates/${post.slug}`}>
      <Card className="h-full hover:shadow-md transition-shadow border-0 bg-white dark:bg-gray-800">
        <CardHeader>
          <div className="flex items-center gap-2 mb-3">
            <Code className="h-6 w-6 text-blue-500" />
          </div>
          <CardTitle className="text-lg line-clamp-2">{post.title}</CardTitle>
          <CardDescription className="line-clamp-3">
            {post.excerpt || post.content.substring(0, 120)}...
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags?.map(({ tag }) => (
              <Badge key={tag.name} variant="secondary">
                {tag.name}
              </Badge>
            ))}
          </div>
          <Button variant="default" size="sm" className="w-full">
            查看详情
          </Button>
        </CardContent>
      </Card>
    </Link>
  );
}
