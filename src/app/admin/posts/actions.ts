'use server';

import { adminDeletePost, adminUpdatePostStatus } from '@/actions/admin';

export async function deletePostAction(id: string) {
  await adminDeletePost(id);
}

export async function toggleStatusAction(id: string, currentStatus: string) {
  await adminUpdatePostStatus(id, currentStatus === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED');
}
