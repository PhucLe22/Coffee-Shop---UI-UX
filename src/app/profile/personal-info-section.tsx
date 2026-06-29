"use client";

import React from "react";
import { useCustomerAuthStore } from "@/shared/auth";
import { useProfile } from "./use-profile";

interface InfoItemProps {
  label: string;
  value: string;
}

const InfoItem = ({ label, value }: InfoItemProps) => (
  <div className="flex flex-col gap-2 p-4">
    <span className="text-body-sm-semibold uppercase tracking-wider text-text-muted">
      {label}
    </span>
    <span className="text-body-md-bold text-text-primary">
      {value}
    </span>
  </div>
);

export function PersonalInfoSection() {
  const { user } = useCustomerAuthStore();
  useProfile();

  return (
    <section className="rounded-md bg-surface-muted overflow-hidden">
      <div className="flex items-center justify-between border-b border-black/5 bg-black/5 px-4 py-4 md:px-8">
        <h3 className="text-h5-bold text-text-primary">Personal Information</h3>
        <button className="text-body-sm-semibold text-text-primary hover:underline transition-all">
          Edit Profile
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 p-4">
        <InfoItem label="Full Name" value={user?.name ?? ""} />
        <InfoItem label="Email Address" value={user?.email ?? ""} />
        <InfoItem label="Phone Number" value={user?.phone ?? ""} />
      </div>
    </section>
  );
}
