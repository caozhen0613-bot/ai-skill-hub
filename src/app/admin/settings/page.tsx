import React from 'react';
import { getSiteConfig, updateSiteConfig } from '@/actions/site-config';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SiteConfigForm } from './SiteConfigForm';

export default async function AdminSiteConfigPage() {
  const { success, config } = await getSiteConfig();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">站点配置</h1>
      {success && config && <SiteConfigForm config={config} />}
    </div>
  );
}
