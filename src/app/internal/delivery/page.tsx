"use client";

import dynamic from "next/dynamic";

// The delivery map needs browser APIs, so render it on the client only
// (works for both `next start` and the static export).
const InternalDeliveryPage = dynamic(() => import("@/pages/internal-delivery"), { ssr: false });

export default function Page() {
  return <InternalDeliveryPage />;
}
