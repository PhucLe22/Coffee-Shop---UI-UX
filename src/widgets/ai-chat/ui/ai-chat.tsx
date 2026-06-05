"use client";

import { useState, useRef, useEffect } from "react";
import { SendHorizontal, Bot, Info, PackageSearch, PackagePlus, ShoppingCart, Tag } from "lucide-react";
import { cn } from "@/shared/lib";
import { ChatMessage } from "./chat-message";
import { useChatStore } from "../model/chat-store";

interface AIChatProps {
  className?: string;
  onClose?: () => void;
}

export function AIChat({ className, onClose }: AIChatProps) {
  const [inputValue, setInputValue] = useState("");
  const { messages, addMessage } = useChatStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!inputValue.trim()) return;
    addMessage({ role: "user", content: inputValue });
    setInputValue("");
    
    // Simulate AI response
    setTimeout(() => {
      addMessage({ 
        role: "assistant", 
        content: "I'm looking into that for you. Is there anything else you'd like to know about our roastery?" 
      });
    }, 1000);
  };

  return (
    <div className={cn("flex flex-col h-full bg-surface-main", className)}>
      {/* Header */}
      <header className="flex items-center gap-md p-lg bg-surface-accent border-b border-text-primary/10">
        <div className="flex size-14 items-center justify-center rounded-full bg-text-secondary text-inverse-text">
          <Bot size={32} />
        </div>
        <div className="flex flex-col">
          <h2 className="text-h3-bold text-text-primary leading-tight">Amber AI</h2>
          <span className="text-overline-inter text-text-secondary uppercase tracking-wider">
            Your Master Roaster Companion
          </span>
        </div>
        {onClose && (
          <button onClick={onClose} className="ml-auto text-text-muted hover:text-text-primary">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        )}
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-lg flex flex-col gap-lg no-scrollbar">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      <div className="px-lg pb-md">
        <div className="flex gap-sm overflow-x-auto no-scrollbar pb-1">
          <QuickActionButton 
            icon={<Tag size={16} />} 
            label="Special Offers" 
            onClick={() => {
              addMessage({ role: "user", content: "Show me special offers" });
              setTimeout(() => {
                addMessage({ 
                  role: "assistant", 
                  content: "I've found a special blend just for you! It's one of our seasonal favorites.",
                  attachment: {
                    type: "product",
                    data: {
                      name: "Honey-Oak Flat White",
                      price: "$9.00",
                      slug: "honey-oak-flat-white",
                      description: "Sourced from the highlands of Ethiopia, infused with sustainable forest honey and a hint of oak.",
                      image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=1000&auto=format&fit=crop"
                    }
                  }
                });
              }, 1000);
            }}
          />
          <QuickActionButton 
            icon={<PackageSearch size={16} />} 
            label="Order Status" 
            onClick={() => {
              addMessage({ role: "user", content: "Check my order status" });
              setTimeout(() => {
                addMessage({ 
                  role: "assistant", 
                  content: "Your order #ORD-7294 is currently out for delivery!",
                  attachment: {
                    type: "order",
                    data: {
                      id: "#ORD-7294",
                      status: "ĐANG GIAO",
                      items: [{ name: "Ethiopian Heirloom", price: "$24.00", quantity: "1x" }]
                    }
                  }
                });
              }, 1000);
            }}
          />
          <QuickActionButton 
            icon={<Info size={16} />} 
            label="Business Info" 
            onClick={() => {
              addMessage({ role: "user", content: "Tell me about Verdant Roastery" });
              setTimeout(() => {
                addMessage({ 
                  role: "assistant", 
                  content: "Verdant Roastery was founded in 2024 with a mission to bring sustainable, master-roasted coffee to our community. We source only from ethical farms." 
                });
              }, 1000);
            }}
          />
          <QuickActionButton 
            icon={<PackagePlus size={16} />} 
            label="New Order" 
            onClick={() => addMessage({ role: "user", content: "I want to start a new order" })}
          />
          <QuickActionButton 
            icon={<ShoppingCart size={16} />} 
            label="My Cart" 
            onClick={() => {
              addMessage({ role: "user", content: "Show my cart" });
              setTimeout(() => {
                addMessage({ 
                  role: "assistant", 
                  content: "Here's what you've added to your cart so far:",
                  attachment: {
                    type: "cart",
                    data: {
                      total: "$33.00",
                      items: [
                        { name: "Cold Brew Nitro", price: "$5.50" },
                        { name: "Caramel Macchiato", price: "$5.50" }
                      ]
                    }
                  }
                });
              }, 1000);
            }}
          />
        </div>
      </div>

      {/* Input Area */}
      <div className="p-lg pt-0">
        <div className="flex items-center gap-sm bg-surface-muted rounded-full border border-text-primary/10 p-1 px-4 focus-within:border-text-primary/30 transition-colors">
          <input
            type="text"
            placeholder="Ask Amber AI anything..."
            className="flex-1 h-12 bg-transparent border-none outline-none text-body-md-reg text-text-primary placeholder:text-text-muted/50"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <button 
            onClick={handleSend}
            disabled={!inputValue.trim()}
            className="flex size-10 items-center justify-center rounded-full bg-text-primary text-inverse-text disabled:opacity-30 disabled:cursor-not-allowed hover:bg-text-primary/90 transition-colors"
          >
            <SendHorizontal size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

function QuickActionButton({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick?: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="flex items-center gap-xs px-md py-1.5 rounded-full border border-brand-primary text-brand-primary whitespace-nowrap hover:bg-brand-primary hover:text-inverse-text transition-colors"
    >
      {icon}
      <span className="text-overline-inter font-bold">{label}</span>
    </button>
  );
}
