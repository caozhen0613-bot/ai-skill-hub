"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Page error:", error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center max-w-md">
        <h2 className="text-2xl font-bold mb-4">页面加载出错</h2>
        <p className="text-muted-foreground mb-6">
          抱歉，页面加载时出现了问题。请稍后再试。
        </p>
        <div className="flex gap-3 justify-center">
          <Button onClick={reset}>重试</Button>
          <Button variant="outline" onClick={() => (window.location.href = "/")}>
            返回首页
          </Button>
        </div>
      </div>
    </div>
  );
}
