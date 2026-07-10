"use client";

import { AIChat } from "@/widgets/ai-chat";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

export default function ChatPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col h-screen bg-surface-main">
      {/* Mobile Back Header */}
      <div className="flex items-center gap-sm px-md py-lg bg-surface-muted border-b border-text-primary/10 lg:hidden">
        <button 
          onClick={() => router.back()}
          className="flex size-10 items-center justify-center rounded-full hover:bg-black/5"
        >
          <ChevronLeft size={24} />
        </button>
        <span className="text-h4-bold text-text-primary">Amber AI</span>
      </div>

      <main className="flex-1 overflow-hidden">
        <AIChat />
      </main>
    </div>
  );
}
