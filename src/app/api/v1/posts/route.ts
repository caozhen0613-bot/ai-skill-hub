import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { PostType, Status } from '@/generated/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') as PostType | null;
    const status = searchParams.get('status') as Status | null;
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = Math.min(parseInt(searchParams.get('pageSize') || '20'), 50);

    const where: any = {};
    if (type) where.type = type;
    if (status) where.status = status;
    else where.status = Status.PUBLISHED;

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          author: { select: { name: true, email: true } },
          tags: { include: { tag: true } },
          _count: { select: { comments: true, likes: true } },
        },
      }),
      prisma.post.count({ where }),
    ]);

    return NextResponse.json({ success: true, data: posts, total, page, pageSize });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
