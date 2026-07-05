"use client";

import React from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { AppButton } from "@/shared/ui/app-button";
import { Trash2, AlertTriangle, X } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/shared/ui/alert-dialog";
import { StoreOutput } from "@/shared/api";
import { useUpdateStore } from "@/entities/store";
import { UpdateStoreForm } from "./update-store-form";

interface UpdateStoreDialogProps {
  store: StoreOutput;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const UpdateStoreDialog = ({ store, open, onOpenChange }: UpdateStoreDialogProps) => {
  const { mutate: softDeleteStore, isPending: isDeleting } = useUpdateStore();

  const handleDelete = () => {
    softDeleteStore(
      { id: store.id, data: { isDeleted: true } },
      {
        onSuccess: () => {
          toast.success("Store deleted successfully");
          onOpenChange(false);
        },
        onError: (err: any) => {
          toast.error(err?.response?.data?.message || "Something went wrong");
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto rounded-md border-0 p-md sm:p-xl"
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader className="mb-4">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4">
            <div className="flex items-start justify-between gap-2 flex-1">
              <div className="flex flex-col gap-1">
                <DialogTitle className="text-h3-bold text-text-primary text-left">
                  Update Store
                </DialogTitle>
                <DialogDescription className="text-[10px] text-text-muted text-left uppercase tracking-widest leading-tight">
                  MODIFY STORE DETAILS OR REMOVE FROM SYSTEM.
                </DialogDescription>
              </div>
              <DialogClose asChild>
                <button className="rounded-full p-1.5 hover:bg-surface-muted transition-colors">
                  <X className="size-5" />
                </button>
              </DialogClose>
            </div>
            <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <AppButton
                    variant="outline"
                    className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600 h-8 sm:h-10 px-2 sm:px-md text-[11px] sm:text-sm"
                  >
                    <Trash2 className="size-3 sm:size-4 mr-1 sm:mr-2" />
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
                      This will mark store
                      <strong> {store.name} </strong> as deleted. You can recover it later from the store list.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter className="mt-6">
                    <AlertDialogCancel className="rounded-md border-border-primary-50">Cancel</AlertDialogCancel>
                    <AppButton
                      onClick={handleDelete}
                      isLoading={isDeleting}
                      className="bg-red-500 text-white hover:bg-red-600 rounded-md h-10"
                    >
                      DELETE STORE
                    </AppButton>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </DialogHeader>

        <UpdateStoreForm store={store} onSuccess={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
};
