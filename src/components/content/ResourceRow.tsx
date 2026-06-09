'use client';

import { getFileDownloadUrl, deleteFileResource } from '@/actions/resources';
import { Button } from '@/components/ui/button';
import { File, ExternalLink, Download, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';

// Client component for each resource row (handles download URL fetching and delete)
export function ResourceRow({ resource }: { resource: any }) {
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [isExternal, setIsExternal] = useState(false);

  useEffect(() => {
    getFileDownloadUrl(resource.id).then((result) => {
      if (result.success && result.url) {
        setDownloadUrl(result.url);
        setIsExternal(result.isExternal || false);
      }
    });
  }, [resource.id]);

  return (
    <div className="flex items-center justify-between p-4 bg-card rounded-lg border hover:shadow-sm transition-shadow">
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <div className="p-3 bg-muted rounded-lg">
          <File className="h-6 w-6 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium truncate">{resource.title}</h3>
          <p className="text-sm text-muted-foreground">
            {resource.fileType || '未知类型'} · {(resource.fileSize / 1024).toFixed(1)} KB
            {resource.uploadedBy?.name && ` · ${resource.uploadedBy.name}`}
            {resource.post?.title && ` · ${resource.post.title}`}
            {' · '}{resource.createdAt.toLocaleDateString('zh-CN')}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 ml-4">
        {downloadUrl && (
          <a
            href={downloadUrl}
            target={isExternal ? '_blank' : undefined}
            rel={isExternal ? 'noopener noreferrer' : undefined}
            download={!isExternal ? resource.title : undefined}
          >
            <Button variant="outline" size="sm">
              {isExternal ? (
                <ExternalLink className="mr-2 h-4 w-4" />
              ) : (
                <Download className="mr-2 h-4 w-4" />
              )}
              {isExternal ? '打开链接' : '下载'}
            </Button>
          </a>
        )}
      </div>
    </div>
  );
}