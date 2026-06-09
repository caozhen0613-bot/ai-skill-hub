import { getPost } from '@/actions/content';
import { notFound } from 'next/navigation';
import { PostEditor } from '../../PostEditor';

export default async function EditPostPage({ params }: { params: { id: string } }) {
  const { success, post } = await getPost(params.id);
  if (!success || !post) notFound();

  return <PostEditor initialData={post} />;
}
