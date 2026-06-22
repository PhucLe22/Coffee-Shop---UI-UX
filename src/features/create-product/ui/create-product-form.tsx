"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createProductSchema, CreateProductFormValues } from "../model/schema";
import { useCreateProduct } from "../api/use-create-product";
import { useCategories } from "@/entities/category";
import { Input } from "@/shared/ui/input";
import { AppButton } from "@/shared/ui/app-button";
import { Label } from "@/shared/ui/label";
import { Textarea } from "@/shared/ui/textarea";
import { ProductType } from "@/entities/product";
import { Upload, X, HelpCircle } from "lucide-react";
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/shared/ui/tooltip";

interface CreateProductFormProps {
  onSuccess?: () => void;
}

export const CreateProductForm = ({ onSuccess }: CreateProductFormProps) => {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const { data: categoriesData, isLoading: isLoadingCategories } = useCategories(1, 100);
  const { mutate: createProduct, isPending } = useCreateProduct();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateProductFormValues>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      type: ProductType.SIMPLE,
      basePrice: 0,
      taxRate: 0,
      sortOrder: 1,
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setPreviewImage(null);
    setSelectedFile(null);
  };

  const onSubmit = (values: CreateProductFormValues) => {
    const formData = new FormData();
    
    formData.append("sku", values.sku);
    formData.append("name", values.name);
    formData.append("type", values.type);
    formData.append("basePrice", values.basePrice.toString());
    formData.append("taxRate", values.taxRate.toString());
    formData.append("sortOrder", (values.sortOrder ?? 1).toString());
    
    if (values.description) {
      formData.append("description", values.description);
    }

    formData.append("category", JSON.stringify({ id: values.categoryId }));

    if (values.optionGroups) {
      formData.append("optionGroups", JSON.stringify(values.optionGroups));
    }

    if (selectedFile) {
      formData.append("image", selectedFile);
    }

    createProduct(formData, {
      onSuccess: (response) => {
        if (response.success) {
          toast.success("Product created successfully");
          reset();
          removeImage();
          onSuccess?.();
        } else {
          toast.error(response.message || "Failed to create product");
        }
      },
      onError: (error: unknown) => {
        const axiosError = error as { response?: { data?: { message?: string } } };
        toast.error(axiosError?.response?.data?.message || "Something went wrong");
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="sku" className="text-[#3c5e54] font-bold">SKU</Label>
          <Input 
            id="sku" 
            {...register("sku")} 
            placeholder="e.g. TIRA-339" 
            className="bg-[#ebe0d9] border-0 rounded-md h-14"
          />
          {errors.sku && <p className="text-red-500 text-xs">{errors.sku.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="name" className="text-[#3c5e54] font-bold">PRODUCT NAME</Label>
          <Input 
            id="name" 
            {...register("name")} 
            placeholder="e.g. Flat test" 
            className="bg-[#ebe0d9] border-0 rounded-md h-14"
          />
          {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="type" className="text-[#3c5e54] font-bold">PRODUCT TYPE</Label>
          <select
            id="type"
            {...register("type")}
            className="flex h-14 w-full rounded-md bg-[#ebe0d9] px-md py-sm text-body-md-reg text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all border-0 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%233c5e54%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:12px_12px] bg-[right:1rem_center] bg-no-repeat"
          >
            {Object.values(ProductType).map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          {errors.type && <p className="text-red-500 text-xs">{errors.type.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="categoryId" className="text-[#3c5e54] font-bold">CATEGORY</Label>
          <select
            id="categoryId"
            {...register("categoryId")}
            className="flex h-14 w-full rounded-md bg-[#ebe0d9] px-md py-sm text-body-md-reg text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all border-0 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%233c5e54%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:12px_12px] bg-[right:1rem_center] bg-no-repeat"
            disabled={isLoadingCategories}
          >
            <option value="">Select a category</option>
            {categoriesData?.data.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          {errors.categoryId && <p className="text-red-500 text-xs">{errors.categoryId.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="basePrice" className="text-[#3c5e54] font-bold">BASE PRICE</Label>
          <Input 
            id="basePrice" 
            type="number" 
            {...register("basePrice")} 
            className="bg-[#ebe0d9] border-0 rounded-md h-14"
          />
          {errors.basePrice && <p className="text-red-500 text-xs">{errors.basePrice.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="taxRate" className="text-[#3c5e54] font-bold">TAX RATE (%)</Label>
          <Input 
            id="taxRate" 
            type="number" 
            {...register("taxRate")} 
            className="bg-[#ebe0d9] border-0 rounded-md h-14"
          />
          {errors.taxRate && <p className="text-red-500 text-xs">{errors.taxRate.message}</p>}
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label htmlFor="sortOrder" className="text-[#3c5e54] font-bold uppercase">DISPLAY ORDER</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="size-4 text-[#3c5e54] cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-[300px] p-md bg-[#3c5e54] text-white border-0 rounded-md">
                  <p className="text-body-sm-reg">
                    Determines the sequence items are displayed in the UI. 
                    Lower numbers appear first (e.g., 1 comes before 2).
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Input 
            id="sortOrder" 
            type="number" 
            {...register("sortOrder")} 
            className="bg-[#ebe0d9] border-0 rounded-md h-14"
          />
          {errors.sortOrder && <p className="text-red-500 text-xs">{errors.sortOrder.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description" className="text-[#3c5e54] font-bold">DESCRIPTION</Label>
        <Textarea 
          id="description" 
          {...register("description")} 
          placeholder="Product description..." 
          className="bg-[#ebe0d9] border-0 rounded-md min-h-[120px] focus-visible:ring-brand-primary/20" 
        />
        {errors.description && <p className="text-red-500 text-xs">{errors.description.message}</p>}
      </div>

      <div className="space-y-2">
        <Label className="text-[#3c5e54] font-bold">PRODUCT IMAGE</Label>
        <div className="flex flex-col gap-4">
          {previewImage ? (
            <div className="relative w-full aspect-video rounded-md overflow-hidden border-2 border-dashed border-[#3c5e54]/20 bg-[#ebe0d9]">
              <img src={previewImage} alt="Preview" className="w-full h-full object-contain p-2" />
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
              >
                <X className="size-5" />
              </button>
            </div>
          ) : (
            <label
              htmlFor="image-upload"
              className="flex flex-col items-center justify-center w-full aspect-video rounded-md border-2 border-dashed border-[#3c5e54]/40 bg-[#ebe0d9] hover:bg-[#e4d6cc] cursor-pointer transition-colors"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="size-10 text-[#3c5e54] mb-3" />
                <p className="text-body-md-bold text-[#3c5e54]">CLICK TO UPLOAD</p>
                <p className="text-body-sm-reg text-[#3c5e54]/60 mt-1">PNG, JPG or WEBP</p>
              </div>
              <input id="image-upload" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
            </label>
          )}
        </div>
      </div>

      <div className="flex justify-center pt-6">
        <AppButton 
          type="submit" 
          isLoading={isPending} 
          className="w-full md:w-[240px]"
        >
          CREATE PRODUCT
        </AppButton>
      </div>
    </form>
  );
};
