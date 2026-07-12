"use client";

import React from "react";
import { MapPin, Plus, Trash2 } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { useAddresses, useDeleteAddress } from "@/entities/customer";
import { toast } from "sonner";
import { Address } from "@/entities/customer/model/address";

import { CreateAddressDialog } from "./create-address-dialog";
import { UpdateAddressDialog } from "./update-address-dialog";

interface AddressCardProps {
  address: Address;
}

const AddressCard = ({ address }: AddressCardProps) => {
  const { mutate: deleteAddress, isPending } = useDeleteAddress();
  const isPrimary = address.isDefault;

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this address?")) {
      deleteAddress(address.id, {
        onSuccess: () => toast.success("Address deleted successfully"),
        onError: (err: any) => toast.error(err?.response?.data?.message || "Failed to delete address"),
      });
    }
  };

  return (
    <div
      className={cn(
        "group relative flex flex-col gap-2 rounded-sm p-4 transition-all",
        isPrimary
          ? "bg-text-secondary text-inverse-text shadow-md"
          : "bg-surface-accent text-text-primary border border-black/5"
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPin className={cn("size-4", isPrimary ? "text-inverse-text" : "text-text-secondary")} />
          <span className="text-body-sm-semibold">{address.label}</span>
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <UpdateAddressDialog address={address} />
          <button 
            disabled={isPending}
            onClick={handleDelete}
            className={cn(
              "p-2 rounded-full transition-all",
              isPrimary ? "text-inverse-text hover:bg-white/10" : "text-text-primary hover:bg-black/5"
            )}
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      </div>
      <p className={cn("text-body-sm-reg", isPrimary ? "text-inverse-text/80" : "text-text-muted")}>
        {address.addressLine}
      </p>
    </div>
  );
};

export function AddressSection() {
  const { data: response, isLoading } = useAddresses();
  const addresses = response?.data || [];

  if (isLoading) return <section className="rounded-md bg-surface-muted p-6">Loading addresses...</section>;

  return (
    <section className="rounded-md bg-surface-muted overflow-hidden">
      <div className="flex items-center justify-between border-b border-black/5 bg-black/5 px-6 py-4">
        <h3 className="text-body-md-bold text-text-primary">Saved Addresses</h3>
        <CreateAddressDialog />
      </div>
      
      <div className="flex flex-col gap-4 p-6 max-h-[320px] overflow-y-auto">
        {addresses.length === 0 && <p className="text-text-muted text-body-sm-reg">No addresses saved.</p>}
        {addresses.map((addr) => (
          <AddressCard 
            key={addr.id}
            address={addr}
          />
        ))}
      </div>
    </section>
  );
}
