'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { NavType } from '@/generated/prisma';

// 获取导航列表（带层级结构）
export async function getNavigations() {
  try {
    const navigations = await prisma.navigation.findMany({
      where: { isVisible: true },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
      include: {
        children: {
          where: { isVisible: true },
          orderBy: { sortOrder: 'asc' }
        }
      }
    });
    // Filter to only top-level items (no parentId)
    const topLevel = navigations.filter((n) => !n.parentId);
    return { success: true, navigations: topLevel };
  } catch (error) {
    console.error('Error fetching navigations:', error);
    return { success: false, error: 'Failed to fetch navigations' };
  }
}

// 获取所有导航（管理员视图，包含不可见项）
export async function getAllNavigations() {
  try {
    const navigations = await prisma.navigation.findMany({
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
      include: {
        children: {
          orderBy: { sortOrder: 'asc' }
        },
        parent: true
      }
    });
    // Filter to top-level
    const topLevel = navigations.filter((n) => !n.parentId);
    return { success: true, navigations: topLevel };
  } catch (error) {
    console.error('Error fetching all navigations:', error);
    return { success: false, error: 'Failed to fetch navigations' };
  }
}

// 获取可能的父级导航项
export async function getParentNavigations() {
  try {
    const items = await prisma.navigation.findMany({
      where: { parentId: null },
      orderBy: { sortOrder: 'asc' }
    });
    return { success: true, items };
  } catch (error) {
    console.error('Error fetching parent navigations:', error);
    return { success: false, error: 'Failed to fetch parent navigations' };
  }
}

// 创建导航
export async function createNavigation(data: {
  label: string;
  slug?: string;
  type: NavType;
  url?: string;
  icon?: string;
  badge?: string;
  target?: string;
  parentId?: string | null;
  sortOrder?: number;
  isVisible?: boolean;
}) {
  try {
    const nav = await prisma.navigation.create({
      data: {
        label: data.label,
        slug: data.slug || null,
        type: data.type,
        url: data.url || null,
        icon: data.icon || null,
        badge: data.badge || null,
        target: data.target || '_self',
        parentId: data.parentId || null,
        sortOrder: data.sortOrder ?? 0,
        isVisible: data.isVisible ?? true
      }
    });
    revalidatePath('/admin/navigation');
    revalidatePath('/');
    return { success: true, nav };
  } catch (error) {
    console.error('Error creating navigation:', error);
    return { success: false, error: 'Failed to create navigation' };
  }
}

// 更新导航
export async function updateNavigation(
  id: string,
  data: {
    label?: string;
    slug?: string;
    type?: NavType;
    url?: string;
    icon?: string;
    badge?: string;
    target?: string;
    parentId?: string | null;
    sortOrder?: number;
    isVisible?: boolean;
  }
) {
  try {
    const nav = await prisma.navigation.update({
      where: { id },
      data
    });
    revalidatePath('/admin/navigation');
    revalidatePath('/');
    return { success: true, nav };
  } catch (error) {
    console.error('Error updating navigation:', error);
    return { success: false, error: 'Failed to update navigation' };
  }
}

// 删除导航
export async function deleteNavigation(id: string) {
  try {
    // Delete children first
    await prisma.navigation.deleteMany({ where: { parentId: id } });
    await prisma.navigation.delete({ where: { id } });
    revalidatePath('/admin/navigation');
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Error deleting navigation:', error);
    return { success: false, error: 'Failed to delete navigation' };
  }
}

// 更新排序
export async function updateNavigationSort(items: { id: string; sortOrder: number }[]) {
  try {
    for (const item of items) {
      await prisma.navigation.update({
        where: { id: item.id },
        data: { sortOrder: item.sortOrder }
      });
    }
    revalidatePath('/admin/navigation');
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Error updating navigation sort:', error);
    return { success: false, error: 'Failed to update navigation sort' };
  }
}

// 切换可见性
export async function toggleNavigationVisibility(id: string) {
  try {
    const nav = await prisma.navigation.findUnique({ where: { id } });
    if (!nav) return { success: false, error: 'Navigation not found' };

    await prisma.navigation.update({
      where: { id },
      data: { isVisible: !nav.isVisible }
    });
    revalidatePath('/admin/navigation');
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Error toggling navigation visibility:', error);
    return { success: false, error: 'Failed to toggle navigation visibility' };
  }
}