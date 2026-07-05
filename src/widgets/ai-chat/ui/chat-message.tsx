import { cn } from "@/shared/lib";
import {
  Message,
  FALLBACK_PRODUCT_IMAGE,
} from "../model/chat-store";
import Link from "next/link";
import { AICart } from "./ai-cart";
import { AIOrderStatus } from "./ai-order-status";
import { AIStoreCard } from "./ai-store-card";
import { AIClosetStoreCard } from "./ai-closet-store-card";

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isAssistant = message.role === "assistant";

  return (
    <div
      className={cn(
        "flex flex-col gap-1 w-full",
        isAssistant ? "items-start" : "items-end",
      )}>
      <span className="text-overline-inter text-text-secondary px-1 uppercase">
        {isAssistant ? "Amber AI" : "Bạn"}
      </span>
      <div
        className={cn(
          "max-w-[85%] px-lg py-md rounded-md flex flex-col gap-md",
          isAssistant
            ? "bg-surface-muted text-text-primary rounded-tl-none"
            : "bg-text-secondary text-inverse-text rounded-tr-none",
        )}>
        <p className="text-body-md-reg leading-snug">{message.content}</p>

        {message.attachment && (
          <div className="flex flex-col gap-sm w-full">
            {message.attachment.type === "order" && (
              <AIOrderStatus 
                id={message.attachment.data.id}
                status={message.attachment.data.status}
                items={message.attachment.data.items}
              />
            )}

            {message.attachment.type === "cart" && (
              <AICart 
                items={message.attachment.data.items}
                total={message.attachment.data.total}
              />
            )}

            {message.attachment.type === "stores" && (
              <div className="flex flex-col gap-sm">
                {message.attachment.data.map((store: any, idx: number) => (
                  <AIStoreCard 
                    key={idx}
                    name={store.storeName}
                    address={store.address}
                  />
                ))}
              </div>
            )}

            {message.attachment.type === "closestStore" && (
              <AIClosetStoreCard 
                name={message.attachment.data.storeName}
                address={message.attachment.data.address}
                distance={message.attachment.data.distance}
                onClick={() => {
                  window.open(`https://www.google.com/maps/dir/?api=1&destination=${message.attachment.data.lat},${message.attachment.data.lng}`, '_blank');
                }}
              />
            )}



            {message.attachment.type === "product" && (
              <div className="w-[208px] bg-surface-main rounded-md border border-text-primary/20 overflow-hidden flex flex-col shadow-sm">
                <div className="h-[147px] w-full relative">
                  <img
                    src={
                      message.attachment.data.image || FALLBACK_PRODUCT_IMAGE
                    }
                    alt={message.attachment.data.name}
                    className="size-full object-cover"
                  />
                </div>
                <div className="p-lg flex flex-col gap-sm items-center text-center">
                  <span className="text-body-md-bold text-text-primary">
                    {message.attachment.data.name}
                  </span>
                  <span className="text-body-sm-reg text-text-muted">
                    {message.attachment.data.price}
                  </span>

                  <div className="flex flex-col gap-sm w-full mt-sm">
                    <button className="w-full h-8 bg-brand-primary text-inverse-text rounded-full text-body-xs-bold hover:bg-brand-primary/90 transition-colors flex items-center justify-center">
                      Đặt Ngay
                    </button>
                    <Link
                      href={`/products/${message.attachment.data.slug}`}
                      className="w-full h-8 bg-surface-accent text-brand-primary rounded-full text-body-xs-bold hover:bg-surface-accent/80 transition-colors flex items-center justify-center border border-brand-primary/10">
                      Xem Chi Tiết
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
