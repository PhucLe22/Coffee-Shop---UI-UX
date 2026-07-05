"use client";

import React from "react";
import { DesktopProfileSidebar } from "./desktop-profile-sidebar";
import { PersonalInfoSection } from "./personal-info-section";
import { AddressSection } from "./address-section";
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

          <AddressSection />

        </div>
      </div>
    </div>
  );
}
