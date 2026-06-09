'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { cache } from 'react';

export const getSiteConfig = cache(async () => {
  try {
    let config = await prisma.siteConfig.findFirst();
    if (!config) {
      config = await prisma.siteConfig.create({ data: {} });
    }
    return { success: true, config };
  } catch (error) {
    console.error('Error getting site config:', error);
    return { success: false, error: 'Failed to get site config' };
  }
});

export async function updateSiteConfig(data: {
  siteName?: string;
  siteDescription?: string;
  logo?: string;
  favicon?: string;
  primaryColor?: string;
  homeLayout?: string;
  announcement?: string;
  footerText?: string;
  socialLinks?: string;
}) {
  try {
    let config = await prisma.siteConfig.findFirst();
    if (!config) {
      config = await prisma.siteConfig.create({ data });
    } else {
      config = await prisma.siteConfig.update({
        where: { id: config.id },
        data,
      });
    }
    revalidatePath('/');
    revalidatePath('/admin');
    return { success: true, config };
  } catch (error) {
    console.error('Error updating site config:', error);
    return { success: false, error: 'Failed to update site config' };
  }
}
