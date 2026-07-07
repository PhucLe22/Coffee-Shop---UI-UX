"use client";

import { useState } from "react";
import { MessageCircleQuestion } from "lucide-react";
import { useIsMobile } from "@/shared/lib";
import { cn } from "@/shared/lib";
import Link from "next/link";
import { AIChat } from "@/widgets/ai-chat";

export function AIChatButton() {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);

  if (isMobile) {
    return (
      <Link
        href="/chat"
        className="fixed bottom-24 right-md z-50 flex size-14 items-center justify-center rounded-full bg-text-primary text-inverse-text shadow-lg active:scale-95 transition-transform">
        <MessageCircleQuestion size={24} />
      </Link>
    );
  }

  return (
    <>
      {/* Floating Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-lg z-50 w-[400px] h-[600px]  shadow-2xl border border-text-primary/10 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
          <AIChat onClose={() => setIsOpen(false)} />
        </div>
      )}

      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed bottom-lg right-lg z-50 flex size-14 items-center justify-center rounded-full shadow-lg transition-all duration-300 active:scale-95",
          isOpen
            ? "bg-surface-muted text-text-primary rotate-90"
            : "bg-text-primary text-inverse-text",
        )}>
        <MessageCircleQuestion size={24} />
      </button>
    </>
  );
}
