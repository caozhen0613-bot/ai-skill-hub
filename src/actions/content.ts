'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { PostType, Status } from '@/generated/prisma';

// 创建 Post
export async function createPost(data: {
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  type: PostType;
  tagNames?: string[];
  authorId: string;
}) {
  try {
    const post = await prisma.post.create({
      data: {
        title: data.title,
        slug: data.slug,
        content: data.content,
        excerpt: data.excerpt,
        type: data.type,
        authorId: data.authorId,
        tags: data.tagNames
          ? {
              create: data.tagNames.map((tagName) => ({
                tag: {
                  connectOrCreate: {
                    where: { name: tagName },
                    create: { name: tagName }
                  }
                }
              }))
            }
          : undefined
      }
    });
    revalidatePath('/');
    revalidatePath('/articles');
    revalidatePath('/cards');
    revalidatePath('/templates');
    return { success: true, post };
  } catch (error) {
    console.error('Error creating post:', error);
    return { success: false, error: 'Failed to create post' };
  }
}

// 获取单个 Post
export async function getPost(id: string) {
  try {
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        author: true,
        tags: { include: { tag: true } },
        comments: { orderBy: { createdAt: 'desc' } },
        _count: { select: { likes: true, bookmarks: true } }
      }
    });
    return { success: true, post };
  } catch (error) {
    console.error('Error fetching post:', error);
    return { success: false, error: 'Failed to fetch post' };
  }
}

// 通过 Slug 获取 Post
export async function getPostBySlug(slug: string) {
  try {
    const post = await prisma.post.findUnique({
      where: { slug },
      include: {
        author: true,
        tags: { include: { tag: true } },
        comments: { orderBy: { createdAt: 'desc' } },
        _count: { select: { likes: true, bookmarks: true } }
      }
    });
    return { success: true, post };
  } catch (error) {
    console.error('Error fetching post by slug:', error);
    return { success: false, error: 'Failed to fetch post' };
  }
}

// 获取 Post 列表
export async function getPosts(params?: {
  type?: PostType;
  status?: Status;
  take?: number;
  skip?: number;
  tagName?: string;
}) {
  try {
    const { type, status = Status.PUBLISHED, take = 10, skip = 0, tagName } = params || {};
    
    const where: any = { status };
    if (type) {
      where.type = type;
    }
    if (tagName) {
      where.tags = { some: { tag: { name: tagName } } };
    }

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        include: {
          author: true,
          tags: { include: { tag: true } },
          _count: { select: { likes: true, comments: true } }
        },
        orderBy: { createdAt: 'desc' },
        take,
        skip
      }),
      prisma.post.count({ where })
    ]);
    return { success: true, posts, total };
  } catch (error) {
    console.error('Error fetching posts:', error);
    return { success: false, error: 'Failed to fetch posts' };
  }
}

// 更新 Post
export async function updatePost(
  id: string,
  data: {
    title?: string;
    slug?: string;
    content?: string;
    excerpt?: string;
    type?: PostType;
    status?: Status;
    tagNames?: string[];
  }
) {
  try {
    const post = await prisma.post.update({
      where: { id },
      data: {
        title: data.title,
        slug: data.slug,
        content: data.content,
        excerpt: data.excerpt,
        type: data.type,
        status: data.status,
        tags: data.tagNames
          ? {
              deleteMany: {},
              create: data.tagNames.map((tagName) => ({
                tag: {
                  connectOrCreate: {
                    where: { name: tagName },
                    create: { name: tagName }
                  }
                }
              }))
            }
          : undefined
      }
    });
    revalidatePath('/');
    revalidatePath('/articles');
    revalidatePath('/cards');
    revalidatePath('/templates');
    revalidatePath(`/articles/${post.slug}`);
    revalidatePath(`/cards/${post.slug}`);
    revalidatePath(`/templates/${post.slug}`);
    return { success: true, post };
  } catch (error) {
    console.error('Error updating post:', error);
    return { success: false, error: 'Failed to update post' };
  }
}

// 删除 Post
export async function deletePost(id: string) {
  try {
    await prisma.post.delete({ where: { id } });
    revalidatePath('/');
    revalidatePath('/articles');
    revalidatePath('/cards');
    revalidatePath('/templates');
    return { success: true };
  } catch (error) {
    console.error('Error deleting post:', error);
    return { success: false, error: 'Failed to delete post' };
  }
}

