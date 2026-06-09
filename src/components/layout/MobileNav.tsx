'use client';

import * as React from "react"
import Link from "next/link"
import { ThemeToggle } from "./ThemeToggle"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Menu, X } from "lucide-react"

// Mobile menu client component
export function MobileNav({ children }: { children: React.ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>
      {isMenuOpen && (
        <div className="md:hidden border-t">
          <div style={{ width: '100%', maxWidth: '1280px', margin: '0 auto', padding: '0 1rem' }} className="py-4 space-y-4">
            <nav className="flex flex-col gap-4">
              {children}
            </nav>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="搜索..."
                className="w-full pl-10"
              />
            </div>
          </div>
        </div>
      )}
    </>
  )
}