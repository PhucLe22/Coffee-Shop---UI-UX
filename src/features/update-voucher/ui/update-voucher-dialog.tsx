"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { AppButton } from "@/shared/ui/app-button";
import { Trash2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/shared/ui/alert-dialog";
import { VoucherOutput } from "@/entities/voucher";
import { useDeleteVoucher } from "../api/use-update-voucher-actions";
import { UpdateVoucherForm } from "./update-voucher-form";

interface UpdateVoucherDialogProps {
  voucher: VoucherOutput;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const UpdateVoucherDialog = ({ voucher, open, onOpenChange }: UpdateVoucherDialogProps) => {
  const { mutate: deleteVoucher, isPending: isDeleting } = useDeleteVoucher();

  const handleDelete = () => {
    deleteVoucher(voucher.id, {
      onSuccess: () => {
        toast.success("Voucher deleted successfully");
        onOpenChange(false);
      },
      onError: (err: any) => {
        toast.error(err?.response?.data?.message || "Something went wrong");
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange} modal={false}>
      <DialogContent
        className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto rounded-md border-0 p-xl"
        onCloseAutoFocus={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader className="mb-6 flex flex-row items-start justify-between">
          <div className="flex flex-col gap-1">
            <DialogTitle className="text-h3-bold text-text-primary text-left">
              Update Voucher
            </DialogTitle>
            <DialogDescription className="text-overline text-text-muted text-left uppercase tracking-widest">
              MODIFY VOUCHER DETAILS OR REMOVE FROM SYSTEM.
            </DialogDescription>
          </div>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <AppButton
                variant="outline"
                className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600 h-10 px-md"
              >
                <Trash2 className="size-4 mr-2" />
                DELETE
              </AppButton>
            </AlertDialogTrigger>
            <AlertDialogContent className="rounded-md border-0">
              <AlertDialogHeader>
                <div className="flex items-center gap-3 text-red-500 mb-2">
                  <AlertTriangle className="size-6" />
                  <AlertDialogTitle className="text-h4-bold">Are you absolutely sure?</AlertDialogTitle>
                </div>
                <AlertDialogDescription className="text-body-md-reg">
                  This action cannot be undone. This will permanently delete voucher
                  <strong> {voucher.code} </strong> and remove its data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="mt-6">
                <AlertDialogCancel className="rounded-md border-border-primary-50">Cancel</AlertDialogCancel>
                <AppButton
                  onClick={handleDelete}
                  isLoading={isDeleting}
                  className="bg-red-500 text-white hover:bg-red-600 rounded-md h-10"
                >
                  DELETE VOUCHER
                </AppButton>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </DialogHeader>

        <UpdateVoucherForm voucher={voucher} onSuccess={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
};
