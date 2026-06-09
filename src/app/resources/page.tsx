import React from 'react';
import { Metadata } from 'next';
import { getFileResources } from '@/actions/resources';
import { ResourceRow } from '@/components/content/ResourceRow';
import { File } from 'lucide-react';

export const metadata: Metadata = {
  title: '文件资源',
  description: '浏览和下载 AI 技能相关的学习资料、PDF、模板文件',
  openGraph: {
    title: 'AI Skill Hub 文件资源',
    description: 'AI 技能相关的学习资料',
  },
};

export default async function ResourcesPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const page = parseInt(searchParams.page || '1');
  const { success, resources, total } = await getFileResources({ page });

  return (
    <div style={{ width: '100%', maxWidth: '1280px', margin: '0 auto', padding: '0 1rem' }}>
      <div className="py-12">
        <h1 className="text-4xl font-bold mb-4">文件资源</h1>
        <p className="text-muted-foreground text-lg mb-12">
          浏览和下载 AI 技能相关的学习资料
        </p>

        {success && resources && resources.length > 0 ? (
          <>
            <div className="grid gap-4">
              {resources.map((resource: any) => (
                <ResourceRow key={resource.id} resource={resource} />
              ))}
            </div>

            {total > 20 && (
              <div className="flex justify-center gap-2 mt-8">
                {page > 1 && (
                  <a
                    href={`/resources?page=${page - 1}`}
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
                    href={`/resources?page=${page + 1}`}
                    className="px-4 py-2 rounded-md bg-muted hover:bg-muted/80 text-sm"
                  >
                    下一页
                  </a>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16 bg-card rounded-lg border">
            <File className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">暂无文件资源</h2>
            <p className="text-muted-foreground">还没有上传任何文件资料</p>
          </div>
        )}
      </div>
    </div>
  );
}