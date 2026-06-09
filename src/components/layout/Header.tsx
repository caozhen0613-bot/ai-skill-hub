import React, { Suspense } from "react"
import Link from "next/link"
import { ThemeToggle } from "./ThemeToggle"
import { MobileNav } from "./MobileNav"
import { DynamicNav, DynamicMobileNav } from "./DynamicNav"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div style={{ width: '100%', maxWidth: '1280px', margin: '0 auto', padding: '0 1rem' }} className="flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold">AI Skill Hub</span>
          </Link>
          <Suspense fallback={<div className="hidden md:flex gap-6 animate-pulse"><div className="h-4 w-12 bg-muted rounded" /><div className="h-4 w-12 bg-muted rounded" /><div className="h-4 w-16 bg-muted rounded" /></div>}>
            <DynamicNav />
          </Suspense>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="搜索..."
              className="w-64 pl-10"
            />
          </div>
          <ThemeToggle />
          <Button variant="outline" size="sm">
            登录
          </Button>
          <MobileNav>
            <Suspense fallback={null}>
              <DynamicMobileNav />
            </Suspense>
          </MobileNav>
        </div>
      </div>
    </header>
  )
}