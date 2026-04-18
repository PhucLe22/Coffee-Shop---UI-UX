"use client";

import React from "react";
import { AppButton } from "@/shared/ui";

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
  return (
    <section className="rounded-md bg-surface-muted overflow-hidden">
      <div className="flex items-center justify-between border-b border-black/5 bg-black/5 px-8 py-4">
        <h3 className="text-h5-bold text-text-primary">Personal Information</h3>
        <button className="text-body-sm-semibold text-text-primary hover:underline transition-all">
          Edit Profile
        </button>
      </div>
      
      <div className="grid grid-cols-2 p-4">
        <InfoItem label="Full Name" value="Verdant Amber" />
        <InfoItem label="Email Address" value="verdant.amber@example.com" />
        <InfoItem label="Phone Number" value="+1 (555) 0123-4567" />
        <InfoItem label="Birthday" value="October 14, 1992" />
      </div>
    </section>
  );
}
