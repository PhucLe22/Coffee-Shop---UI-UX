"use client";

import React from "react";
import { DesktopProfileSidebar } from "./desktop-profile-sidebar";
import { PersonalInfoSection } from "./personal-info-section";
import { AddressSection } from "./address-section";
import { PaymentSection } from "./payment-section";
import { NotificationSettingsSection } from "./notification-settings-section";
import { useProfile } from "./use-profile";

export function DesktopProfileView() {
  useProfile();
  return (
    <div className="min-h-screen bg-surface-accent pb-20 pt-10">
      <div className="mx-auto flex max-w-[1280px] gap-10 px-6">
        {/* Left Side: Sidebar */}
        <DesktopProfileSidebar />

        {/* Right Side: Content Area */}
        <div className="flex flex-1 flex-col gap-8">
          {/* Top Section: Personal Information */}
          <PersonalInfoSection />

          {/* Middle Row: Addresses & Payment Methods */}
          <div className="grid grid-cols-2 gap-8">
            <AddressSection />
            <PaymentSection />
          </div>

          {/* Bottom Section: Notification Settings */}
          <NotificationSettingsSection />
        </div>
      </div>
    </div>
  );
}
