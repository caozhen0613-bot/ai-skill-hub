import React from 'react';
import { getAuditLogs } from '@/actions/audit';

export default async function AdminAuditPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const page = parseInt(searchParams.page || '1');
  const { success, logs, total } = await getAuditLogs({ page });

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">操作日志</h1>

      {success && logs && logs.length > 0 ? (
        <>
          <div className="space-y-2">
            {logs.map((log: any) => (
              <div key={log.id} className="p-3 bg-card rounded-lg border text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span className="font-medium text-foreground">{log.action}</span>
                  <span>·</span>
                  <span>{log.entity}</span>
                  {log.entityId && <span className="font-mono text-xs">({log.entityId})</span>}
                  <span>·</span>
                  <span>{log.user?.name || '系统'}</span>
                  <span className="ml-auto">{new Date(log.createdAt).toLocaleString('zh-CN')}</span>
                </div>
                {log.detail && <p className="mt-1 text-xs text-muted-foreground">{log.detail}</p>}
              </div>
            ))}
          </div>

          {total > 50 && (
            <div className="flex justify-center gap-2 mt-8">
              {page > 1 && <a href={`/admin/audit?page=${page - 1}`} className="px-4 py-2 rounded-md bg-muted hover:bg-muted/80 text-sm">上一页</a>}
              <span className="px-4 py-2 text-sm text-muted-foreground">第 {page} 页 / 共 {Math.ceil(total / 50)} 页</span>
              {page < Math.ceil(total / 50) && <a href={`/admin/audit?page=${page + 1}`} className="px-4 py-2 rounded-md bg-muted hover:bg-muted/80 text-sm">下一页</a>}
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">暂无操作记录</p>
        </div>
      )}
    </div>
  );
}
