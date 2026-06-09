import { Metadata } from 'next';
import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { MDXRenderer } from '@/components/content/MDXRenderer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArticleInteractions } from '@/components/content/ArticleInteractions';
import { getPostBySlug, getPosts } from '@/actions/content';
import { PostType } from '@/generated/prisma';

export const revalidate = 3600;

export async function generateStaticParams() {
  try {
    const { posts } = await getPosts({ type: PostType.ARTICLE, take: 100 });
    return (posts || []).map((post: any) => ({ slug: post.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ai-skill-hub.vercel.app';

  try {
    const { success, post } = await getPostBySlug(params.slug);
    if (!success || !post) {
      return { title: '文章未找到' };
    }

    return {
      title: post.metaTitle || post.title,
      description: post.metaDescription || post.excerpt || post.title,
      authors: post.author?.name ? [{ name: post.author.name }] : undefined,
      openGraph: {
        title: post.metaTitle || post.title,
        description: post.metaDescription || post.excerpt || undefined,
        type: 'article',
        publishedTime: post.createdAt.toISOString(),
        modifiedTime: post.updatedAt.toISOString(),
        url: `${baseUrl}/articles/${params.slug}`,
        ...(post.coverImage ? { images: [{ url: post.coverImage }] } : {}),
      },
      alternates: {
        canonical: `${baseUrl}/articles/${params.slug}`,
      },
    };
  } catch {
    return { title: '文章详情' };
  }
}

export default async function ArticleDetailPage({ params }: { params: { slug: string } }) {
  let post: any;
  let comments: any[] = [];
  const userId = undefined;

  try {
    const result = await getPostBySlug(params.slug);
    if (!result.success || !result.post) {
      return (
        <div className="min-h-screen py-12">
          <div style={{ width: '100%', maxWidth: '1280px', margin: '0 auto', padding: '0 1rem' }}>
            <h1 className="text-4xl font-bold mb-4">文章未找到</h1>
            <Button variant="outline" href="/articles">
              <ArrowLeft className="mr-2 h-4 w-4" />
              返回文章列表
            </Button>
          </div>
        </div>
      );
    }

    post = result.post;
    comments = post.comments || [];
  } catch {
    return (
      <div className="min-h-screen py-12">
        <div style={{ width: '100%', maxWidth: '1280px', margin: '0 auto', padding: '0 1rem' }}>
          <h1 className="text-4xl font-bold mb-4">加载失败</h1>
          <Button variant="outline" href="/articles">
            <ArrowLeft className="mr-2 h-4 w-4" />
            返回文章列表
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div style={{ width: '100%', maxWidth: '1280px', margin: '0 auto', padding: '0 1rem' }}>
        <Button variant="ghost" className="p-0 mb-8" href="/articles">
          <ArrowLeft className="mr-2 h-4 w-4" />
          返回文章列表
        </Button>

        <article>
          <header className="mb-8">
            <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
            <div className="flex flex-wrap items-center gap-3 mb-4">
              {post.tags?.map(({ tag }: { tag: { name: string } }) => (
                <Badge key={tag.name} variant="secondary">
                  {tag.name}
                </Badge>
              ))}
            </div>
            {post.excerpt && (
              <p className="text-lg text-muted-foreground">{post.excerpt}</p>
            )}
            <div className="flex items-center gap-3 mt-4 text-sm text-muted-foreground">
              {post.author?.name && <span>{post.author.name}</span>}
              <span>·</span>
              <span>{new Date(post.createdAt).toLocaleDateString('zh-CN')}</span>
            </div>
          </header>

          <ArticleInteractions
            post={post}
            initialComments={comments}
            initialLiked={false}
            initialBookmarked={false}
            userId={userId}
          />

          <div className="border-t pt-8">
            <MDXRenderer content={post.content} />
          </div>
        </article>
      </div>
    </div>
  );
}
