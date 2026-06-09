import React from 'react';
import Link from 'next/link';
import { getAdminComments } from '@/actions/admin';
import { DeleteCommentButton } from './DeleteCommentButton';

export default async function AdminCommentsPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const page = parseInt(searchParams.page || '1');
  const { success, comments, total } = await getAdminComments({ page });

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">评论管理</h1>

      {success && comments && comments.length > 0 ? (
        <div className="space-y-3">
          {comments.map((comment: any) => (
            <div key={comment.id} className="p-4 bg-card rounded-lg border hover:shadow-sm transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium">{comment.author?.name || '匿名用户'}</span>
                    <span className="text-xs text-muted-foreground">
                      {comment.createdAt.toLocaleDateString('zh-CN')}
                    </span>
                  </div>
                  <p className="text-sm mb-2">{comment.content}</p>
                  {comment.post && (
                    <Link
                      href={`/articles/${comment.post.slug}`}
                      className="text-xs text-muted-foreground hover:text-primary"
                    >
                      回复于: {comment.post.title}
                    </Link>
                  )}
                </div>
                <DeleteCommentButton commentId={comment.id} />
              </div>
            </div>
          ))}

          {total > 20 && (
            <div className="flex justify-center gap-2 mt-8">
              {page > 1 && (
                <a
                  href={`/admin/comments?page=${page - 1}`}
                  className="px-4 py-2 rounded-md bg-muted hover:bg-muted/80 text-sm"
                >
                  上一页
                </a>
              )}
              <span className="px-4 py-2 text-sm text-muted-foreground">
                第 {page} 页 / 共 {Math.ceil(total / 20)} 页
              </span>
              {page < Math.ceil(total / 20) && (
                <a
                  href={`/admin/comments?page=${page + 1}`}
                  className="px-4 py-2 rounded-md bg-muted hover:bg-muted/80 text-sm"
                >
                  下一页
                </a>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">暂无评论</p>
        </div>
      )}
    </div>
  );
}