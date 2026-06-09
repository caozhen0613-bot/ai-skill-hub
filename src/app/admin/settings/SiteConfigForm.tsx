'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { updateSiteConfig } from '@/actions/site-config';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Save } from 'lucide-react';

export function SiteConfigForm({ config }: { config: any }) {
  const router = useRouter();
  const [form, setForm] = useState({
    siteName: config.siteName || '',
    siteDescription: config.siteDescription || '',
    logo: config.logo || '',
    favicon: config.favicon || '',
    primaryColor: config.primaryColor || '#3b82f6',
    homeLayout: config.homeLayout || 'default',
    announcement: config.announcement || '',
    footerText: config.footerText || '',
    socialLinks: config.socialLinks || '',
  });
  const [loading, setLoading] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await updateSiteConfig(form);
    setLoading(false);
    router.refresh();
  };

  return (
    <form onSubmit={handleSave} className="max-w-2xl space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium mb-1 block">站点名称</label>
          <Input value={form.siteName} onChange={(e) => setForm({ ...form, siteName: e.target.value })} />
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">主题色</label>
          <Input type="color" value={form.primaryColor} onChange={(e) => setForm({ ...form, primaryColor: e.target.value })} className="h-10" />
        </div>
      </div>
      <div>
        <label className="text-sm font-medium mb-1 block">站点描述</label>
        <Input value={form.siteDescription} onChange={(e) => setForm({ ...form, siteDescription: e.target.value })} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium mb-1 block">Logo URL</label>
          <Input value={form.logo} onChange={(e) => setForm({ ...form, logo: e.target.value })} />
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">Favicon URL</label>
          <Input value={form.favicon} onChange={(e) => setForm({ ...form, favicon: e.target.value })} />
        </div>
      </div>
      <div>
        <label className="text-sm font-medium mb-1 block">公告栏内容</label>
        <Input value={form.announcement} onChange={(e) => setForm({ ...form, announcement: e.target.value })} />
      </div>
      <div>
        <label className="text-sm font-medium mb-1 block">页脚文本</label>
        <Input value={form.footerText} onChange={(e) => setForm({ ...form, footerText: e.target.value })} />
      </div>
      <div>
        <label className="text-sm font-medium mb-1 block">社交媒体链接 (JSON)</label>
        <Input value={form.socialLinks} onChange={(e) => setForm({ ...form, socialLinks: e.target.value })} placeholder='{"github":"...","twitter":"..."}' />
      </div>
      <Button type="submit" disabled={loading}>
        <Save className="mr-2 h-4 w-4" />
        {loading ? '保存中...' : '保存配置'}
      </Button>
    </form>
  );
}
