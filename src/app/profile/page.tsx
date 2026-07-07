"use client";

import { useIsMobile } from "@/shared/lib";
import { MobileProfileView } from "./mobile-profile-view";
import { DesktopProfileView } from "./desktop-profile-view";

export default function ProfilePage() {
  const isMobile = useIsMobile();

  // Prevent hydration mismatch by returning a skeleton or null until mounted is handled by main-layout
  // But useIsMobile returns undefined initially usually, so we need to be careful.
  // The useIsMobile in this project returns !!isMobile, and isMobile starts as undefined.
  // So it will be false (Desktop) for a split second or until effect runs.

  // Let's assume the layout handles the mounting state as seen in main-layout.tsx.

  if (isMobile) {
    return <MobileProfileView />;
  }

  return <DesktopProfileView />;
}
