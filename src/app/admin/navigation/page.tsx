'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  createNavigation,
  updateNavigation,
  deleteNavigation,
  toggleNavigationVisibility,
  getAllNavigations,
  getParentNavigations,
} from '@/actions/navigation';
import { NavType } from '@/generated/prisma';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronRight,
  GripVertical,
} from 'lucide-react';

type NavItem = {
  id: string;
  label: string;
  slug: string | null;
  type: string;
  url: string | null;
  icon: string | null;
  parentId: string | null;
  sortOrder: number;
  isVisible: boolean;
  children?: NavItem[];
};

type EditingNav = {
  id?: string;
  label: string;
  slug: string;
  type: NavType;
  url: string;
  icon: string;
  parentId: string;
  sortOrder: number;
  isVisible: boolean;
};

export default function AdminNavigationPage() {
  const router = useRouter();
  const [navigations, setNavigations] = useState<NavItem[]>([]);
  const [parents, setParents] = useState<NavItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState<EditingNav>({
    label: '',
    slug: '',
    type: NavType.PAGE,
    url: '',
    icon: '',
    parentId: '',
    sortOrder: 0,
    isVisible: true,
  });
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const loadData = async () => {
    setLoading(true);
    const [navResult, parentResult] = await Promise.all([
      getAllNavigations(),
      getParentNavigations(),
    ]);
    if (navResult.success && navResult.navigations) {
      setNavigations(navResult.navigations as NavItem[]);
    }
    if (parentResult.success && parentResult.items) {
      setParents(parentResult.items as NavItem[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreate = () => {
    setEditing(true);
    setEditData({
      label: '',
      slug: '',
      type: NavType.PAGE,
      url: '',
      icon: '',
      parentId: '',
      sortOrder: 0,
      isVisible: true,
    });
  };

  const handleEdit = (item: NavItem) => {
    setEditing(true);
    setEditData({
      id: item.id,
      label: item.label,
      slug: item.slug || '',
      type: item.type as NavType,
      url: item.url || '',
      icon: item.icon || '',
      parentId: item.parentId || '',
      sortOrder: item.sortOrder,
      isVisible: item.isVisible,
    });
  };

  const handleSave = async () => {
    if (!editData.label.trim()) return;

    if (editData.id) {
      await updateNavigation(editData.id, {
        label: editData.label,
        slug: editData.slug || undefined,
        type: editData.type,
        url: editData.url || undefined,
        icon: editData.icon || undefined,
        parentId: editData.parentId ? editData.parentId : null,
        sortOrder: editData.sortOrder,
        isVisible: editData.isVisible,
      });
    } else {
      await createNavigation({
        label: editData.label,
        slug: editData.slug || undefined,
        type: editData.type,
        url: editData.url || undefined,
        icon: editData.icon || undefined,
        parentId: editData.parentId || null,
        sortOrder: editData.sortOrder,
        isVisible: editData.isVisible,
      });
    }

    setEditing(false);
    loadData();
    router.refresh();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('确定删除此项及其子项？')) return;
    await deleteNavigation(id);
    loadData();
    router.refresh();
  };

  const handleToggleVisibility = async (id: string) => {
    await toggleNavigationVisibility(id);
    loadData();
    router.refresh();
  };

  const toggleExpand = (id: string) => {
    const next = new Set(expandedItems);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setExpandedItems(next);
  };

  const typeLabels: Record<string, string> = {
    PAGE: '页面',
    CATEGORY: '分类',
    EXTERNAL: '外链',
  };

  const renderNavItem = (item: NavItem, depth: number = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.has(item.id);

    return (
      <div key={item.id}>
        <div
          className="flex items-center gap-2 p-3 bg-card rounded-lg border hover:shadow-sm transition-shadow mb-1"
          style={{ marginLeft: depth * 24 }}
        >
          <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
          {hasChildren && (
            <button onClick={() => toggleExpand(item.id)} className="p-0">
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>
          )}
          {!hasChildren && <span className="w-4" />}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-medium">{item.label}</span>
              <Badge variant="outline" className="text-xs">
                {typeLabels[item.type] || item.type}
              </Badge>
              {item.isVisible ? (
                <Eye className="h-3 w-3 text-green-500" />
              ) : (
                <EyeOff className="h-3 w-3 text-muted-foreground" />
              )}
            </div>
            {item.url && (
              <p className="text-xs text-muted-foreground truncate">{item.url}</p>
            )}
            {item.slug && (
              <p className="text-xs text-muted-foreground">/{item.slug}</p>
            )}
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleEdit(item)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleToggleVisibility(item.id)}
            >
              {item.isVisible ? (
                <Eye className="h-4 w-4" />
              ) : (
                <EyeOff className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-destructive hover:text-destructive"
              onClick={() => handleDelete(item.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        {hasChildren && isExpanded && item.children!.map((child) => renderNavItem(child, depth + 1))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">加载中...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">导航管理</h1>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          新增导航
        </Button>
      </div>

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-background rounded-lg p-6 w-full max-w-md max-h-[80vh] overflow-auto">
            <h2 className="text-xl font-bold mb-4">
              {editData.id ? '编辑导航' : '新增导航'}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">名称</label>
                <Input
                  value={editData.label}
                  onChange={(e) =>
                    setEditData({ ...editData, label: e.target.value })
                  }
                  placeholder="导航名称"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">类型</label>
                <select
                  className="w-full border rounded-md px-3 py-2 text-sm bg-background"
                  value={editData.type}
                  onChange={(e) =>
                    setEditData({ ...editData, type: e.target.value as NavType })
                  }
                >
                  <option value="PAGE">页面</option>
                  <option value="CATEGORY">分类</option>
                  <option value="EXTERNAL">外链</option>
                </select>
              </div>
              {editData.type === NavType.PAGE && (
                <div>
                  <label className="text-sm font-medium mb-1 block">Slug</label>
                  <Input
                    value={editData.slug}
                    onChange={(e) =>
                      setEditData({ ...editData, slug: e.target.value })
                    }
                    placeholder="页面路径，如 articles"
                  />
                </div>
              )}
              {editData.type === NavType.EXTERNAL && (
                <div>
                  <label className="text-sm font-medium mb-1 block">URL</label>
                  <Input
                    value={editData.url}
                    onChange={(e) =>
                      setEditData({ ...editData, url: e.target.value })
                    }
                    placeholder="https://example.com"
                  />
                </div>
              )}
              <div>
                <label className="text-sm font-medium mb-1 block">父级</label>
                <select
                  className="w-full border rounded-md px-3 py-2 text-sm bg-background"
                  value={editData.parentId}
                  onChange={(e) =>
                    setEditData({ ...editData, parentId: e.target.value })
                  }
                >
                  <option value="">无（顶级）</option>
                  {parents
                    .filter((p) => p.id !== editData.id)
                    .map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.label}
                      </option>
                    ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">排序</label>
                <Input
                  type="number"
                  value={editData.sortOrder}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      sortOrder: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isVisible"
                  checked={editData.isVisible}
                  onChange={(e) =>
                    setEditData({ ...editData, isVisible: e.target.checked })
                  }
                />
                <label htmlFor="isVisible" className="text-sm">
                  可见
                </label>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => setEditing(false)}>
                取消
              </Button>
              <Button onClick={handleSave}>保存</Button>
            </div>
          </div>
        </div>
      )}

      {/* Navigation List */}
      {navigations.length > 0 ? (
        <div className="space-y-1">
          {navigations.map((item) => renderNavItem(item))}
        </div>
      ) : (
        <div className="text-center py-12 bg-card rounded-lg border">
          <p className="text-muted-foreground mb-4">暂无导航项</p>
          <Button onClick={handleCreate}>
            <Plus className="mr-2 h-4 w-4" />
            新增导航
          </Button>
        </div>
      )}
    </div>
  );
}