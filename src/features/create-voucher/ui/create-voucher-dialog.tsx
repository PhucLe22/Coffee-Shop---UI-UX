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
import { CreateVoucherForm } from "./create-voucher-form";

export const CreateVoucherDialog = () => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen} modal={false}>
      <DialogTrigger asChild>
        <AppButton className="h-10 px-md">
          <Plus className="mr-2 h-4 w-4" />
          New Voucher
        </AppButton>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto rounded-md border-0 p-xl"
        onCloseAutoFocus={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader className="mb-6">
          <DialogTitle className="text-h3-bold text-text-primary text-left">
            Create New Voucher
          </DialogTitle>
          <DialogDescription className="text-overline text-text-muted text-left uppercase tracking-widest mt-1">
            ADD A NEW DISCOUNT VOUCHER. FILL IN THE DETAILS BELOW.
          </DialogDescription>
        </DialogHeader>
        <CreateVoucherForm onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
};
