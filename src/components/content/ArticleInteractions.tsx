'use client';

import React, { useState } from 'react';
import { toggleLike, toggleBookmark, createComment, deleteComment } from '@/actions/content';
import { PostActions } from '@/components/content/PostActions';
import { CommentSection } from '@/components/content/CommentSection';

type ArticleData = {
  id: string;
  title: string;
  content: string;
  excerpt: string | null;
  tags: { tag: { name: string } }[];
  authorId: string;
  _count: { likes: number; bookmarks: number };
  createdAt: Date;
  updatedAt: Date;
};

type CommentData = {
  id: string;
  content: string;
  authorId: string;
  createdAt: Date;
  parentId?: string;
};

export function ArticleInteractions({
  post,
  initialComments,
  initialLiked,
  initialBookmarked,
  userId,
}: {
  post: ArticleData;
  initialComments: CommentData[];
  initialLiked: boolean;
  initialBookmarked: boolean;
  userId?: string;
}) {
  const [isLiked, setIsLiked] = useState(initialLiked);
  const [isBookmarked, setIsBookmarked] = useState(initialBookmarked);
  const [likeCount, setLikeCount] = useState(post._count.likes);
  const [bookmarkCount, setBookmarkCount] = useState(post._count.bookmarks);
  const [comments, setComments] = useState(initialComments);

  const handleToggleLike = async () => {
    setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
    try {
      await toggleLike(post.id, post.authorId);
    } catch {
      setIsLiked(isLiked);
      setLikeCount(likeCount);
    }
  };

  const handleToggleBookmark = async () => {
    setIsBookmarked(!isBookmarked);
    setBookmarkCount(isBookmarked ? bookmarkCount - 1 : bookmarkCount + 1);
    try {
      await toggleBookmark(post.id, post.authorId);
    } catch {
      setIsBookmarked(isBookmarked);
      setBookmarkCount(bookmarkCount);
    }
  };

  const handleCommentCreated = async (content: string, parentId?: string) => {
    const newComment: CommentData = {
      id: Date.now().toString(),
      content,
      authorId: userId || 'anonymous',
      createdAt: new Date(),
      parentId,
    };
    setComments([newComment, ...comments]);
    if (userId) {
      try {
        await createComment({ content, postId: post.id, authorId: userId, parentId });
      } catch {
        setComments(comments);
      }
    }
  };

  const handleCommentDeleted = async (commentId: string) => {
    setComments(comments.filter((c) => c.id !== commentId));
    if (userId) {
      try {
        await deleteComment(commentId, userId);
      } catch {
        // Revert handled via revalidation
      }
    }
  };

  return (
    <>
      <PostActions
        postId={post.id}
        userId={userId}
        likeCount={likeCount}
        bookmarkCount={bookmarkCount}
        commentCount={comments.length}
        isLiked={isLiked}
        isBookmarked={isBookmarked}
        onToggleLike={handleToggleLike}
        onToggleBookmark={handleToggleBookmark}
      />
      <CommentSection
        comments={comments as any}
        postId={post.id}
        userId={userId}
        onCommentCreated={handleCommentCreated}
        onCommentDeleted={handleCommentDeleted}
      />
    </>
  );
}
