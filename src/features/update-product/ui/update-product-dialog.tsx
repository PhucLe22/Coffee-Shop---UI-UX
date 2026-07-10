"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { Product } from "@/entities/product";
import { UpdateProductForm } from "./update-product-form";
import { AppButton } from "@/shared/ui/app-button";
import { Trash2, AlertTriangle } from "lucide-react";
import { useDeleteProduct } from "../api/use-update-product-actions";
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

interface UpdateProductDialogProps {
  product: Product;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const UpdateProductDialog = ({ product, open, onOpenChange }: UpdateProductDialogProps) => {
  const { mutate: deleteProduct, isPending: isDeleting } = useDeleteProduct();

  const handleDelete = () => {
    deleteProduct(product.id, {
      onSuccess: (res) => {
        if (res.success) {
          toast.success("Product deleted successfully");
          onOpenChange(false);
        } else {
          toast.error(res.message || "Failed to delete product");
        }
      },
      onError: (err: any) => {
        toast.error(err?.response?.data?.message || "Something went wrong");
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto rounded-md border-0 p-xl">
        <DialogHeader className="mb-6 flex flex-row items-start justify-between">
          <div className="flex flex-col gap-1">
            <DialogTitle className="text-h3-bold text-text-primary text-left">
              Update Product
            </DialogTitle>
            <DialogDescription className="text-overline text-text-muted text-left uppercase tracking-widest">
              MODIFY PRODUCT DETAILS OR REMOVE FROM INVENTORY.
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
                  This action cannot be undone. This will permanently delete the product 
                  <strong> {product.name} </strong> and remove its data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="mt-6">
                <AlertDialogCancel className="rounded-md border-border-primary-50">Cancel</AlertDialogCancel>
                <AppButton 
                  onClick={handleDelete} 
                  isLoading={isDeleting}
                  className="bg-red-500 text-white hover:bg-red-600 rounded-md h-10"
                >
                  DELETE PRODUCT
                </AppButton>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </DialogHeader>
        
        <UpdateProductForm product={product} onSuccess={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
};
