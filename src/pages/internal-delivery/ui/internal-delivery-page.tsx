"use client";

import { useMemo, useState, useEffect } from "react";
import {
  MapPin,
  Package,
  Navigation,
  Timer,
  DollarSign,
  Loader2,
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

  const [roadCoordinates, setRoadCoordinates] = useState<[number, number][]>([]);

  const deliveryData = scheduleResponse?.data;
  // Adjust to new data structure: shippers array with nested routes
  const shipper = deliveryData?.shippers?.[0];
  const orders = deliveryData?.formattedOrders || [];

  const shipperLocation = useMemo(() => {
    if (user?.lat && user?.lng) {
      return { lat: user.lat, lng: user.lng };
    }
    return null;
  }, [user]);

  const sortedSchedule = useMemo(() => {
    const schedule = shipper?.routes || [];
    return [...schedule].sort((a, b) => a.node - b.node);
  }, [shipper]);

  const routeSteps = useMemo(() => {
    // Note: The new structure doesn't have a direct 'tasks' array, 
    // so I need to adapt the grouping logic if I still want to group by location.
    // For now, I will treat each route node as a step.
    return sortedSchedule.map(node => ({
      ...node,
      tasks: [node] // Adapting to existing UI structure expecting 'tasks'
    }));
  }, [sortedSchedule]);

  const pendingSteps = useMemo(() => {
    // Treat a node as pending if status is 'PENDING'
    return routeSteps.filter(step => step.status === 'PENDING');
  }, [routeSteps]);

  const mapNodes = useMemo(() => {
    return pendingSteps.slice(0, 5);
  }, [pendingSteps]);

  const waypointCoordinates = useMemo(() => {
    const coords = mapNodes.map(
      (node) => [node.lng, node.lat] as [number, number],
    );
    if (shipperLocation && coords.length > 0) {
      return [
        [shipperLocation.lng, shipperLocation.lat],
        ...coords,
      ] as [number, number][];
    }
    return coords;
  }, [mapNodes, shipperLocation]);

  useEffect(() => {
    if (waypointCoordinates.length < 2) {
      return;
    }

    const fetchRoute = async () => {
      try {
        const coordsStr = waypointCoordinates.map(c => `${c[0]},${c[1]}`).join(';');
        const response = await fetch(
          `https://router.project-osrm.org/route/v1/driving/${coordsStr}?overview=full&geometries=geojson`
        );
        const data = await response.json();
        if (data.routes && data.routes.length > 0) {
          setRoadCoordinates(data.routes[0].geometry.coordinates);
        }
      } catch (error) {
        console.error("Failed to fetch OSRM route:", error);
      }
    };

    fetchRoute();
  }, [waypointCoordinates]);

  const displayCoordinates = useMemo(() => {
    if (waypointCoordinates.length < 2) return [];
    return roadCoordinates.length > 0 ? roadCoordinates : waypointCoordinates;
  }, [roadCoordinates, waypointCoordinates]);

  const currentStep = pendingSteps.length > 0 ? pendingSteps[0] : null;

  const upcomingRouteSteps = useMemo(() => {
    return pendingSteps.slice(1);
  }, [pendingSteps]);

  const nextDestination = useMemo(() => {
    return currentStep || null;
  }, [currentStep]);

  const mapCenter = useMemo(() => {
    if (nextDestination)
      return { lat: nextDestination.lat, lng: nextDestination.lng };
    if (sortedSchedule.length > 0)
      return { lat: sortedSchedule[0].lat, lng: sortedSchedule[0].lng };
    return { lat: 10.7757, lng: 106.7009 }; // Default HCM
  }, [nextDestination, sortedSchedule]);

  const getOrderSeq = (orderCode?: string) => {
    if (!orderCode) return 0;
    const index = orders.findIndex((o) => o.id === orderCode);
    return index !== -1 ? index + 1 : 0;
  };

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
          Active Shift
        </p>
        <h1 className="text-h1-bold text-text-primary leading-none uppercase">
          {user?.name || "Shipper"} Tracking
        </h1>
        <p className="text-text-secondary text-body-md-reg">
          Navigating {sortedSchedule.filter(n => n.type === "DELIVERY").length} artisanal deliveries in this shift.
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
              {displayCoordinates.length > 1 && (
                <MapRoute
                  coordinates={displayCoordinates}
                  color="#F0660A"
                  width={5}
                  opacity={0.8}
                />
              )}

              {mapNodes.map((node, idx) => {
                const isStore = node.type === "STORE" || node.type === "PICKUP";
                const orderSeq = !isStore ? getOrderSeq(node.orderCode || undefined) : 0;
                // isNext logic relative to the user's current step (from sortedSchedule/pendingSteps)
                const isNext =
                  currentStep &&
                  node.lat === currentStep.lat &&
                  node.lng === currentStep.lng;

                return (
                  <MapMarker
                    key={`${idx}-${node.lat}-${node.lng}`}
                    longitude={node.lng}
                    latitude={node.lat}
                    onClick={() =>
                      node.orderCode && scrollToOrder(node.orderCode)
                    }>
                    <MarkerContent>
                      {isStore ? (
                        <div
                          className={cn(
                            "p-1.5 rounded-full border-2 border-white shadow-xl transform transition-transform hover:scale-110 cursor-pointer",
                            "bg-blue-500", // Store is blue
                            isNext && "animate-bounce scale-110 ring-4 ring-info/20",
                          )}>
                          <Store className="size-5 text-white" />
                        </div>
                      ) : (
                        <div
                          className={cn(
                            "size-7 rounded-full border-4 border-white shadow-lg flex items-center justify-center text-[11px] font-extrabold text-white transition-transform hover:scale-110 cursor-pointer",
                            "bg-orange-500", // Delivery is orange
                            isNext && "animate-bounce scale-110 ring-4 ring-info/20",
                          )}>
                          {orderSeq}
                        </div>
                      )}
                      <MarkerLabel
                        position="bottom"
                        className={cn(
                          "text-[10px] font-bold uppercase tracking-wider bg-surface-main/80 px-1 rounded",
                          isNext ? "text-info font-extrabold" : "text-text-primary",
                        )}>
                        {isStore
                          ? node.storeName || "Store"
                          : `Delivery ${orderSeq}`}
                      </MarkerLabel>
                    </MarkerContent>
                    <MarkerTooltip>
                      <div className="p-1">
                        <p className="font-bold">
                          {isStore
                            ? node.storeName || "Store Location"
                            : `Delivery #${orderSeq}`}
                        </p>
                        {node.orderCode && (
                          <p className="text-xs text-text-secondary">
                            {node.orderCode}
                          </p>
                        )}
                        {isStore && node.storeAddress && (
                          <p className="text-[10px] text-text-secondary mt-1 max-w-[150px]">
                            {node.storeAddress}
                          </p>
                        )}
                        {node.arrival_datetime && (
                          <p className="text-[10px] text-success font-bold uppercase mt-1">
                            Completed
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
                  <div className="size-10 rounded-[12px] bg-info flex items-center justify-center shadow-md">
                    <MapPin className="text-white size-5" />
                  </div>
                  <div className="flex flex-col">
                    <p className="text-text-secondary text-[10px] font-bold uppercase tracking-widest leading-none mb-1">
                      Next Destination
                    </p>
                    <p className="text-text-primary text-body-sm-semibold leading-tight line-clamp-2">
                      {nextDestination.type === "STORE" || nextDestination.type === "PICKUP"
                        ? nextDestination.storeName || "Store Pickup"
                        : `Delivery #${nextDestination.orderCode}`}
                    </p>
                  </div>
                </div>
                <div className="text-right border-l border-text-muted/20 pl-md">
                  <p className="text-info text-[10px] font-extrabold uppercase tracking-widest leading-none mb-1">
                    Type
                  </p>
                  <p className="text-text-primary text-h4-bold leading-none uppercase">
                    {nextDestination.type === "STORE" || nextDestination.type === "PICKUP" ? "Pickup" : "Delivery"}
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
              Upcoming Route
            </h2>
            <Badge
              variant="outline"
              className="rounded-full border-text-muted/20 text-text-secondary text-[10px] font-bold px-3">
              {pendingSteps.length} STOPS REMAINING
            </Badge>
          </div>

          <div className="relative space-y-md lg:space-y-lg">
            {/* Visual Route Line */}
            {pendingSteps.length > 0 && (
              <div className="absolute left-[26px] top-12 bottom-12 w-0.5 border-l-2 border-dashed border-info/20 z-0 hidden lg:block" />
            )}

            {/* Heading To Card */}
            {currentStep && (
              <div className="relative z-10">
                <Card className="rounded-[24px] border-none shadow-sm overflow-hidden bg-info/5 border border-info/20 ring-1 ring-info/20">
                  <CardContent className="p-lg lg:p-xl space-y-lg">
                    <div className="flex items-start justify-between gap-md">
                      <div className="flex items-center gap-md">
                        <div className="size-12 rounded-[16px] bg-info flex items-center justify-center shadow-lg shadow-info/20 relative">
                          {currentStep.type === "STORE" || currentStep.type === "PICKUP" ? <Store className="text-white size-6" /> : <Navigation className="text-white size-6" />}
                          <div className="absolute -right-1 -top-1 size-4 bg-white rounded-full flex items-center justify-center border-2 border-info">
                            <div className="size-1.5 bg-info rounded-full animate-ping" />
                          </div>
                        </div>
                        <div>
                          <p className="text-info text-[10px] font-bold uppercase tracking-widest leading-none mb-1">
                            Currently Heading To
                          </p>
                          <h3 className="text-h3-bold text-text-primary">
                            {currentStep.type === "STORE" || currentStep.type === "PICKUP"
                              ? currentStep.storeName || "Store Pickup"
                              : currentStep.customerName || `Order ${currentStep.orderCode}`}
                          </h3>
                        </div>
                      </div>
                      <Badge className="bg-info text-white hover:bg-info/90 text-[10px] font-extrabold tracking-widest px-3 py-1 rounded-full shrink-0 uppercase">
                        On My Way
                      </Badge>
                    </div>

                    <div className="space-y-md">
                      <div className="flex items-start gap-sm">
                        <MapPin className="size-5 text-info shrink-0 mt-0.5" />
                        <p className="text-text-secondary text-body-sm-reg leading-snug">
                          {currentStep.type === "STORE" || currentStep.type === "PICKUP"
                            ? currentStep.storeAddress || "Store Address"
                            : currentStep.address || "Delivery Address"}
                        </p>
                      </div>

                      {/* Detailed info at this stop */}
                      <div className="space-y-sm pt-xs text-text-secondary text-body-sm-reg">
                        {currentStep.orderCode && <p><span className="font-bold">Order:</span> #{currentStep.orderCode}</p>}
                        {currentStep.items && currentStep.items.length > 0 && (
                          <div className="space-y-xs">
                            <p className="font-bold">Items:</p>
                            {currentStep.items.map((item, i) => (
                              <p key={i}>• {item.quantity}x {item.name}</p>
                            ))}
                          </div>
                        )}
                        {currentStep.total && <p><span className="font-bold">Total:</span> {parseInt(currentStep.total).toLocaleString()} VND</p>}
                        {currentStep.customerName && <p><span className="font-bold">Customer:</span> {currentStep.customerName} ({currentStep.customerPhone})</p>}
                      </div>
                    </div>

                    <div className="pt-md border-t border-info/10">
                      <Button className="w-full h-14 rounded-full bg-info hover:bg-info/90 text-white gap-md label-button-md shadow-lg shadow-info/20 active:scale-95 transition-all">
                        <Navigation className="size-6" /> Start Navigation
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Upcoming Steps */}
            {upcomingRouteSteps.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-md lg:gap-lg relative z-10">
                {upcomingRouteSteps.map((stop, idx) => {
                  const isStore = stop.type === "STORE" || stop.type === "PICKUP";

                  return (
                    <div key={idx} className="relative">
                      {/* Connection dot for timeline (Desktop only) */}
                      <div className={cn(
                        "absolute -left-[32px] top-8 size-4 rounded-full border-2 border-white shadow-sm z-20 hidden lg:block",
                        isStore ? "bg-success" : "bg-brand-primary"
                      )} />

                      <Card
                        id={stop.orderCode ? `order-${stop.orderCode}` : `task-${idx}`}
                        className="rounded-[24px] bg-surface-accent/60 border-none shadow-sm overflow-hidden group hover:shadow-md transition-all duration-300"
                      >
                        <CardContent className="p-lg lg:p-xl space-y-lg">
                          <div className="flex items-start justify-between gap-md">
                            <div className="flex items-center gap-md">
                              <div className={cn(
                                "size-10 rounded-[12px] flex items-center justify-center shadow-md",
                                isStore ? "bg-success/10 text-success" : "bg-brand-primary/10 text-brand-primary"
                              )}>
                                {isStore ? <Store className="size-5" /> : <Package className="size-5" />}
                              </div>
                              <div>
                                <p className={cn(
                                  "text-[10px] font-bold uppercase tracking-widest leading-none mb-1",
                                  isStore ? "text-success" : "text-brand-primary"
                                )}>
                                  {isStore ? "Upcoming Pickup" : "Upcoming Delivery"}
                                </p>
                                <h3 className="text-body-md-semibold text-text-primary">
                                  {isStore ? stop.storeName || "Store Pickup" : stop.customerName || `Order #${stop.orderCode}`}
                                </h3>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-sm text-text-secondary text-[12px]">
                            <div className="flex items-start gap-sm">
                              <MapPin className="size-4 text-text-muted shrink-0 mt-0.5" />
                              <p className="leading-snug line-clamp-1">
                                {isStore ? stop.storeAddress || "Store Address" : stop.address}
                              </p>
                            </div>

                            {stop.orderCode && <p>Order: #{stop.orderCode}</p>}
                            {stop.items && stop.items.length > 0 && (
                              <p>Items: {stop.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}</p>
                            )}
                            {stop.total && <p>Total: {parseInt(stop.total).toLocaleString()} VND</p>}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  );
                })}
              </div>
            )}
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
