'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

// ------------ 管理后台：Dashboard 概览 ------------

export async function getDashboardStats() {
  try {
    const [
      totalPosts,
      totalUsers,
      totalComments,
      totalTags,
      postsByType,
      recentPosts
    ] = await Promise.all([
      prisma.post.count(),
      prisma.user.count(),
      prisma.comment.count(),
      prisma.tag.count(),
      prisma.post.groupBy({
        by: ['type'],
        _count: true
      }),
      prisma.post.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          author: { select: { name: true } },
          _count: { select: { comments: true, likes: true } }
        }
      })
    ]);

    return {
      success: true,
      stats: { totalPosts, totalUsers, totalComments, totalTags, postsByType, recentPosts }
    };
  } catch (error) {
    console.error('Error getting dashboard stats:', error);
    return { success: false, error: 'Failed to get dashboard stats' };
  }
}

// ------------ 管理后台：Post 管理 ------------

export async function getAdminPosts(params?: {
  type?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}) {
  try {
    const { type, status, page = 1, pageSize = 20 } = params || {};
    const where: any = {};
    if (type) where.type = type;
    if (status) where.status = status;

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          author: { select: { name: true, email: true } },
          tags: { include: { tag: true } },
          _count: { select: { comments: true, likes: true, bookmarks: true } }
        }
      }),
      prisma.post.count({ where })
    ]);

    return { success: true, posts, total, page, pageSize };
  } catch (error) {
    console.error('Error getting admin posts:', error);
    return { success: false, error: 'Failed to get admin posts' };
  }
}

export async function adminDeletePost(id: string) {
  try {
    await prisma.post.delete({ where: { id } });
    revalidatePath('/admin/posts');
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Error deleting post:', error);
    return { success: false, error: 'Failed to delete post' };
  }
}

export async function adminUpdatePostStatus(id: string, status: string) {
  try {
    await prisma.post.update({
      where: { id },
      data: { status: status as any }
    });
    revalidatePath('/admin/posts');
    return { success: true };
  } catch (error) {
    console.error('Error updating post status:', error);
    return { success: false, error: 'Failed to update post status' };
  }
}

// ------------ 管理后台：用户管理 ------------

export async function getAdminUsers(params?: {
  page?: number;
  pageSize?: number;
}) {
  try {
    const { page = 1, pageSize = 20 } = params || {};
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          _count: { select: { posts: true, comments: true, likes: true } }
        }
      }),
      prisma.user.count()
    ]);
    return { success: true, users, total, page, pageSize };
  } catch (error) {
    console.error('Error getting admin users:', error);
    return { success: false, error: 'Failed to get admin users' };
  }
}

export async function adminUpdateUserRole(userId: string, role: string) {
  try {
    await prisma.user.update({
      where: { id: userId },
      data: { role: role as any }
    });
    revalidatePath('/admin/users');
    return { success: true };
  } catch (error) {
    console.error('Error updating user role:', error);
    return { success: false, error: 'Failed to update user role' };
  }
}

// ------------ 管理后台：评论管理 ------------

export async function getAdminComments(params?: {
  page?: number;
  pageSize?: number;
}) {
  try {
    const { page = 1, pageSize = 20 } = params || {};
    const [comments, total] = await Promise.all([
      prisma.comment.findMany({
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          author: { select: { name: true, email: true } },
          post: { select: { title: true, slug: true } }
        }
      }),
      prisma.comment.count()
    ]);
    return { success: true, comments, total, page, pageSize };
  } catch (error) {
    console.error('Error getting admin comments:', error);
    return { success: false, error: 'Failed to get admin comments' };
  }
}

export async function adminDeleteComment(commentId: string) {
  try {
    // First delete replies
    await prisma.comment.deleteMany({ where: { parentId: commentId } });
    await prisma.comment.delete({ where: { id: commentId } });
    revalidatePath('/admin/comments');
    return { success: true };
  } catch (error) {
    console.error('Error deleting comment:', error);
    return { success: false, error: 'Failed to delete comment' };
  }
}