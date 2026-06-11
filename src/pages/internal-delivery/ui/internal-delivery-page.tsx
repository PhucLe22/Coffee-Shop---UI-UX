"use client";

import { useMemo } from "react";
import {
  MapPin,
  Package,
  Navigation,
  ChevronRight,
  Timer,
  DollarSign,
  Loader2,
  Bike,
  Store,
} from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { Card, CardContent } from "@/shared/ui/card";
import { cn } from "@/shared/lib/utils";
import {
  Map,
  MapMarker,
  MarkerContent,
  MapRoute,
  MarkerLabel,
  MarkerTooltip,
} from "@/components/ui/map";
import { useDeliverySchedule } from "@/entities/order";
import { useStaffAuthStore } from "@/shared/auth";

export default function InternalDeliveryPage() {
  const { user } = useStaffAuthStore();
  const { data: scheduleResponse, isLoading, error } = useDeliverySchedule();

  const deliveryData = scheduleResponse?.data;
  const schedule = deliveryData?.schedule || [];
  const orders = deliveryData?.formattedOrders || [];

  const shipperLocation = useMemo(() => {
    if (user?.lat && user?.lng) {
      return { lat: user.lat, lng: user.lng };
    }
    return null;
  }, [user]);

  // Calculate order sequence for labels
  const getOrderSequence = (nodeIdx: number) => {
    let sequence = 0;
    for (let i = 0; i <= nodeIdx; i++) {
      if (schedule[i].type !== "STORE") {
        sequence++;
      }
    }
    return sequence;
  };

  const routeCoordinates = useMemo(() => {
    // Filter to only include the store (first node) and DELIVERY nodes
    return schedule
      .filter((node) => node.type === "STORE" || node.type === "DELIVERY")
      .map((node) => [node.lng, node.lat] as [number, number]);
  }, [schedule]);

  const nextDestination = useMemo(() => {
    return schedule.find(
      (node) => node.type !== "STORE" && !node.arrival_datetime,
    );
  }, [schedule]);

  const mapCenter = useMemo(() => {
    if (nextDestination)
      return { lat: nextDestination.lat, lng: nextDestination.lng };
    if (schedule.length > 0)
      return { lat: schedule[0].lat, lng: schedule[0].lng };
    return { lat: 10.7757, lng: 106.7009 }; // Default HCM
  }, [nextDestination, schedule]);

  const scrollToOrder = (orderId: string) => {
    const element = document.getElementById(`order-${orderId}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center bg-surface-main">
        <Loader2 className="size-8 animate-spin text-brand-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full flex-col items-center justify-center bg-surface-main p-xl text-center">
        <p className="text-h3-bold text-error">
          Failed to load delivery schedule
        </p>
        <p className="text-text-secondary mt-md">
          Please check your connection and try again.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-surface-main overflow-y-auto no-scrollbar">
      {/* Page Header */}
      <div className="p-md lg:p-xl space-y-xs lg:space-y-sm">
        <p className="text-brand-primary text-body-sm-semibold uppercase tracking-[0.2em]">
          Active Shifts
        </p>
        <h1 className="text-h1-bold text-text-primary leading-none">
          LIVE DELIVERY TRACKING
        </h1>
        <p className="text-text-secondary text-body-md-reg">
          Currently navigating {orders.length} artisanal deliveries.
        </p>
      </div>

      {/* Stacked Layout */}
      <div className="px-md lg:px-xl pb-xl flex flex-col gap-md lg:gap-lg">
        {/* Map & Stats Section */}
        <div className="space-y-md lg:space-y-lg flex flex-col">
          {/* Map Snippet */}
          <Card className="rounded-[24px] border-none shadow-sm overflow-hidden aspect-square relative group">
            <Map
              center={mapCenter}
              zoom={18}
              className="w-full h-full grayscale-[0.3] contrast-[1.1]">
              {routeCoordinates.length > 1 && (
                <MapRoute
                  coordinates={routeCoordinates}
                  color="#F0660A"
                  width={5}
                  opacity={0.8}
                />
              )}

              {schedule.map((node, idx) => {
                const isStore = node.type === "STORE";
                const orderSeq = !isStore ? getOrderSequence(idx) : 0;

                return (
                  <MapMarker
                    key={idx}
                    longitude={node.lng}
                    latitude={node.lat}
                    onClick={() =>
                      node.orderCode && scrollToOrder(node.orderCode)
                    }>
                    <MarkerContent>
                      {isStore ? (
                        <div className="bg-brand-primary p-1.5 rounded-full border-2 border-white shadow-xl transform transition-transform hover:scale-110 cursor-pointer">
                          <Store className="size-5 text-white" />
                        </div>
                      ) : (
                        <div
                          className={cn(
                            "size-7 rounded-full border-4 border-white shadow-lg flex items-center justify-center text-[11px] font-extrabold text-white transition-transform hover:scale-110 cursor-pointer",
                            node.arrival_datetime
                              ? "bg-success"
                              : "bg-brand-primary animate-pulse",
                          )}>
                          {orderSeq}
                        </div>
                      )}
                      <MarkerLabel
                        position="bottom"
                        className="text-[10px] font-bold uppercase tracking-wider text-text-primary bg-surface-main/80 px-1 rounded">
                        {isStore ? "Pickup Point" : `Order ${orderSeq}`}
                      </MarkerLabel>
                    </MarkerContent>
                    <MarkerTooltip>
                      <div className="p-1">
                        <p className="font-bold">
                          {isStore ? "Store Location" : `Delivery #${orderSeq}`}
                        </p>
                        {!isStore && (
                          <p className="text-xs text-text-secondary">
                            {node.orderCode}
                          </p>
                        )}
                        {node.arrival_datetime && (
                          <p className="text-[10px] text-success font-bold uppercase mt-1">
                            Delivered
                          </p>
                        )}
                      </div>
                    </MarkerTooltip>
                  </MapMarker>
                );
              })}
            </Map>

            {/* Interactive Map Overlay */}
            {nextDestination && (
              <div className="absolute bottom-md left-md right-md bg-surface-main/95 border border-text-muted/20 rounded-[16px] p-md flex items-center justify-between backdrop-blur-md shadow-lg">
                <div className="flex items-center gap-md">
                  <div className="size-10 rounded-[12px] bg-brand-primary flex items-center justify-center shadow-md">
                    <MapPin className="text-white size-5" />
                  </div>
                  <div className="flex flex-col">
                    <p className="text-text-secondary text-[10px] font-bold uppercase tracking-widest leading-none mb-1">
                      Next Destination
                    </p>
                    <p className="text-text-primary text-body-sm-semibold leading-tight line-clamp-2">
                      {nextDestination.type} for {nextDestination.orderCode}
                    </p>
                  </div>
                </div>
                <div className="text-right border-l border-text-muted/20 pl-md">
                  <p className="text-brand-primary text-[10px] font-extrabold uppercase tracking-widest leading-none mb-1">
                    Type
                  </p>
                  <p className="text-text-primary text-h4-bold leading-none">
                    {nextDestination.type}
                  </p>
                </div>
              </div>
            )}
          </Card>

          {/* Shift Stats (Asymmetric) */}
          <div className="grid grid-cols-2 gap-md lg:gap-lg">
            <Card className="rounded-[24px] bg-surface-accent border-text-muted/10 p-lg flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
              <p className="text-text-secondary text-[10px] font-bold uppercase tracking-widest">
                Total Orders
              </p>
              <h3 className="text-h2-bold text-text-primary mt-md">
                {deliveryData?.numOrders || 0}
              </h3>
            </Card>
            <Card className="rounded-[24px] bg-surface-accent border-text-muted/10 p-lg flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <p className="text-text-secondary text-[10px] font-bold uppercase tracking-widest">
                  Shippers
                </p>
                <DollarSign className="size-4 text-brand-primary opacity-50" />
              </div>
              <h3 className="text-h2-bold text-text-primary mt-md">
                {deliveryData?.numShippers || 0}
              </h3>
            </Card>
          </div>
        </div>

        {/* Active Order List Section */}
        <div className="space-y-md lg:space-y-lg">
          <div className="flex items-center justify-between px-xs">
            <h2 className="text-h4-bold text-text-primary">
              Scheduled Deliveries
            </h2>
            <Badge
              variant="outline"
              className="rounded-full border-text-muted/20 text-text-secondary text-[10px] font-bold px-3">
              {orders.length} ORDERS
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-md lg:gap-lg">
            {orders.map((order, idx) => (
              <Card
                key={idx}
                id={`order-${order.id}`}
                className={cn(
                  "rounded-[24px] border-none shadow-sm transition-all duration-300 overflow-hidden group hover:shadow-md scroll-mt-24",
                  order.isFocused
                    ? "bg-surface-accent ring-1 ring-brand-primary/30"
                    : "bg-surface-accent/60",
                )}>
                <CardContent className="p-lg lg:p-xl space-y-lg">
                  {/* Card Top: Customer & Status */}
                  <div className="flex items-start justify-between gap-md">
                    <div className="space-y-0.5">
                      <h3 className="text-h3-bold text-text-primary group-hover:text-brand-primary transition-colors">
                        {order.customer}
                      </h3>
                      <p className="text-text-secondary text-body-sm-reg">
                        Order #{order.id}
                      </p>
                    </div>
                    <Badge className="bg-info text-white hover:bg-info/90 text-[10px] font-extrabold tracking-widest px-3 py-1 rounded-full shrink-0">
                      {order.status}
                    </Badge>
                  </div>

                  {/* Card Middle: Address & Items */}
                  <div className="space-y-md">
                    <div className="flex items-start gap-sm">
                      <MapPin className="size-5 text-brand-primary shrink-0 mt-0.5" />
                      <p className="text-text-secondary text-body-sm-reg leading-snug">
                        {order.address}
                      </p>
                    </div>
                    <div className="flex items-start gap-sm">
                      <Package className="size-5 text-text-muted shrink-0 mt-0.5" />
                      <p className="text-text-secondary text-body-sm-reg leading-snug">
                        {order.items}
                      </p>
                    </div>
                  </div>

                  {/* Card Bottom: Action Button */}
                  <div className="pt-md border-t border-text-muted/10 flex items-center justify-between gap-lg">
                    {order.isFocused ? (
                      <Button className="w-full h-14 rounded-full bg-brand-primary hover:bg-brand-accent text-white gap-md label-button-md shadow-lg shadow-brand-primary/20 active:scale-95 transition-all">
                        <Navigation className="size-6" /> Navigate to
                        Destination
                      </Button>
                    ) : (
                      <>
                        <div className="flex items-center gap-xs text-text-muted group-hover:text-text-secondary transition-colors">
                          <Timer className="size-4" />
                          <span className="text-[10px] font-bold uppercase tracking-widest">
                            Sequence order: {idx + 1}
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="rounded-full hover:bg-brand-primary hover:text-white transition-colors">
                          <ChevronRight className="size-6" />
                        </Button>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Quick Support / Support Button */}
          <Button
            variant="ghost"
            className="w-full h-14 rounded-[24px] border-2 border-dashed border-text-muted/20 text-text-muted hover:border-brand-primary hover:text-brand-primary hover:bg-brand-primary/5 transition-all gap-md label-button-md">
            <Timer className="size-5" /> Need Assistance? Contact Dispatch
          </Button>
        </div>
      </div>
    </div>
  );
}
