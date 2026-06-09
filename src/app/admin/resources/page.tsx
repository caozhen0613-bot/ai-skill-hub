import React from 'react';
import { getFileResources } from '@/actions/resources';
import { FileList, UploadButton } from './FileComponents';

export default async function AdminResourcesPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const page = parseInt(searchParams.page || '1');
  const { success, resources, total } = await getFileResources({ page });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">文件资源管理</h1>
        <UploadButton />
      </div>

      {success && resources && resources.length > 0 ? (
        <>
          <FileList resources={resources} />
          {total > 20 && (
            <div className="flex justify-center gap-2 mt-8">
              {page > 1 && (
                <a
                  href={`/admin/resources?page=${page - 1}`}
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
                  href={`/admin/resources?page=${page + 1}`}
                  className="px-4 py-2 rounded-md bg-muted hover:bg-muted/80 text-sm"
                >
                  下一页
                </a>
              )}
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12 bg-card rounded-lg border">
          <p className="text-muted-foreground mb-4">暂无文件资源</p>
        </div>
      )}
    </div>
  );
}