'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  deleteFileResource,
  uploadFileResource,
  addFileResourceFromDrive,
} from '@/actions/resources';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { File, Upload, Trash2, ExternalLink } from 'lucide-react';

// Delete button component
export function DeleteResourceButton({ id }: { id: string }) {
  const router = useRouter();

  const handleDelete = async () => {
    await deleteFileResource(id);
    router.refresh();
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      className="text-destructive hover:text-destructive"
      onClick={handleDelete}
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  );
}

// Upload button component with modal
export function UploadButton() {
  const [showModal, setShowModal] = useState(false);
  const [mode, setMode] = useState<'upload' | 'drive'>('upload');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    await uploadFileResource(formData);
    setLoading(false);
    setShowModal(false);
    router.refresh();
  };

  const handleDriveLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    await addFileResourceFromDrive({
      title: formData.get('title') as string,
      fileUrl: formData.get('fileUrl') as string,
      fileType: formData.get('fileType') as string,
      fileSize: parseInt(formData.get('fileSize') as string) || 0,
      postId: formData.get('postId') as string || undefined,
      userId: formData.get('userId') as string,
    });
    setLoading(false);
    setShowModal(false);
    router.refresh();
  };

  return (
    <>
      <Button onClick={() => setShowModal(true)}>
        <Upload className="mr-2 h-4 w-4" />
        上传文件
      </Button>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-background rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">上传文件</h2>

            <div className="flex gap-2 mb-4">
              <button
                className={`px-3 py-1.5 rounded-md text-sm ${
                  mode === 'upload'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
                onClick={() => setMode('upload')}
              >
                本地上传
              </button>
              <button
                className={`px-3 py-1.5 rounded-md text-sm ${
                  mode === 'drive'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
                onClick={() => setMode('drive')}
              >
                网盘链接
              </button>
            </div>

            {mode === 'upload' ? (
              <form onSubmit={handleUpload}>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">文件</label>
                    <Input type="file" name="file" required />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">上传者 ID</label>
                    <Input name="userId" required placeholder="用户ID" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">关联文章 ID（可选）</label>
                    <Input name="postId" placeholder="文章ID" />
                  </div>
                </div>
                <div className="flex justify-end gap-2 mt-6">
                  <Button variant="outline" type="button" onClick={() => setShowModal(false)}>
                    取消
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? '上传中...' : '确认上传'}
                  </Button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleDriveLink}>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">文件名</label>
                    <Input name="title" required placeholder="文件名" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">网盘链接</label>
                    <Input name="fileUrl" required placeholder="https://pan.baidu.com/..." />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">文件类型</label>
                    <Input name="fileType" placeholder="application/pdf" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">文件大小（字节）</label>
                    <Input name="fileSize" type="number" placeholder="0" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">上传者 ID</label>
                    <Input name="userId" required placeholder="用户ID" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">关联文章 ID（可选）</label>
                    <Input name="postId" placeholder="文章ID" />
                  </div>
                </div>
                <div className="flex justify-end gap-2 mt-6">
                  <Button variant="outline" type="button" onClick={() => setShowModal(false)}>
                    取消
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? '处理中...' : '添加链接'}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}

// File list display component
export function FileList({ resources }: { resources: any[] }) {
  return (
    <div className="space-y-3">
      {resources.map((r: any) => (
        <div
          key={r.id}
          className="flex items-center justify-between p-4 bg-card rounded-lg border hover:shadow-sm transition-shadow"
        >
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <File className="h-5 w-5 text-muted-foreground shrink-0" />
            <div className="flex-1 min-w-0">
              <h3 className="font-medium truncate">{r.title}</h3>
              <p className="text-sm text-muted-foreground">
                {r.fileType || '未知类型'} · {((r.fileSize || 0) / 1024).toFixed(1)} KB
                {r.uploadedBy?.name && ` · 上传者: ${r.uploadedBy.name}`}
                {r.post?.title && ` · ${r.post.title}`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 ml-4">
            {r.fileUrl && (
              <a href={r.fileUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" size="sm">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </a>
            )}
            <DeleteResourceButton id={r.id} />
          </div>
        </div>
      ))}
    </div>
  );
}