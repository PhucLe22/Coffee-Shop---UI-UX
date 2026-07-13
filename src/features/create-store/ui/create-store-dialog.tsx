"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/dialog";
import { AppButton } from "@/shared/ui/app-button";
import { Plus, X } from "lucide-react";
import { CreateStoreForm } from "./create-store-form";

export const CreateStoreDialog = () => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <AppButton className="h-10 px-md">
          <Plus className="mr-2 h-4 w-4" />
          Thêm cửa hàng
        </AppButton>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto rounded-md border-0 p-md sm:p-xl"
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader className="mb-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <DialogTitle className="text-h3-bold text-text-primary text-left">
                Thêm cửa hàng mới
              </DialogTitle>
              <DialogDescription className="text-[10px] text-text-muted text-left uppercase tracking-widest leading-tight">
                ADD A NEW STORE LOCATION. FILL IN THE DETAILS BELOW.
              </DialogDescription>
            </div>
            <DialogClose asChild>
              <button className="rounded-full p-1.5 hover:bg-surface-muted transition-colors">
                <X className="size-5" />
              </button>
            </DialogClose>
          </div>
        </DialogHeader>
        <CreateStoreForm onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
};
