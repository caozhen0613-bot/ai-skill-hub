import * as React from "react"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t py-12">
      <div style={{ width: '100%', maxWidth: '1280px', margin: '0 auto', padding: '0 1rem' }}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <Link href="/" className="text-xl font-bold">
              AI Skill Hub
            </Link>
            <p className="mt-4 text-muted-foreground">
              一个专注于 AI Agent 技能、场景解决方案和工作流的分享社区。
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-4">内容</h3>
            <nav className="flex flex-col gap-2 text-sm">
              <Link href="/articles" className="text-muted-foreground hover:text-foreground">
                文章
              </Link>
              <Link href="/cards" className="text-muted-foreground hover:text-foreground">
                知识库
              </Link>
              <Link href="/templates" className="text-muted-foreground hover:text-foreground">
                模板
              </Link>
              <Link href="/resources" className="text-muted-foreground hover:text-foreground">
                资源
              </Link>
            </nav>
          </div>
          <div>
            <h3 className="font-semibold mb-4">链接</h3>
            <nav className="flex flex-col gap-2 text-sm">
              <Link href="/" className="text-muted-foreground hover:text-foreground">
                关于我们
              </Link>
              <Link href="/" className="text-muted-foreground hover:text-foreground">
                GitHub
              </Link>
              <Link href="/" className="text-muted-foreground hover:text-foreground">
                联系我们
              </Link>
            </nav>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} AI Skill Hub. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
