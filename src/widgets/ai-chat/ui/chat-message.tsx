import { cn } from "@/shared/lib";
import {
  Message,
  FALLBACK_PRODUCT_IMAGE,
  OrderItem,
  CartItem,
} from "../model/chat-store";
import { Badge } from "@/shared/ui";
import Link from "next/link";

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
        {isAssistant ? "Amber AI" : "You"}
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
              <div className="bg-surface-accent rounded-lg border border-text-primary/10 p-md flex flex-col gap-md">
                <div className="flex items-center justify-between border-b border-text-primary/10 pb-sm">
                  <span className="text-body-sm-semibold text-text-secondary">
                    Order {message.attachment.data.id}
                  </span>
                  <Badge
                    variant="secondary"
                    className="bg-info/20 text-info border-none">
                    {message.attachment.data.status}
                  </Badge>
                </div>
                <div className="flex flex-col gap-sm">
                  {message.attachment.data.items.map(
                    (item: OrderItem, idx: number) => (
                      <div key={idx} className="flex items-center gap-md">
                        <div className="size-12 rounded-md overflow-hidden bg-white shrink-0">
                          <img
                            src={item.image || FALLBACK_PRODUCT_IMAGE}
                            alt={item.name}
                            className="size-full object-cover"
                          />
                        </div>
                        <div className="flex-1 flex flex-col">
                          <span className="text-body-sm-semibold text-text-primary">
                            {item.name}
                          </span>
                          <div className="flex items-center justify-between">
                            <span className="text-overline-inter text-text-muted">
                              {item.quantity}
                            </span>
                            <span className="text-body-sm-semibold text-text-primary">
                              {item.price}
                            </span>
                          </div>
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </div>
            )}

            {message.attachment.type === "cart" && (
              <div className="bg-surface-accent rounded-lg border border-text-primary/10 p-md flex flex-col gap-md">
                <div className="flex items-center justify-between border-b border-text-primary/10 pb-sm">
                  <span className="text-body-sm-semibold text-text-secondary">
                    Your Cart ({message.attachment.data.items.length} items)
                  </span>
                  <span className="text-body-md-bold text-text-primary">
                    Total: {message.attachment.data.total}
                  </span>
                </div>
                <div className="flex flex-col gap-sm">
                  {message.attachment.data.items.map(
                    (item: CartItem, idx: number) => (
                      <div key={idx} className="flex items-center gap-md">
                        <div className="size-10 rounded-md overflow-hidden bg-white shrink-0">
                          <img
                            src={item.image || FALLBACK_PRODUCT_IMAGE}
                            alt={item.name}
                            className="size-full object-cover"
                          />
                        </div>
                        <div className="flex-1 flex justify-between items-center">
                          <span className="text-body-sm-reg text-text-primary">
                            {item.name}
                          </span>
                          <span className="text-body-sm-semibold text-text-primary">
                            {item.price}
                          </span>
                        </div>
                      </div>
                    ),
                  )}
                </div>
                <Link
                  href="/cart"
                  className="w-full py-2 bg-brand-primary text-inverse-text rounded-full text-center text-body-sm-bold hover:bg-brand-primary/90 transition-colors mt-1">
                  Checkout Now
                </Link>
              </div>
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
                      Order Now
                    </button>
                    <Link
                      href={`/products/${message.attachment.data.slug}`}
                      className="w-full h-8 bg-surface-accent text-brand-primary rounded-full text-body-xs-bold hover:bg-surface-accent/80 transition-colors flex items-center justify-center border border-brand-primary/10">
                      View Details
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
