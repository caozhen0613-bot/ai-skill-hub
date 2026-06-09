'use server';

import { adminDeleteComment } from '@/actions/admin';
import { revalidatePath } from 'next/cache';

export async function deleteCommentAction(commentId: string) {
  await adminDeleteComment(commentId);
  revalidatePath('/admin/comments');
}