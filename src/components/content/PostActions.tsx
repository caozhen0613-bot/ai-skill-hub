'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Heart, Bookmark, MessageSquare } from 'lucide-react';

interface PostActionsProps {
  postId: string;
  userId?: string;
  likeCount: number;
  bookmarkCount: number;
  commentCount: number;
  isLiked?: boolean;
  isBookmarked?: boolean;
  onToggleLike?: () => Promise<void>;
  onToggleBookmark?: () => Promise<void>;
  onCommentClick?: () => void;
}

export function PostActions({
  postId,
  userId,
  likeCount,
  bookmarkCount,
  commentCount,
  isLiked = false,
  isBookmarked = false,
  onToggleLike,
  onToggleBookmark,
  onCommentClick
}: PostActionsProps) {
  return (
    <div className="flex items-center gap-4 py-4">
      {/* 点赞 */}
      <Button 
        variant="ghost" 
        onClick={onToggleLike} 
        disabled={!userId}
        className="flex items-center gap-2"
      >
        <Heart 
          className={`w-5 h-5 ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} 
        />
        <span className="text-sm">{likeCount}</span>
      </Button>

      {/* 收藏 */}
      <Button 
        variant="ghost" 
        onClick={onToggleBookmark} 
        disabled={!userId}
        className="flex items-center gap-2"
      >
        <Bookmark 
          className={`w-5 h-5 ${isBookmarked ? 'fill-blue-500 text-blue-500' : 'text-gray-600'}`} 
        />
        <span className="text-sm">{bookmarkCount}</span>
      </Button>

      {/* 评论 */}
      <Button 
        variant="ghost" 
        onClick={onCommentClick}
        className="flex items-center gap-2"
      >
        <MessageSquare className="w-5 h-5 text-gray-600" />
        <span className="text-sm">{commentCount}</span>
      </Button>
    </div>
  );
}