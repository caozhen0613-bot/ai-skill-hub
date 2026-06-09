'use server';

import prisma from '@/lib/prisma';

export async function createPostVersion(postId: string, editorId?: string) {
  try {
    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) return { success: false, error: 'Post not found' };

    const latestVersion = await prisma.postVersion.findFirst({
      where: { postId },
      orderBy: { version: 'desc' },
    });

    const newVersion = (latestVersion?.version || 0) + 1;

    await prisma.postVersion.create({
      data: {
        postId: post.id,
        title: post.title,
        content: post.content,
        excerpt: post.excerpt,
        version: newVersion,
        editorId: editorId || null,
      },
    });

    return { success: true, version: newVersion };
  } catch (error) {
    console.error('Error creating version:', error);
    return { success: false, error: 'Failed to create version' };
  }
}

export async function getPostVersions(postId: string) {
  try {
    const versions = await prisma.postVersion.findMany({
      where: { postId },
      orderBy: { version: 'desc' },
      include: { editor: { select: { name: true } } },
    });
    return { success: true, versions };
  } catch (error) {
    console.error('Error getting versions:', error);
    return { success: false, error: 'Failed to get versions' };
  }
}
