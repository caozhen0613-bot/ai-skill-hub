import React from 'react';
import { getAdminUsers, adminUpdateUserRole } from '@/actions/admin';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

async function updateRoleAction(userId: string, role: string) {
  'use server';
  await adminUpdateUserRole(userId, role);
}

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const page = parseInt(searchParams.page || '1');
  const { success, users, total } = await getAdminUsers({ page });

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">用户管理</h1>

      {success && users && users.length > 0 ? (
        <div className="space-y-3">
          {users.map((user: any) => (
            <div key={user.id} className="flex items-center justify-between p-4 bg-card rounded-lg border hover:shadow-sm transition-shadow">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-medium">{user.name || '未命名用户'}</h3>
                  <Badge variant={user.role === 'ADMIN' ? 'default' : 'secondary'}>
                    {user.role === 'ADMIN' ? '管理员' : '用户'}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {user.email} · {user._count.posts} 内容 · {user._count.comments} 评论
                  {' · '}{user.createdAt.toLocaleDateString('zh-CN')}
                </p>
              </div>
              <div className="flex items-center gap-2 ml-4">
                {user.role === 'USER' ? (
                  <form action={updateRoleAction.bind(null, user.id, 'ADMIN')}>
                    <Button variant="outline" size="sm" type="submit">
                      设为管理员
                    </Button>
                  </form>
                ) : (
                  <form action={updateRoleAction.bind(null, user.id, 'USER')}>
                    <Button variant="outline" size="sm" type="submit">
                      取消管理员
                    </Button>
                  </form>
                )}
              </div>
            </div>
          ))}

          {total > 20 && (
            <div className="flex justify-center gap-2 mt-8">
              {page > 1 && (
                <a
                  href={`/admin/users?page=${page - 1}`}
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
                  href={`/admin/users?page=${page + 1}`}
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
          <p className="text-muted-foreground">暂无用户</p>
        </div>
      )}
    </div>
  );
}