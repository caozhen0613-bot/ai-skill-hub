'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { uploadToR2, getR2DownloadUrl, deleteFromR2 } from '@/lib/r2';

// 获取所有文件资源
export async function getFileResources(params?: {
  postId?: string;
  page?: number;
  pageSize?: number;
}) {
  try {
    const { postId, page = 1, pageSize = 20 } = params || {};
    const where: any = {};
    if (postId) where.postId = postId;

    const [resources, total] = await Promise.all([
      prisma.fileResource.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          uploadedBy: { select: { name: true } },
          post: { select: { title: true } },
        },
      }),
      prisma.fileResource.count({ where }),
    ]);

    return { success: true, resources, total, page, pageSize };
  } catch (error) {
    console.error('Error fetching file resources:', error);
    return { success: false, error: 'Failed to fetch file resources' };
  }
}

// 上传文件
export async function uploadFileResource(formData: FormData) {
  try {
    const file = formData.get('file') as File;
    const postId = formData.get('postId') as string;
    const userId = formData.get('userId') as string;

    if (!file || !userId) {
      return { success: false, error: 'Missing required fields' };
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const key = `uploads/${Date.now()}-${file.name}`;

    // Upload to R2
    let r2Uploaded = false;
    try {
      await uploadToR2(key, buffer, file.type);
      r2Uploaded = true;
    } catch (err) {
      console.error('R2 upload failed:', err);
    }

    const resource = await prisma.fileResource.create({
      data: {
        title: file.name,
        storageType: r2Uploaded ? 'DIRECT' : 'DIRECT',
        fileKey: r2Uploaded ? key : null,
        fileUrl: null,
        fileType: file.type,
        fileSize: file.size,
        uploadedById: userId,
        postId: postId || null,
      },
      include: {
        uploadedBy: { select: { name: true } },
      },
    });

    revalidatePath('/admin/resources');
    revalidatePath('/resources');

    return { success: true, resource };
  } catch (error) {
    console.error('Error uploading file:', error);
    return { success: false, error: 'Failed to upload file' };
  }
}

// 通过网盘链接录入文件
export async function addFileResourceFromDrive(data: {
  title: string;
  fileUrl: string;
  fileType?: string;
  fileSize?: number;
  postId?: string;
  userId: string;
}) {
  try {
    const resource = await prisma.fileResource.create({
      data: {
        title: data.title,
        storageType: 'LINK',
        fileKey: null,
        fileUrl: data.fileUrl,
        fileType: data.fileType || 'application/octet-stream',
        fileSize: data.fileSize || 0,
        uploadedById: data.userId,
        postId: data.postId || null,
      },
      include: {
        uploadedBy: { select: { name: true } },
      },
    });

    revalidatePath('/admin/resources');
    revalidatePath('/resources');

    return { success: true, resource };
  } catch (error) {
    console.error('Error adding file resource:', error);
    return { success: false, error: 'Failed to add file resource' };
  }
}

// 删除文件资源
export async function deleteFileResource(id: string) {
  try {
    const resource = await prisma.fileResource.findUnique({ where: { id } });

    if (resource?.fileKey) {
      try {
        await deleteFromR2(resource.fileKey);
      } catch (err) {
        console.error('Failed to delete from R2:', err);
      }
    }

    await prisma.fileResource.delete({ where: { id } });

    revalidatePath('/admin/resources');
    revalidatePath('/resources');

    return { success: true };
  } catch (error) {
    console.error('Error deleting file resource:', error);
    return { success: false, error: 'Failed to delete file resource' };
  }
}

// 获取下载链接
export async function getFileDownloadUrl(id: string) {
  try {
    const resource = await prisma.fileResource.findUnique({ where: { id } });

    if (!resource) {
      return { success: false, error: 'File not found' };
    }

    // Drive link (external)
    if (resource.fileUrl) {
      return { success: true, url: resource.fileUrl, isExternal: true };
    }

    // R2 direct storage
    if (resource.fileKey) {
      try {
        const signedUrl = await getR2DownloadUrl(resource.fileKey);
        if (signedUrl) {
          return { success: true, url: signedUrl, isExternal: false };
        }
      } catch (err) {
        console.error('Failed to get signed URL:', err);
      }
    }

    return { success: false, error: 'No download URL available' };
  } catch (error) {
    console.error('Error getting download URL:', error);
    return { success: false, error: 'Failed to get download URL' };
  }
}