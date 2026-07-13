"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/dialog";
import { AppButton } from "@/shared/ui/app-button";
import { Plus } from "lucide-react";
import { CreateProductForm } from "./create-product-form";

export const CreateProductDialog = () => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <AppButton className="h-10 px-md">
          <Plus className="mr-2 h-4 w-4" />
          Thêm sản phẩm
        </AppButton>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto rounded-md border-0 p-xl">
        <DialogHeader className="mb-6">
          <DialogTitle className="text-h3-bold text-text-primary text-left">
            Thêm sản phẩm mới
          </DialogTitle>
          <DialogDescription className="text-overline text-text-muted text-left uppercase tracking-widest mt-1">
            ADD A NEW PRODUCT TO YOUR INVENTORY. FILL IN THE DETAILS BELOW.
          </DialogDescription>
        </DialogHeader>
        <CreateProductForm onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
};
