'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

interface Comment {
  id: string;
  content: string;
  authorId: string;
  createdAt: Date;
  parentId?: string;
}

interface CommentSectionProps {
  comments: Comment[];
  postId: string;
  userId?: string;
  onCommentCreated?: (content: string, parentId?: string) => Promise<any>;
  onCommentDeleted?: (commentId: string) => Promise<any>;
}

export function CommentSection({ 
  comments, 
  postId, 
  userId, 
  onCommentCreated, 
  onCommentDeleted 
}: CommentSectionProps) {
  const [newComment, setNewComment] = useState('');
  const [replyToId, setReplyToId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitComment = async () => {
    if (!newComment.trim() || !onCommentCreated) return;
    setIsSubmitting(true);
    try {
      await onCommentCreated(newComment, replyToId || undefined);
      setNewComment('');
      setReplyToId(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!onCommentDeleted) return;
    try {
      await onCommentDeleted(commentId);
    } catch (error) {
      console.error('Failed to delete comment:', error);
    }
  };

  const renderComment = (comment: Comment, isNested = false) => (
    <Card key={comment.id} className={`mb-4 ${isNested ? 'ml-8 border-l-4 border-gray-200' : ''}`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            用户 {comment.authorId.substring(0, 8)} · {new Date(comment.createdAt).toLocaleString()}
          </div>
          {userId === comment.authorId && (
            <Button variant="ghost" size="sm" onClick={() => handleDeleteComment(comment.id)}>
              删除
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <p>{comment.content}</p>
        <div className="mt-2">
          <Button variant="ghost" size="sm" onClick={() => setReplyToId(comment.id)}>
            回复
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const topLevelComments = comments.filter(c => !c.parentId);
  const nestedComments = comments.filter(c => !!c.parentId);

  return (
    <div className="mt-8 pt-8 border-t">
      <h3 className="text-xl font-bold mb-4">评论 ({comments.length})</h3>
      
      {/* 发表评论区域 */}
      {userId ? (
        <div className="mb-8">
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
              U
            </div>
            <div className="flex-1">
              {replyToId ? (
                <div className="mb-2 p-2 bg-gray-50 rounded">
                  <p className="text-sm text-gray-600">回复评论...</p>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="mt-1" 
                    onClick={() => setReplyToId(null)}
                  >
                    取消
                  </Button>
                </div>
              ) : null}
              <div className="flex gap-2">
                <Input
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder={replyToId ? "写个回复..." : "写下你的评论..."}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSubmitComment()}
                />
                <Button 
                  onClick={handleSubmitComment} 
                  disabled={isSubmitting || !newComment.trim()}
                >
                  {isSubmitting ? '发送中...' : '发送'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="mb-8 p-4 bg-gray-50 rounded-lg">
          <p className="text-gray-600">请登录后发表评论</p>
        </div>
      )}

      {/* 评论列表 */}
      <div>
        {topLevelComments.length === 0 ? (
          <p className="text-gray-500 text-center py-8">暂无评论</p>
        ) : (
          topLevelComments.map(comment => (
            <div key={comment.id}>
              {renderComment(comment)}
              {/* 渲染嵌套回复 */}
              {nestedComments
                .filter(nested => nested.parentId === comment.id)
                .map(nested => renderComment(nested, true))
              }
            </div>
          ))
        )}
      </div>
    </div>
  );
}