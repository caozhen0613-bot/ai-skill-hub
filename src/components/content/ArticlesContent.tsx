'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ArticleCard } from '@/components/content/ArticleCard';
import { SearchSection } from '@/components/content/SearchSection';

export function ArticlesContent({ initialPosts }: { initialPosts: any[] }) {
  const [filteredPosts, setFilteredPosts] = useState(initialPosts);

  const handleSearch = (query: string, selectedTag?: string) => {
    let filtered = initialPosts;

    if (query) {
      const lowerQuery = query.toLowerCase();
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(lowerQuery) ||
          (post.excerpt && post.excerpt.toLowerCase().includes(lowerQuery)) ||
          post.tags?.some(({ tag }: { tag: { name: string } }) =>
            tag.name.toLowerCase().includes(lowerQuery)
          )
      );
    }

    if (selectedTag) {
      filtered = filtered.filter((post) =>
        post.tags?.some(({ tag }: { tag: { name: string } }) => tag.name === selectedTag)
      );
    }

    setFilteredPosts(filtered);
  };

  return (
    <div className="min-h-screen py-20">
      <div style={{ width: '100%', maxWidth: '1280px', margin: '0 auto', padding: '0 1rem' }}>
        <div className="mb-8">
          <Button variant="ghost" className="p-0 mb-4" href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            返回首页
          </Button>
          <h1 className="text-4xl font-bold mb-4">文章</h1>
          <p className="text-muted-foreground text-lg">
            探索 AI Agent 开发的技术文章和教程
          </p>
        </div>

        <SearchSection onSearch={handleSearch} />

        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post: any) => (
              <ArticleCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">暂无符合条件的文章</p>
          </div>
        )}
      </div>
    </div>
  );
}
