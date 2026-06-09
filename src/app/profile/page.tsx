import { Metadata } from 'next';
import { auth } from '@/auth';
import { getUserBookmarks, getPosts } from '@/actions/content';
import { ProfileContent } from '@/components/content/ProfileContent';
import { PostType, Status } from '@/generated/prisma';

export const metadata: Metadata = {
  title: '个人主页',
  description: '我的收藏和发布的内容',
};

export default async function ProfilePage() {
  const session = await auth();
  const userId = (session?.user as any)?.id;

  let bookmarks: any[] = [];
  let myPosts: any[] = [];

  if (userId) {
    try {
      const [bookmarkResult, postsResult] = await Promise.all([
        getUserBookmarks(userId),
        getPosts({ status: Status.PUBLISHED, take: 50 }),
      ]);

      if (bookmarkResult.success && bookmarkResult.bookmarks) {
        bookmarks = bookmarkResult.bookmarks;
      }

      if (postsResult.success && postsResult.posts) {
        myPosts = postsResult.posts.filter((p: any) => p.authorId === userId);
      }
    } catch {
      // fallback
    }
  }

  return (
    <ProfileContent
      session={session}
      bookmarks={bookmarks}
      myPosts={myPosts}
    />
  );
}
