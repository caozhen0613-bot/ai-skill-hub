'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  FileText,
  Users,
  MessageSquare,
  Navigation,
  ArrowLeft,
  Home,
  Folders,
  Settings,
  ClipboardList,
} from 'lucide-react';

const sidebarItems = [
  { label: '概览', href: '/admin', icon: LayoutDashboard },
  { label: '内容管理', href: '/admin/posts', icon: FileText },
  { label: '用户管理', href: '/admin/users', icon: Users },
  { label: '评论管理', href: '/admin/comments', icon: MessageSquare },
  { label: '导航管理', href: '/admin/navigation', icon: Navigation },
  { label: '文件资源', href: '/admin/resources', icon: Folders },
  { label: '站点配置', href: '/admin/settings', icon: Settings },
  { label: '操作日志', href: '/admin/audit', icon: ClipboardList },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 min-h-screen border-r bg-background hidden md:block">
          <div className="p-6 border-b">
            <Link href="/admin" className="text-lg font-bold">
              管理后台
            </Link>
          </div>
          <nav className="p-4 space-y-1">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-muted'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="p-4 border-t mt-auto">
            <Link
              href="/"
              className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <Home className="h-4 w-4" />
              返回前台
            </Link>
          </div>
        </aside>

        {/* Mobile header */}
        <div className="md:hidden fixed top-0 left-0 right-0 z-50 border-b bg-background p-4 flex items-center gap-4">
          <Link href="/" className="text-muted-foreground">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <span className="font-bold">管理后台</span>
          <div className="flex gap-2 ml-auto">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'p-2 rounded-md transition-colors',
                    isActive ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
                  )}
                >
                  <Icon className="h-4 w-4" />
                </Link>
              );
            })}
          </div>
        </div>

        {/* Main content */}
        <main className="flex-1 p-6 md:p-8 pt-20 md:pt-8">
          {children}
        </main>
      </div>
    </div>
  );
}