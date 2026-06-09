import { getAdminPosts } from '@/actions/admin';
import AdminPostsPage from './PostsList';

export default async function AdminPostsPageData({
  searchParams,
}: {
  searchParams: { type?: string; status?: string; page?: string };
}) {
  const type = searchParams.type;
  const status = searchParams.status;
  const page = parseInt(searchParams.page || '1');
  const { success, posts = [], total = 0 } = await getAdminPosts({ type, status, page });

  return (
    <AdminPostsPage
      posts={posts}
      total={total}
      currentType={type}
      currentStatus={status}
      currentPage={page}
    />
  );
}
