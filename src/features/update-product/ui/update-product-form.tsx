"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { createProductSchema, CreateProductFormValues } from "@/features/create-product";
import { useUpdateProduct, useUpdateOptionGroup } from "../api/use-update-product-actions";
import { useCategories } from "@/entities/category";
import { useOptionGroups } from "@/entities/option-group";
import { ProductService } from "@/entities/product";
import { Input } from "@/shared/ui/input";
import { Checkbox } from "@/shared/ui/checkbox";
import { AppButton } from "@/shared/ui/app-button";
import { Label } from "@/shared/ui/label";
import { Textarea } from "@/shared/ui/textarea";
import { ProductType, Product } from "@/entities/product";
import { Upload, X, HelpCircle, ChevronDown, ChevronRight, Settings2 } from "lucide-react";
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/shared/ui/tooltip";
import { cn } from "@/shared/lib/utils";

interface UpdateProductFormProps {
  product: Product;
  onSuccess?: () => void;
}

interface OptionGroupSelection {
  enabled: boolean;
  sortOrder: number;
  optionPrices: Record<string, string>;
  optionActive: Record<string, boolean>;
}

const groupNameMap: Record<string, string> = {
  "Size": "Kích thước",
  "Sugar Level": "Mức đường",
  "Sugar lvl": "Mức đường",
  "Ice Level": "Mức đá",
  "Ice lvl": "Mức đá",
  "Toppings": "Toppings",
};

const translateGroupName = (name: string) => groupNameMap[name] || name;

