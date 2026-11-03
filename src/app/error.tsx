"use client";

import { useEffect } from "react";
import { AppButton } from "@/shared/ui";

const RELOAD_FLAG = "chunk-reload-attempted";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
    // After a new deploy, an open tab may request JS chunks that no longer exist. Reload once to pick up the new build.
    const isChunkError = /ChunkLoadError|Loading chunk|Failed to fetch dynamically imported module/i.test(`${error.name} ${error.message}`);
    try {
      if (isChunkError && !sessionStorage.getItem(RELOAD_FLAG)) {
        sessionStorage.setItem(RELOAD_FLAG, "1");
        window.location.reload();
      }
    } catch {
      // sessionStorage unavailable: fall through to the manual retry UI.
    }
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-lg px-md text-center">
      <h2 className="text-h3-bold text-text-primary">Đã có lỗi xảy ra</h2>
      <p className="max-w-[420px] text-body-md-reg text-text-secondary">
        Trang không tải được. Vui lòng thử lại hoặc quay về trang chủ.
      </p>
      <div className="flex gap-sm">
        <AppButton onClick={() => reset()} className="text-inverse-text">Thử lại</AppButton>
        <AppButton variant="outline" onClick={() => (window.location.href = "/")}>Về trang chủ</AppButton>
      </div>
    </div>
  );
}
