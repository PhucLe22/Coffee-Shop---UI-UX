"use client";

import { useState, useRef, useEffect } from "react";
import { SendHorizontal, Bot, Info, PackageSearch, PackagePlus, ShoppingCart, Tag, Loader2 } from "lucide-react";
import { cn } from "@/shared/lib";
import { ChatMessage } from "./chat-message";
import { useChatStore, FALLBACK_PRODUCT_IMAGE } from "../model/chat-store";
import { useCartStore } from "@/entities/cart";
import { useAIChat } from "../api/use-ai-chat";

interface AIChatProps {
  className?: string;
  onClose?: () => void;
}

export function AIChat({ className, onClose }: AIChatProps) {
  const [inputValue, setInputValue] = useState("");
  const { messages, addMessage } = useChatStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { mutate: sendMessage, isPending } = useAIChat();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (content?: string) => {
    const messageContent = content || inputValue;
    if (!messageContent.trim() || isPending) return;
    
    const userMessage = { role: "user" as const, content: messageContent };
    addMessage(userMessage);
    if (!content) setInputValue("");
    
    // Prepare message history for API
    const history = messages.map(msg => ({
      role: msg.role,
      content: msg.content
    }));
    
    sendMessage({
      messages: [...history, userMessage]
    }, {
      onSuccess: (data) => {
        // Map tool results to attachments if possible
        let attachment: any = undefined;
        
        if (data.toolResults && data.toolResults.length > 0) {
          const firstTool = data.toolResults[0];
          const skillName = firstTool.toolName === "executeSkill" ? firstTool.input?.skill : firstTool.toolName;
          const output = firstTool.output;
          
          if (skillName === "getProduct" && output) {
            attachment = {
              type: "product",
              data: {
                name: output.name,
                price: `${output.basePrice.toLocaleString()}đ`,
                slug: output.slug,
                description: output.description,
                image: output.thumbnail || FALLBACK_PRODUCT_IMAGE
              }
            };
          } else if (skillName === "searchProducts" && output?.items?.length > 0) {
            const product = output.items[0];
            attachment = {
              type: "product",
              data: {
                name: product.name,
                price: `${product.basePrice.toLocaleString()}đ`,
                slug: product.slug,
                description: product.description,
                image: product.thumbnail || FALLBACK_PRODUCT_IMAGE
              }
            };
          } else if (skillName === "getOrder" && output) {
            attachment = {
              type: "order",
              data: {
                id: output.orderCode || output.id,
                status: output.status,
                items: output.items?.map((item: any) => ({
                  name: item.name,
                  price: `${item.price.toLocaleString()}đ`,
                  quantity: `${item.quantity}x`
                })) || []
              }
            };
          } else if (skillName === "findAllStores" || firstTool.toolName === "findAllStores") {
            attachment = {
              type: "stores",
              data: output
            };
          } else if (skillName === "findClosestStore" || firstTool.toolName === "findClosestStore") {
            attachment = {
              type: "closestStore",
              data: {
                ...output,
                distance: `${output.distance.toFixed(1)} km`
              }
            };
          } else if (skillName === "getCartItems" && output) {
            // New logic to handle cart attachment
            const total = output.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
            attachment = {
              type: "cart",
              data: {
                items: output.map((item: any) => ({
                  name: item.name,
                  price: `${(item.price * item.quantity).toLocaleString()}đ`,
                  image: item.image,
                  quantity: item.quantity
                })),
                total: `${total.toLocaleString()}đ`
              }
            };
          } else if (skillName === "checkPromotions" && output) {
            const vouchers = Array.isArray(output) ? output : (output.vouchers || output.data || []);
            attachment = {
              type: "promotion",
              data: { vouchers }
            };
          }
        }
        
        addMessage({ 
          role: "assistant", 
          content: data.text,
          attachment
        });
      },
      onError: (error) => {
        addMessage({ 
          role: "assistant", 
          content: "Xin lỗi, đã xảy ra lỗi. Vui lòng thử lại sau." 
        });
        console.error("AI Chat Error:", error);
      }
    });
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
            Trợ Lý Của Bạn
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
        {isPending && (
          <div className="flex items-center gap-sm text-text-muted">
            <Loader2 size={16} className="animate-spin" />
            <span className="text-body-sm-reg italic">Amber đang suy nghĩ...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      <div className="px-lg pb-md">
        <div className="flex gap-sm overflow-x-auto pb-1">
          <QuickActionButton 
            icon={<Tag size={16} />} 
            label="Khuyến Mãi" 
            onClick={() => handleSend("Cho tôi xem các chương trình khuyến mãi")}
          />
          <QuickActionButton 
            icon={<PackageSearch size={16} />} 
            label="Trạng Thái Đơn" 
            onClick={() => handleSend("Kiểm tra trạng thái đơn hàng của tôi")}
          />
          <QuickActionButton 
            icon={<Info size={16} />} 
            label="Thông Tin Cửa Hàng" 
            onClick={() => handleSend("Cho tôi biết thông tin về cửa hàng")}
          />
          <QuickActionButton 
            icon={<ShoppingCart size={16} />} 
            label="Chia Sẻ Giỏ Hàng" 
            onClick={() => {
              const items = useCartStore.getState().items;
              const cartJson = JSON.stringify(items);
              
              // 1. Add user-friendly message to UI
              const userMessageText = "Có gì trong giỏ hàng của tôi?";
              addMessage({ role: "user" as const, content: userMessageText });

              // 2. Prepare history
              const history = messages.map(msg => ({
                role: msg.role,
                content: msg.content
              }));
              
              sendMessage({
                messages: [...history, { role: "user" as const, content: `${userMessageText} Context: ${cartJson}` }]
              }, {
                onSuccess: (data) => {
                  // Manually construct the cart attachment from store items
                  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                  const attachment = {
                    type: "cart",
                    data: {
                      items: items.map(item => ({
                        name: item.name,
                        price: `${(item.price * item.quantity).toLocaleString()}đ`,
                        image: item.image,
                        quantity: item.quantity
                      })),
                      total: `${total.toLocaleString()}đ`
                    }
                  };
                  
                  addMessage({ 
                    role: "assistant", 
                    content: data.text,
                    attachment
                  });
                },
                onError: (error) => {
                  addMessage({ 
                    role: "assistant", 
                    content: "Xin lỗi, đã xảy ra lỗi. Vui lòng thử lại sau." 
                  });
                  console.error("AI Chat Error:", error);
                }
              });
            }}
          />
        </div>
      </div>

      {/* Input Area */}
      <div className="p-lg pt-0">
        <div className="flex items-center gap-sm bg-surface-muted rounded-full border border-text-primary/10 p-1 px-4 focus-within:border-text-primary/30 transition-colors">
          <input
            type="text"
            placeholder="Hỏi Amber AI bất cứ điều gì..."
            className="flex-1 h-12 bg-transparent border-none outline-none text-body-md-reg text-text-primary placeholder:text-text-muted/50"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            disabled={isPending}
          />
          <button 
            onClick={() => handleSend()}
            disabled={!inputValue.trim() || isPending}
            className="flex size-10 items-center justify-center rounded-full bg-text-primary text-inverse-text disabled:opacity-30 disabled:cursor-not-allowed hover:bg-text-primary/90 transition-colors"
          >
            {isPending ? <Loader2 size={20} className="animate-spin" /> : <SendHorizontal size={20} />}
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
