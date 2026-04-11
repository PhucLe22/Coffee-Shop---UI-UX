"use client";

import { AppButton } from "@/shared/ui";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (path: string) => void;
}

export function AuthModal({ isOpen, onClose, onNavigate }: AuthModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="flex w-[400px] flex-col gap-lg rounded-md bg-surface-main p-2xl shadow-xl">
        <h3 className="text-h3-bold text-text-primary">Đăng nhập để tiếp tục</h3>
        <p className="text-body-md-reg text-text-muted">
          Bạn cần đăng nhập hoặc đăng ký để tiến hành thanh toán.
        </p>
        <div className="flex flex-col gap-md">
          <AppButton variant="primary" onClick={() => onNavigate("/login")}>
            Đăng nhập
          </AppButton>
          <AppButton variant="secondary" onClick={() => onNavigate("/register")}>
            Đăng ký
          </AppButton>
          <button
            onClick={onClose}
            className="text-body-sm-reg text-text-muted hover:text-text-primary underline"
          >
            Để sau
          </button>
        </div>
      </div>
    </div>
  );
}
