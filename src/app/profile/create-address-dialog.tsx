"use client";

import React from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createAddressSchema,
  type CreateAddressSchema,
} from "./create-address-schema";
import { useCreateAddress, useAddressAutocomplete } from "@/entities/customer";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/shared/ui/dialog";
import { AppButton, Input, Checkbox, Label } from "@/shared/ui";
import { Plus, MapPin, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/shared/lib";
import { Address } from "@/entities/customer/model/address";

interface CreateAddressDialogProps {
  onCreated?: (address: Address) => void;
  trigger?: React.ReactNode;
}

export function CreateAddressDialog({ onCreated, trigger }: CreateAddressDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [addressQuery, setAddressQuery] = React.useState("");
  const [debouncedQuery, setDebouncedQuery] = React.useState("");
  const [showSuggestions, setShowSuggestions] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const { mutate: createAddress, isPending } = useCreateAddress();
  const { data: suggestionsData, isLoading: isSearchingAddress } = useAddressAutocomplete(debouncedQuery);
  const suggestions = suggestionsData?.data ?? [];

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors },
  } = useForm<CreateAddressSchema>({
    resolver: zodResolver(createAddressSchema),
    defaultValues: {
      receiverName: "",
      receiverPhone: "",
      addressLine: "",
      label: "",
      isDefault: false,
    },
  });

  const currentAddress = useWatch({ control, name: "addressLine" });

  // Debounce address query
  React.useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(addressQuery), 300);
    return () => clearTimeout(timer);
  }, [addressQuery]);

  // Sync addressQuery with form value
  React.useEffect(() => {
    setAddressQuery(currentAddress || "");
  }, [currentAddress]);

  // Auto-show dropdown when user is searching
  React.useEffect(() => {
    if (debouncedQuery.trim().length >= 2) {
      setShowSuggestions(true);
    }
  }, [debouncedQuery]);

  // Close dropdown on outside click
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node) &&
          inputRef.current && !inputRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectSuggestion = (suggestion: typeof suggestions[number]) => {
    setValue("addressLine", suggestion.formatted);
    setValue("lat", suggestion.lat);
    setValue("lng", suggestion.lon);
    setAddressQuery(suggestion.formatted);
    setShowSuggestions(false);
  };

  const onSubmit = (data: CreateAddressSchema) => {
    const body = {
      ...data,
      lat: data.lat ?? undefined,
      lng: data.lng ?? undefined,
    };
    createAddress(body, {
      onSuccess: (response) => {
        toast.success("Tạo địa chỉ thành công");
        setOpen(false);
        reset();
        setAddressQuery("");
        setDebouncedQuery("");
        if (onCreated && response.data) {
          onCreated(response.data);
        }
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message || "Không thể tạo địa chỉ");
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <button className="text-text-primary hover:scale-110 transition-transform">
            <Plus className="size-5" />
          </button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-surface-main rounded-md border-none">
        <DialogHeader>
          <DialogTitle className="text-body-md-bold text-text-primary uppercase tracking-[0.2em]">
            THÊM ĐỊA CHỈ MỚI
          </DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-lg px-lg py-4">
          <div className="flex flex-col gap-xs">
            <Label
              htmlFor="receiverName"
              className="text-secondary text-[11px] font-bold uppercase tracking-[0.1em]">
              TÊN NGƯỜI NHẬN
            </Label>
            <Input
              id="receiverName"
              placeholder="e.g. Nguyen Van A"
              {...register("receiverName")}
              className={cn(
                "h-14 px-md rounded-md transition-all bg-surface-accent",
                errors.receiverName
                  ? "border-error focus-visible:ring-error"
                  : "border-none",
              )}
            />
            {errors.receiverName && (
              <span className="text-overline text-error">
                {errors.receiverName.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-xs">
            <Label
              htmlFor="receiverPhone"
              className="text-secondary text-[11px] font-bold uppercase tracking-[0.1em]">
              SỐ ĐIỆN THOẠI NGƯỜI NHẬN
            </Label>
            <Input
              id="receiverPhone"
              placeholder="e.g. 0912345678"
              {...register("receiverPhone")}
              className={cn(
                "h-14 px-md rounded-md transition-all bg-surface-accent",
                errors.receiverPhone
                  ? "border-error focus-visible:ring-error"
                  : "border-none",
              )}
            />
            {errors.receiverPhone && (
              <span className="text-overline text-error">
                {errors.receiverPhone.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-xs relative">
            <Label
              htmlFor="addressLine"
              className="text-secondary text-[11px] font-bold uppercase tracking-[0.1em]">
              ĐỊA CHỈ
            </Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-text-muted pointer-events-none" />
              <Input
                id="addressLine"
                placeholder="Tìm địa chỉ tại Hồ Chí Minh..."
                {...register("addressLine")}
                ref={(e) => {
                  (register("addressLine").ref as any)(e);
                  (inputRef as any).current = e;
                }}
                onFocus={() => setShowSuggestions(true)}
                className={cn(
                  "h-14 pl-10 pr-md rounded-md transition-all bg-surface-accent",
                  errors.addressLine
                    ? "border-error focus-visible:ring-error"
                    : "border-none",
                )}
              />
              {isSearchingAddress && (
                <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 size-4 animate-spin text-text-muted" />
              )}
            </div>
            {errors.addressLine && (
              <span className="text-overline text-error">
                {errors.addressLine.message}
              </span>
            )}

            {/* Suggestions Dropdown */}
            {showSuggestions && debouncedQuery.trim().length >= 2 && (isSearchingAddress || suggestions.length > 0) && (
              <div
                ref={dropdownRef}
                className="absolute top-full mt-1 left-0 right-0 z-50 bg-surface-main border border-border-primary-50 rounded-md shadow-lg max-h-48 overflow-y-auto"
              >
                {isSearchingAddress ? (
                  <div className="flex items-center gap-2 p-3 text-text-muted text-body-sm-reg">
                    <Loader2 className="size-4 animate-spin" />
                    Đang tìm kiếm...
                  </div>
                ) : (
                  suggestions.map((s, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleSelectSuggestion(s)}
                      className="w-full text-left px-3 py-2.5 text-body-sm-reg text-text-primary hover:bg-surface-accent transition-colors border-b border-border-primary-50 last:border-b-0"
                    >
                      <span className="font-medium">{s.address_line1}</span>
                      {s.address_line2 && (
                        <span className="text-text-muted">, {s.address_line2}</span>
                      )}
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-xs">
            <Label
              htmlFor="label"
              className="text-secondary text-[11px] font-bold uppercase tracking-[0.1em]">
              NHÃN
            </Label>
            <Input
              id="label"
              placeholder="VD: Nhà riêng, Cơ quan, Phòng Gym"
              {...register("label")}
              className={cn(
                "h-14 px-md rounded-md transition-all bg-surface-accent",
                errors.label
                  ? "border-error focus-visible:ring-error"
                  : "border-none",
              )}
            />
            {errors.label && (
              <span className="text-overline text-error">
                {errors.label.message}
              </span>
            )}
          </div>

          <div className="flex items-center gap-sm pt-2">
            <Checkbox
              id="isDefault"
              {...register("isDefault")}
              className="size-6 border-text-primary/20 bg-transparent rounded-sm checked:bg-brand-primary"
            />
            <Label
              htmlFor="isDefault"
              className="normal-case font-bold text-body-sm-reg text-text-primary">
              Đặt làm địa chỉ mặc định
            </Label>
          </div>

          <DialogFooter>
            <AppButton
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="w-full rounded-full border-text-muted/20 text-text-secondary hover:bg-surface-accent h-[54px]">
              HỦY
            </AppButton>
            <AppButton
              type="submit"
              isLoading={isPending}
              className="w-full rounded-full text-inverse-text h-[54px]">
              LƯU ĐỊA CHỈ
            </AppButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
