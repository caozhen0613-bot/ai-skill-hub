import React from 'react';
import Link from 'next/link';
import { getNavigations } from '@/actions/navigation';
import { ChevronDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

type NavItem = {
  id: string;
  label: string;
  slug: string | null;
  type: string;
  url: string | null;
  icon: string | null;
  badge: string | null;
  target: string | null;
  children?: NavItem[];
};

function NavLink({ item }: { item: NavItem }) {
  const href = item.type === 'EXTERNAL'
    ? (item.url || '#')
    : item.slug
      ? `/${item.slug}`
      : '/';

  const target = item.target || (item.type === 'EXTERNAL' ? '_blank' : undefined);
  const rel = target === '_blank' ? 'noopener noreferrer' : undefined;

  return (
    <Link
      href={href}
      className="text-sm font-medium hover:text-primary transition-colors inline-flex items-center gap-1.5"
      target={target}
      rel={rel}
    >
      {item.label}
      {item.badge && (
        <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
          {item.badge}
        </Badge>
      )}
    </Link>
  );
}

export async function DynamicNav() {
  const { success, navigations } = await getNavigations();

  if (!success || !navigations || navigations.length === 0) {
    return null;
  }

  return (
    <nav className="hidden md:flex gap-6">
      {(navigations as NavItem[]).map((item) => {
        const hasChildren = item.children && Array.isArray(item.children) && item.children.length > 0;

        if (hasChildren) {
          return (
            <div key={item.id} className="relative group">
              <button className="flex items-center gap-1 text-sm font-medium hover:text-primary transition-colors">
                {item.label}
                {item.badge && (
                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0">{item.badge}</Badge>
                )}
                <ChevronDown className="h-3 w-3" />
              </button>
              <div className="absolute top-full left-0 mt-1 bg-background border rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all min-w-[160px] z-50">
                {item.children!.map((child) => (
                  <Link
                    key={child.id}
                    href={child.type === 'EXTERNAL' ? (child.url || '#') : child.slug ? `/${child.slug}` : '/'}
                    className="flex items-center gap-1.5 px-4 py-2 text-sm hover:bg-muted transition-colors first:rounded-t-md last:rounded-b-md whitespace-nowrap"
                    target={child.target || (child.type === 'EXTERNAL' ? '_blank' : undefined)}
                    rel={child.target === '_blank' || child.type === 'EXTERNAL' ? 'noopener noreferrer' : undefined}
                  >
                    {child.label}
                    {child.badge && (
                      <Badge variant="secondary" className="text-[10px] px-1.5 py-0">{child.badge}</Badge>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          );
        }

        return <NavLink key={item.id} item={item} />;
      })}
    </nav>
  );
}

export async function DynamicMobileNav() {
  const { success, navigations } = await getNavigations();

  if (!success || !navigations || navigations.length === 0) {
    return null;
  }

  return (
    <>
      {(navigations as NavItem[]).map((item) => (
        <React.Fragment key={item.id}>
          <NavLink item={item} />
          {item.children?.map((child) => (
            <Link
              key={child.id}
              href={child.type === 'EXTERNAL' ? (child.url || '#') : child.slug ? `/${child.slug}` : '/'}
              className="text-sm font-medium hover:text-primary transition-colors pl-4 inline-flex items-center gap-1.5"
              target={child.target || (child.type === 'EXTERNAL' ? '_blank' : undefined)}
              rel={child.target === '_blank' || child.type === 'EXTERNAL' ? 'noopener noreferrer' : undefined}
            >
              {item.label} / {child.label}
              {child.badge && (
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0">{child.badge}</Badge>
              )}
            </Link>
          ))}
        </React.Fragment>
      ))}
    </>
  );
}