export const UpdateProductForm = ({ product, onSuccess }: UpdateProductFormProps) => {
  const [previewImage, setPreviewImage] = useState<string | null>(product.thumbnail || null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [optionGroupsOpen, setOptionGroupsOpen] = useState(false);
  const [optionGroupsState, setOptionGroupsState] = useState<Record<string, OptionGroupSelection>>({});
  const [savingOptions, setSavingOptions] = useState(false);

  const { data: categoriesData, isLoading: isLoadingCategories } = useCategories(1, 100);
  const { data: optionGroupsData, isLoading: isLoadingOptionGroups } = useOptionGroups();
  const { mutate: updateProduct, isPending: isUpdatingProduct } = useUpdateProduct();
  const { mutateAsync: updateOptionGroup } = useUpdateOptionGroup();

  const { data: fullProduct, isLoading: isLoadingFullProduct } = useQuery({
    queryKey: ["product-detail", product.id],
    queryFn: () => ProductService.getProductBySlug(product.slug),
    enabled: !!product.slug,
    select: (res) => res.data,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateProductFormValues>({
    resolver: zodResolver(createProductSchema) as any,
    defaultValues: {
      sku: product.sku,
      name: product.name,
      type: product.type as any,
      basePrice: Number(product.basePrice),
      taxRate: Number(product.taxRate),
      categoryId: product.categoryId,
      sortOrder: product.sortOrder ?? 1,
      description: product.description || "",
    },
  });

  useEffect(() => {
    if (!optionGroupsData) return;
    const groups = (fullProduct?.optionGroups || product.optionGroups) as any[] | undefined;
    const initialState: Record<string, OptionGroupSelection> = {};
    for (const group of optionGroupsData.data) {
      const existingGroup = groups?.find(
        (og) => og.id === group.id || og.optionGroupId === group.id
      );
      const optPrices: Record<string, string> = {};
      const optActive: Record<string, boolean> = {};
      for (const opt of group.options) {
        const existingOpt = existingGroup?.options?.find((o: any) => o.id === opt.id);
        optPrices[opt.id] = existingOpt?.price?.toString() ?? "";
        optActive[opt.id] = existingOpt ? (existingOpt as any)?.isActive !== false : false;
      }
      initialState[group.id] = {
        enabled: !!existingGroup,
        sortOrder: existingGroup?.sortOrder ?? group.sortOrder,
        optionPrices: optPrices,
        optionActive: optActive,
      };
    }
    setOptionGroupsState(initialState);
  }, [optionGroupsData, fullProduct, product.optionGroups]);

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

  const saveOptionGroups = useCallback(async (productId: string) => {
    setSavingOptions(true);
    const promises: Promise<unknown>[] = [];
    for (const [groupId, selection] of Object.entries(optionGroupsState)) {
      if (!selection.enabled) {
        promises.push(
          updateOptionGroup({
            productId,
            optionGroupId: groupId,
            data: { isActive: false },
          })
        );
        continue;
      }
      const optionValues = Object.entries(selection.optionPrices)
        .filter(([optionId, price]) => price !== "" || selection.optionActive[optionId] === false)
        .map(([optionId, price]) => ({
          optionId,
          ...(price !== "" ? { price: Number(price) } : {}),
          ...(selection.optionActive[optionId] === false ? { isActive: false } : {}),
        }));
      promises.push(
        updateOptionGroup({
          productId,
          optionGroupId: groupId,
          data: { isActive: true, sortOrder: selection.sortOrder, optionValues },
        })
      );
    }
    await Promise.all(promises);
    setSavingOptions(false);
  }, [optionGroupsState, updateOptionGroup]);

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

    if (selectedFile) {
      formData.append("image", selectedFile);
    }

    updateProduct({ id: product.id, data: formData }, {
      onSuccess: async (response) => {
        if (response.success) {
          await saveOptionGroups(product.id);
          toast.success("Cập nhật sản phẩm thành công");
          onSuccess?.();
        } else {
          toast.error(response.message || "Không thể cập nhật sản phẩm");
        }
      },
      onError: (error: unknown) => {
        const axiosError = error as { response?: { data?: { message?: string } } };
        toast.error(axiosError?.response?.data?.message || "Đã xảy ra lỗi");
      },
    });
  };

  const toggleGroup = (groupId: string) => {
    setOptionGroupsState((prev) => ({
      ...prev,
      [groupId]: { ...prev[groupId], enabled: !prev[groupId].enabled },
    }));
  };

  const updateGroupSortOrder = (groupId: string, sortOrder: number) => {
    setOptionGroupsState((prev) => ({
      ...prev,
      [groupId]: { ...prev[groupId], sortOrder },
    }));
  };

  const updateOptionPrice = (groupId: string, optionId: string, price: string) => {
    setOptionGroupsState((prev) => ({
      ...prev,
      [groupId]: {
        ...prev[groupId],
        optionPrices: { ...prev[groupId].optionPrices, [optionId]: price },
      },
    }));
  };

  const toggleOptionActive = (groupId: string, optionId: string) => {
    setOptionGroupsState((prev) => ({
      ...prev,
      [groupId]: {
        ...prev[groupId],
        optionActive: { ...prev[groupId].optionActive, [optionId]: !prev[groupId].optionActive[optionId] },
      },
    }));
  };

  const isPending = isUpdatingProduct || savingOptions;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="sku" className="text-text-secondary font-bold">SKU</Label>
          <Input
            id="sku"
            {...register("sku")}
            placeholder="VD: TIRA-339"
            className="bg-surface-muted border-0 rounded-md h-14"
            disabled
          />
          {errors.sku && <p className="text-red-500 text-xs">{errors.sku.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="name" className="text-text-secondary font-bold">TÊN SẢN PHẨM</Label>
          <Input
            id="name"
            {...register("name")}
            placeholder="VD: Trà Sữa Trân Châu"
            className="bg-surface-muted border-0 rounded-md h-14"
          />
          {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="type" className="text-text-secondary font-bold">LOẠI SẢN PHẨM</Label>
          <select
            id="type"
            {...register("type")}
            className="flex h-14 w-full rounded-md bg-surface-muted px-md py-sm text-body-md-reg text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all border-0 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%236B7280%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:12px_12px] bg-[right:1rem_center] bg-no-repeat"
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
          <Label htmlFor="categoryId" className="text-text-secondary font-bold">DANH MỤC</Label>
          <select
            id="categoryId"
            {...register("categoryId")}
            className="flex h-14 w-full rounded-md bg-surface-muted px-md py-sm text-body-md-reg text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all border-0 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%236B7280%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:12px_12px] bg-[right:1rem_center] bg-no-repeat"
            disabled={isLoadingCategories}
          >
            <option value="">Chọn danh mục</option>
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
          <Label htmlFor="basePrice" className="text-text-secondary font-bold">GIÁ CƠ BẢN</Label>
          <Input
            id="basePrice"
            type="number"
            {...register("basePrice")}
            className="bg-surface-muted border-0 rounded-md h-14"
          />
          {errors.basePrice && <p className="text-red-500 text-xs">{errors.basePrice.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="taxRate" className="text-text-secondary font-bold">THUẾ (%)</Label>
          <Input
            id="taxRate"
            type="number"
            {...register("taxRate")}
            className="bg-surface-muted border-0 rounded-md h-14"
          />
          {errors.taxRate && <p className="text-red-500 text-xs">{errors.taxRate.message}</p>}
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label htmlFor="sortOrder" className="text-text-secondary font-bold uppercase">THỨ TỰ HIỂN THỊ</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="size-4 text-text-secondary cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-[300px] p-md bg-text-secondary text-white border-0 rounded-md">
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
            className="bg-surface-muted border-0 rounded-md h-14"
          />
          {errors.sortOrder && <p className="text-red-500 text-xs">{errors.sortOrder.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description" className="text-text-secondary font-bold">MÔ TẢ</Label>
        <Textarea
          id="description"
          {...register("description")}
          placeholder="Mô tả sản phẩm..."
          className="bg-surface-muted border-0 rounded-md min-h-[120px] focus-visible:ring-brand-primary/20"
        />
        {errors.description && <p className="text-red-500 text-xs">{errors.description.message}</p>}
      </div>

      <div className="space-y-2">
        <Label className="text-text-secondary font-bold">HÌNH ẢNH SẢN PHẨM</Label>
        <div className="flex flex-col gap-4">
          {previewImage ? (
            <div className="relative w-full aspect-video rounded-md overflow-hidden border-2 border-dashed border-text-secondary/20 bg-surface-muted">
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
              htmlFor="image-upload-update"
              className="flex flex-col items-center justify-center w-full aspect-video rounded-md border-2 border-dashed border-text-secondary/40 bg-surface-muted hover:bg-[#e4d6cc] cursor-pointer transition-colors"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="size-10 text-text-secondary mb-3" />
                <p className="text-body-md-bold text-text-secondary">NHẤP ĐỂ TẢI LÊN</p>
                <p className="text-body-sm-reg text-text-secondary/60 mt-1">PNG, JPG or WEBP</p>
              </div>
              <input id="image-upload-update" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
            </label>
          )}
        </div>
      </div>

      <div className="border-t border-border-primary-50 pt-6">
        <button
          type="button"
          onClick={() => setOptionGroupsOpen(!optionGroupsOpen)}
          className="flex items-center gap-2 w-full text-left"
        >
          {optionGroupsOpen ? <ChevronDown className="size-5 text-text-secondary" /> : <ChevronRight className="size-5 text-text-secondary" />}
          <Settings2 className="size-5 text-text-secondary" />
          <span className="text-body-md-bold text-text-primary">NHÓM TÙY CHỌN</span>
          {isLoadingOptionGroups && (
            <span className="text-body-sm-reg text-text-muted">Đang tải...</span>
          )}
        </button>

        {optionGroupsOpen && (
          <div className="mt-4 space-y-4">
            {isLoadingOptionGroups ? (
              <p className="text-body-sm-reg text-text-muted py-4">Đang tải nhóm tùy chọn...</p>
            ) : optionGroupsData?.data.length === 0 ? (
              <p className="text-body-sm-reg text-text-muted py-4">Không có nhóm tùy chọn nào.</p>
            ) : (
              optionGroupsData?.data.map((group) => {
                const selection = optionGroupsState[group.id];
                if (!selection) return null;
                return (
                  <div
                    key={group.id}
                    className={cn(
                      "rounded-md border p-md transition-colors",
                      selection.enabled
                        ? "border-brand-primary/30 bg-brand-primary/5"
                        : "border-border-primary-50 bg-surface-muted/30"
                    )}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Checkbox
                          id={`group-${group.id}`}
                          checked={selection.enabled}
                          onChange={() => toggleGroup(group.id)}
                          className="border-text-secondary/50 data-[state=checked]:bg-brand-primary data-[state=checked]:border-brand-primary"
                        />
                        <Label
                          htmlFor={`group-${group.id}`}
                          className="text-body-md-bold text-text-primary cursor-pointer"
                        >
                          {translateGroupName(group.name)}
                        </Label>
                        {group.isRequired && (
                          <span className="text-[10px] font-bold text-brand-primary uppercase tracking-widest bg-brand-primary/10 px-2 py-0.5 rounded-full">BẮT BUỘC</span>
                        )}
                        {group.isMultiple && (
                          <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest bg-surface-muted px-2 py-0.5 rounded-full">NHIỀU LỰA CHỌN</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Label className="text-[11px] text-text-secondary whitespace-nowrap">Thứ tự</Label>
                        <Input
                          type="number"
                          value={selection.sortOrder}
                          onChange={(e) => updateGroupSortOrder(group.id, Number(e.target.value))}
                          className="w-16 h-8 bg-surface-accent border-border-primary-50 rounded-md text-center text-body-sm-reg"
                          disabled={!selection.enabled}
                        />
                      </div>
                    </div>

                    <div className="ml-7 space-y-2">
                      {group.options.map((opt) => (
                        <div key={opt.id} className="flex items-center gap-3">
                          <Checkbox
                            id={`opt-${group.id}-${opt.id}`}
                            checked={selection.optionActive[opt.id] !== false}
                            onChange={() => toggleOptionActive(group.id, opt.id)}
                            className="border-text-secondary/50 data-[state=checked]:bg-brand-primary data-[state=checked]:border-brand-primary"
                          />
                          <Label
                            htmlFor={`opt-${group.id}-${opt.id}`}
                            className={cn(
                              "text-body-sm-reg min-w-[80px] cursor-pointer",
                              selection.optionActive[opt.id] === false && "text-text-muted line-through"
                            )}
                          >
                            {opt.name}
                          </Label>
                          <span className="text-[11px] text-text-muted">
                            {selection.optionActive[opt.id] === false ? "Đã ẩn" : `Giá gốc: ${opt.basePrice.toLocaleString()}đ`}
                          </span>
                          <div className="flex items-center gap-2 ml-auto">
                            <Label className="text-[11px] text-text-secondary whitespace-nowrap">Giá tùy chỉnh</Label>
                            <Input
                              type="number"
                              value={selection.optionPrices[opt.id] ?? ""}
                              onChange={(e) => updateOptionPrice(group.id, opt.id, e.target.value)}
                              placeholder={opt.basePrice.toString()}
                              disabled={selection.optionActive[opt.id] === false}
                              className="w-28 h-8 bg-surface-accent border-border-primary-50 rounded-md text-body-sm-reg text-right"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>

      <div className="flex justify-center pt-6">
        <AppButton
          type="submit"
          isLoading={isPending}
          className="w-full md:w-[240px]"
        >
          {savingOptions ? "ĐANG LƯU TÙY CHỌN..." : "CẬP NHẬT SẢN PHẨM"}
        </AppButton>
      </div>
    </form>
  );
};
