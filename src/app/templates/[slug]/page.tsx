import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ArrowLeft, Copy } from 'lucide-react';
import { getPostBySlug, getPosts } from '@/actions/content';
import { MDXRenderer } from '@/components/content/MDXRenderer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PostType } from '@/generated/prisma';

export const revalidate = 3600;

export async function generateStaticParams() {
  try {
    const { posts } = await getPosts({ type: PostType.TEMPLATE, take: 100 });
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
    if (!success || !post) return { title: '模板未找到' };
    return {
      title: post.metaTitle || post.title,
      description: post.metaDescription || post.excerpt || post.title,
      openGraph: {
        title: post.metaTitle || post.title,
        description: post.metaDescription || post.excerpt || undefined,
        type: 'article',
        url: `${baseUrl}/templates/${params.slug}`,
        ...(post.coverImage ? { images: [{ url: post.coverImage }] } : {}),
      },
      alternates: { canonical: `${baseUrl}/templates/${params.slug}` },
    };
  } catch {
    return { title: '模板详情' };
  }
}

export default async function TemplateDetailPage({ params }: { params: { slug: string } }) {
  const { success, post } = await getPostBySlug(params.slug);
  
  if (!success || !post) {
    notFound();
  }

  return (
    <div className="min-h-screen py-12">
      <div style={{ 
        width: '100%', 
        maxWidth: '1280px', 
        margin: '0 auto', 
        padding: '0 1rem' 
      }}>
        <Button variant="ghost" className="p-0 mb-8" href="/templates">
          <ArrowLeft className="mr-2 h-4 w-4" />
          返回模板库
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
          </header>

          <div className="border-t pt-8">
            <MDXRenderer content={post.content} />
          </div>
        </article>
      </div>
    </div>
  );
}
