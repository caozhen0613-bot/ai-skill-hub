'use client';

import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Filter } from 'lucide-react';

interface SearchSectionProps {
  initialQuery?: string;
  initialTag?: string;
  onSearch?: (query: string, tag?: string) => void;
  tags?: Array<{ id: string; name: string; _count: { posts: number } }>;
}

export function SearchSection({
  initialQuery = '',
  initialTag,
  onSearch,
  tags = [
    { id: '1', name: '入门', _count: { posts: 12 } },
    { id: '2', name: '教程', _count: { posts: 15 } },
    { id: '3', name: '提示词', _count: { posts: 8 } },
    { id: '4', name: '最佳实践', _count: { posts: 10 } },
    { id: '5', name: 'RAG', _count: { posts: 7 } },
    { id: '6', name: '多 Agent', _count: { posts: 5 } }
  ]
}: SearchSectionProps) {
  const [query, setQuery] = useState(initialQuery);
  const [selectedTag, setSelectedTag] = useState<string | undefined>(initialTag);

  const handleSearch = () => {
    if (onSearch) {
      onSearch(query, selectedTag);
    }
  };

  const handleTagClick = (tagName: string) => {
    setSelectedTag(selectedTag === tagName ? undefined : tagName);
  };

  return (
    <div className="mb-8">
      {/* 搜索框 */}
      <div className="flex gap-2 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="搜索文章、知识库或模板..."
            className="pl-10"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearch();
              }
            }}
          />
        </div>
        <Button onClick={handleSearch}>搜索</Button>
      </div>

      {/* 标签云 */}
      {tags.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Filter className="w-4 h-4 text-gray-600" />
            <span className="font-semibold">筛选标签</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Badge
                key={tag.id}
                variant={selectedTag === tag.name ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => handleTagClick(tag.name)}
              >
                {tag.name}
                <span className="ml-1 text-xs opacity-70">({tag._count.posts})</span>
              </Badge>
            ))}
            {selectedTag && (
              <Button variant="ghost" size="sm" onClick={() => setSelectedTag(undefined)}>
                清除筛选
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}