// 发布 Post
export async function publishPost(id: string) {
  try {
    const post = await prisma.post.update({
      where: { id },
      data: { status: Status.PUBLISHED }
    });
    revalidatePath('/');
    revalidatePath('/articles');
    revalidatePath('/cards');
    revalidatePath('/templates');
    return { success: true, post };
  } catch (error) {
    console.error('Error publishing post:', error);
    return { success: false, error: 'Failed to publish post' };
  }
}

// ------------评论相关功能 ------------

// 发表评论
export async function createComment(data: {
  content: string;
  postId: string;
  authorId: string;
  parentId?: string;
}) {
  try {
    const comment = await prisma.comment.create({
      data: {
        content: data.content,
        postId: data.postId,
        authorId: data.authorId,
        parentId: data.parentId
      }
    });
    revalidatePath(`/articles`);
    revalidatePath(`/cards`);
    revalidatePath(`/templates`);
    return { success: true, comment };
  } catch (error) {
    console.error('Error creating comment:', error);
    return { success: false, error: 'Failed to create comment' };
  }
}

// 删除评论
export async function deleteComment(commentId: string, userId: string) {
  try {
    const comment = await prisma.comment.findUnique({
      where: { id: commentId }
    });
    if (!comment || comment.authorId !== userId) {
      return { success: false, error: 'Unauthorized' };
    }
    await prisma.comment.delete({ where: { id: commentId } });
    revalidatePath(`/articles`);
    revalidatePath(`/cards`);
    revalidatePath(`/templates`);
    return { success: true };
  } catch (error) {
    console.error('Error deleting comment:', error);
    return { success: false, error: 'Failed to delete comment' };
  }
}

// ------------ 点赞相关功能 ------------

// 切换点赞
export async function toggleLike(postId: string, userId: string) {
  try {
    const existingLike = await prisma.like.findUnique({
      where: { userId_postId: { userId, postId } }
    });

    if (existingLike) {
      // 取消点赞
      await prisma.like.delete({
        where: { userId_postId: { userId, postId } }
      });
      revalidatePath('/');
      revalidatePath('/articles');
      revalidatePath('/cards');
      revalidatePath('/templates');
      return { success: true, liked: false };
    } else {
      // 添加点赞
      await prisma.like.create({
        data: { userId, postId }
      });
      revalidatePath('/');
      revalidatePath('/articles');
      revalidatePath('/cards');
      revalidatePath('/templates');
      return { success: true, liked: true };
    }
  } catch (error) {
    console.error('Error toggling like:', error);
    return { success: false, error: 'Failed to toggle like' };
  }
}

// ------------ 收藏相关功能 ------------

// 切换收藏
export async function toggleBookmark(postId: string, userId: string) {
  try {
    const existingBookmark = await prisma.bookmark.findUnique({
      where: { userId_postId: { userId, postId } }
    });

    if (existingBookmark) {
      // 取消收藏
      await prisma.bookmark.delete({
        where: { userId_postId: { userId, postId } }
      });
      revalidatePath('/');
      revalidatePath('/articles');
      revalidatePath('/cards');
      revalidatePath('/templates');
      return { success: true, bookmarked: false };
    } else {
      // 添加收藏
      await prisma.bookmark.create({
        data: { userId, postId }
      });
      revalidatePath('/');
      revalidatePath('/articles');
      revalidatePath('/cards');
      revalidatePath('/templates');
      return { success: true, bookmarked: true };
    }
  } catch (error) {
    console.error('Error toggling bookmark:', error);
    return { success: false, error: 'Failed to toggle bookmark' };
  }
}

// 获取用户的收藏列表
export async function getUserBookmarks(userId: string) {
  try {
    const bookmarks = await prisma.bookmark.findMany({
      where: { userId },
      include: { post: { include: { author: true, tags: { include: { tag: true } } } } }
    });
    return { success: true, bookmarks };
  } catch (error) {
    console.error('Error getting user bookmarks:', error);
    return { success: false, error: 'Failed to get bookmarks' };
  }
}

// ------------ 标签相关功能 ------------

// 获取所有标签
export async function getAllTags() {
  try {
    const tags = await prisma.tag.findMany({
      include: { _count: { select: { posts: true } } }
    });
    return { success: true, tags };
  } catch (error) {
    console.error('Error getting tags:', error);
    return { success: false, error: 'Failed to get tags' };
  }
}
