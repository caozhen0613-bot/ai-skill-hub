import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ai-skill-hub.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "AI Skill Hub - 发现 AI Agent 的无限可能",
    template: "%s | AI Skill Hub",
  },
  description: "一个专注于 AI Agent 技能、场景解决方案和工作流的分享社区。在这里探索 AI 文章、知识库卡片和实用模板。",
  keywords: ["AI Agent", "人工智能", "技能分享", "工作流", "模板", "知识库"],
  authors: [{ name: "AI Skill Hub" }],
  openGraph: {
    type: "website",
    siteName: "AI Skill Hub",
    title: "AI Skill Hub - 发现 AI Agent 的无限可能",
    description: "一个专注于 AI Agent 技能、场景解决方案和工作流的分享社区。",
    url: baseUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Skill Hub - 发现 AI Agent 的无限可能",
    description: "一个专注于 AI Agent 技能、场景解决方案和工作流的分享社区。",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    types: {
      "application/rss+xml": `${baseUrl}/feed.xml`,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
