import Link from "next/link";
import { AppButton } from "@/shared/ui";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center bg-surface-main px-md py-2xl text-center">
      <div className="flex flex-col items-center gap-xl">
        {/* 404 Text */}
        <div className="relative">
          <h1 className="text-brand-primary text-[120px] font-pacifico leading-none md:text-[180px]">
            404
          </h1>
          <div className="absolute -right-4 top-1/2 -translate-y-1/2 translate-x-full hidden md:block">
             <div className="size-24 rounded-full bg-brand-primary/10 flex items-center justify-center animate-bounce">
                <span className="text-4xl">☕</span>
             </div>
          </div>
        </div>

        {/* Message */}
        <div className="flex flex-col gap-md max-w-[600px]">
          <h2 className="text-h2-bold text-text-primary">
            Rất tiếc! Trang này không tồn tại.
          </h2>
          <p className="text-body-lg-reg text-text-muted">
            Trang bạn đang tìm kiếm có thể đã được di chuyển hoặc không còn tồn tại.
          </p>
        </div>

        {/* Action */}
        <div className="mt-xl flex flex-col sm:flex-row gap-md">
          <Link href="/">
            <AppButton variant="primary" size="lg" className="min-w-[200px] rounded-full text-inverse-text">
              VỀ TRANG CHỦ
            </AppButton>
          </Link>
          <Link href="/menu">
            <AppButton variant="outline" size="lg" className="min-w-[200px] rounded-full">
              XEM THỰC ĐƠN
            </AppButton>
          </Link>
        </div>
      </div>

      {/* Background Decoration */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden opacity-5">
        <div className="absolute -left-10 top-1/4 size-[400px] rounded-full bg-brand-primary blur-3xl" />
        <div className="absolute -right-10 bottom-1/4 size-[300px] rounded-full bg-text-secondary blur-3xl" />
      </div>
    </div>
  );
}
