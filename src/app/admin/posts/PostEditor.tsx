'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createPost, updatePost } from '@/actions/content';
import { createPostVersion } from '@/actions/version';
import { PostType, Status } from '@/generated/prisma';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Save, Eye } from 'lucide-react';

type FormData = {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  coverImage: string;
  type: PostType;
  status: Status;
  featured: boolean;
  isPinned: boolean;
  metaTitle: string;
  metaDescription: string;
  tagNames: string;
  authorId: string;
};

const emptyForm: FormData = {
  title: '',
  slug: '',
  content: '',
  excerpt: '',
  coverImage: '',
  type: PostType.ARTICLE,
  status: Status.DRAFT,
  featured: false,
  isPinned: false,
  metaTitle: '',
  metaDescription: '',
  tagNames: '',
  authorId: '',
};

export function PostEditor({ initialData }: { initialData?: any }) {
  const router = useRouter();
  const [form, setForm] = useState<FormData>(
    initialData
      ? {
          title: initialData.title || '',
          slug: initialData.slug || '',
          content: initialData.content || '',
          excerpt: initialData.excerpt || '',
          coverImage: initialData.coverImage || '',
          type: initialData.type || PostType.ARTICLE,
          status: initialData.status || Status.DRAFT,
          featured: initialData.featured || false,
          isPinned: initialData.isPinned || false,
          metaTitle: initialData.metaTitle || '',
          metaDescription: initialData.metaDescription || '',
          tagNames: initialData.tags?.map((t: any) => t.tag.name).join(', ') || '',
          authorId: initialData.authorId || '',
        }
      : emptyForm
  );
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(false);
  const isEditing = !!initialData?.id;

  const handleChange = (field: keyof FormData, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const tagNames = form.tagNames
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      if (isEditing) {
        if (initialData?.id) {
          await createPostVersion(initialData.id);
        }
        await updatePost(initialData.id, {
          title: form.title,
          slug: form.slug,
          content: form.content,
          excerpt: form.excerpt,
          type: form.type,
          status: form.status,
          tagNames,
        });
      } else {
        await createPost({
          title: form.title,
          slug: form.slug,
          content: form.content,
          excerpt: form.excerpt,
          type: form.type,
          tagNames,
          authorId: form.authorId,
        });
      }

      router.push('/admin/posts');
      router.refresh();
    } catch (err) {
      console.error('Save failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.push('/admin/posts')}>
            <ArrowLeft className="mr-2 h-4 w-4" /> 返回
          </Button>
          <h1 className="text-3xl font-bold">{isEditing ? '编辑内容' : '创建内容'}</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPreview(!preview)}
          >
            <Eye className="mr-2 h-4 w-4" />
            {preview ? '编辑' : '预览'}
          </Button>
          <Button type="submit" form="post-form" size="sm" disabled={loading}>
            <Save className="mr-2 h-4 w-4" />
            {loading ? '保存中...' : '保存'}
          </Button>
        </div>
      </div>

      <form id="post-form" onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content area */}
        <div className="lg:col-span-2 space-y-4">
          <div>
            <label className="text-sm font-medium mb-1 block">标题</label>
            <Input
              value={form.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="内容标题"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Slug</label>
            <Input
              value={form.slug}
              onChange={(e) => handleChange('slug', e.target.value)}
              placeholder="url-friendly-slug"
              required
            />
          </div>

          {preview ? (
            <div className="border rounded-lg p-6 min-h-[400px] bg-background">
              <div className="prose max-w-none dark:prose-invert" dangerouslySetInnerHTML={{ __html: form.content.replace(/\n/g, '<br/>') }} />
            </div>
          ) : (
            <div>
              <label className="text-sm font-medium mb-1 block">内容 (Markdown)</label>
              <textarea
                value={form.content}
                onChange={(e) => handleChange('content', e.target.value)}
                placeholder="# 使用 Markdown 编写..."
                className="w-full min-h-[400px] px-3 py-2 border rounded-md bg-background font-mono text-sm"
                required
              />
            </div>
          )}

          <div>
            <label className="text-sm font-medium mb-1 block">摘要</label>
            <Input
              value={form.excerpt}
              onChange={(e) => handleChange('excerpt', e.target.value)}
              placeholder="简短描述..."
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="p-4 border rounded-lg bg-card">
            <h3 className="font-medium mb-4">发布设置</h3>

            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium mb-1 block">类型</label>
                <select
                  className="w-full border rounded-md px-3 py-2 text-sm bg-background"
                  value={form.type}
                  onChange={(e) => handleChange('type', e.target.value)}
                >
                  <option value="ARTICLE">文章</option>
                  <option value="CARD">知识库卡片</option>
                  <option value="TEMPLATE">模板</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">状态</label>
                <select
                  className="w-full border rounded-md px-3 py-2 text-sm bg-background"
                  value={form.status}
                  onChange={(e) => handleChange('status', e.target.value)}
                >
                  <option value="DRAFT">草稿</option>
                  <option value="PUBLISHED">发布</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={form.featured}
                  onChange={(e) => handleChange('featured', e.target.checked)}
                />
                <label htmlFor="featured" className="text-sm">精选内容</label>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isPinned"
                  checked={form.isPinned}
                  onChange={(e) => handleChange('isPinned', e.target.checked)}
                />
                <label htmlFor="isPinned" className="text-sm">置顶</label>
              </div>

              {!isEditing && (
                <div>
                  <label className="text-sm font-medium mb-1 block">作者 ID</label>
                  <Input
                    value={form.authorId}
                    onChange={(e) => handleChange('authorId', e.target.value)}
                    placeholder="用户ID"
                    required
                  />
                </div>
              )}
            </div>
          </div>

          <div className="p-4 border rounded-lg bg-card">
            <h3 className="font-medium mb-4">封面与 SEO</h3>

            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium mb-1 block">封面图 URL</label>
                <Input
                  value={form.coverImage}
                  onChange={(e) => handleChange('coverImage', e.target.value)}
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">SEO 标题</label>
                <Input
                  value={form.metaTitle}
                  onChange={(e) => handleChange('metaTitle', e.target.value)}
                  placeholder="留空则使用文章标题"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">SEO 描述</label>
                <Input
                  value={form.metaDescription}
                  onChange={(e) => handleChange('metaDescription', e.target.value)}
                  placeholder="留空则使用摘要"
                />
              </div>
            </div>
          </div>

          <div className="p-4 border rounded-lg bg-card">
            <h3 className="font-medium mb-4">标签</h3>
            <div>
              <Input
                value={form.tagNames}
                onChange={(e) => handleChange('tagNames', e.target.value)}
                placeholder="用逗号分隔，如: 入门,教程"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
