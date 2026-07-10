import React, { useState } from "react";
import {
  Button,
  Input,
  Label,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/shared/ui";
import { useCreateGuest } from "@/entities/customer/api/use-customer";
import { toast } from "sonner";
import { X, UserPlus } from "lucide-react";

interface CreateCustomerModalProps {
  onClose: () => void;
  onCreated: (customer: { id: string; name: string; phone: string }) => void;
}

export const CreateCustomerModal = ({
  onClose,
  onCreated,
}: CreateCustomerModalProps) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const { mutate: createGuest, isPending } = useCreateGuest();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      toast.error("Vui lòng nhập tên và số điện thoại");
      return;
    }

    createGuest(
      { name, phone },
      {
        onSuccess: (response) => {
          toast.success("Tạo khách hàng thành công!");
          onCreated(response.data);
          onClose();
        },
        onError: (error: any) => {
          toast.error(
            error.response?.data?.message || "Tạo khách hàng thất bại",
          );
        },
      },
    );
  };

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-surface-main border-none max-w-xl w-full">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 size-10 flex items-center justify-center rounded-md bg-white/80 hover:bg-white text-text-primary shadow-md transition-all active:scale-90">
          <X className="size-5" />
        </button>

        <form onSubmit={handleSubmit} className="flex flex-col w-full">
          <DialogHeader className="border-b border-border-primary-50/5 flex flex-row items-center gap-md">
            <div className="size-10 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary shrink-0">
              <UserPlus className="size-5" />
            </div>
            <div className="flex flex-col text-left">
              <DialogTitle>Tạo Khách Hàng Mới</DialogTitle>
              <DialogDescription>
                Nhập thông tin để thêm khách hàng mới
              </DialogDescription>
            </div>
          </DialogHeader>

          <div className="p-lg flex flex-col gap-lg w-full">
            <div className="flex flex-col gap-sm w-full">
              <Label
                htmlFor="cust-name"
                className="text-[11px] font-bold text-text-muted uppercase">
                Tên Khách Hàng
              </Label>
              <Input
                id="cust-name"
                placeholder="VD: Nguyễn Văn A"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="bg-white border border-border-primary-50/10 shadow-sm focus-visible:ring-1 focus-visible:ring-brand-primary/20 w-full"
              />
            </div>

            <div className="flex flex-col gap-sm w-full">
              <Label
                htmlFor="cust-phone"
                className="text-[11px] font-bold text-text-muted uppercase">
                Số Điện Thoại
              </Label>
              <Input
                id="cust-phone"
                placeholder="e.g. 0912345678"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="bg-white border border-border-primary-50/10 shadow-sm focus-visible:ring-1 focus-visible:ring-brand-primary/20 w-full"
              />
            </div>
          </div>

          <DialogFooter className="bg-surface-accent/50 border-t border-border-primary-50/5 flex gap-md">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              className="flex-1 h-12 rounded-full font-bold text-text-muted hover:bg-white/50">
              HỦY
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="flex-1 h-12 bg-brand-primary text-white font-extrabold tracking-widest rounded-full shadow-lg shadow-brand-primary/20 hover:bg-brand-primary/90 transition-all active:scale-[0.98]">
              {isPending ? "ĐANG TẠO..." : "TẠO KHÁCH HÀNG"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
