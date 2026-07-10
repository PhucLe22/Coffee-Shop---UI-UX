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
  Check,
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
import { useDeliverySchedule, useConfirmPickup, useCompleteDelivery } from "@/entities/order";
import { useStaffAuthStore } from "@/shared/auth";
import { toast } from "sonner";

export default function InternalDeliveryPage() {
  const { user } = useStaffAuthStore();
  const { data: scheduleResponse, isLoading, error } = useDeliverySchedule();
  const { mutate: confirmPickup, isPending: isPickupPending } = useConfirmPickup();
  const { mutate: completeDelivery, isPending: isCompletePending } = useCompleteDelivery();

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

  const firstPendingIdx = useMemo(() => {
    return sortedSchedule.findIndex(n => n.status !== 'COMPLETED');
  }, [sortedSchedule]);

  const pendingSteps = useMemo(() => {
    // Treat a node as actionable if status is 'PENDING' or 'IN_PROGRESS'
    return routeSteps.filter(step => step.status === 'PENDING' || step.status === 'IN_PROGRESS');
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
          Không thể tải lịch giao hàng
        </p>
        <p className="text-text-secondary mt-md">
          Vui lòng kiểm tra kết nối và thử lại.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-surface-main overflow-y-auto no-scrollbar">
      {/* Page Header */}
      <div className="p-md lg:p-xl space-y-xs lg:space-y-sm">
        <p className="text-brand-primary text-body-sm-semibold uppercase tracking-[0.2em]">
          Ca Làm Việc
        </p>
        <h1 className="text-h1-bold text-text-primary leading-none uppercase">
          {user?.name || "Shipper"} Theo Dõi
        </h1>
        <p className="text-text-secondary text-body-md-reg">
          Đang thực hiện {sortedSchedule.filter(n => n.type === "DELIVERY").length} chuyến giao hàng trong ca này.
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
                          ? node.storeName || "Cửa Hàng"
                          : `Delivery ${orderSeq}`}
                      </MarkerLabel>
                    </MarkerContent>
                    <MarkerTooltip>
                      <div className="p-1">
                        <p className="font-bold">
                          {isStore
                          ? node.storeName || "Địa Điểm Cửa Hàng"
                          : `Giao Hàng #${orderSeq}`}
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
                            Hoàn Thành
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
                      Điểm Đến Tiếp Theo
                    </p>
                    <p className="text-text-primary text-body-sm-semibold leading-tight line-clamp-2">
                      {nextDestination.type === "STORE" || nextDestination.type === "PICKUP"
                        ? nextDestination.storeName || "Nhận Tại Cửa Hàng"
                        : `Delivery #${nextDestination.orderCode}`}
                    </p>
                  </div>
                </div>
                <div className="text-right border-l border-text-muted/20 pl-md">
                  <p className="text-info text-[10px] font-extrabold uppercase tracking-widest leading-none mb-1">
                    Loại
                  </p>
                  <p className="text-text-primary text-h4-bold leading-none uppercase">
                    {nextDestination.type === "STORE" || nextDestination.type === "PICKUP" ? "Nhận Hàng" : "Giao Hàng"}
                  </p>
                </div>
              </div>
            )}
          </Card>

          {/* Shift Stats (Asymmetric) */}
          <div className="grid grid-cols-2 gap-md lg:gap-lg">
            <Card className="rounded-[24px] bg-surface-accent border-text-muted/10 p-lg flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
              <p className="text-text-secondary text-[10px] font-bold uppercase tracking-widest">
                Tổng Đơn Hàng
              </p>
              <h3 className="text-h2-bold text-text-primary mt-md">
                {deliveryData?.numOrders || 0}
              </h3>
            </Card>
            <Card className="rounded-[24px] bg-surface-accent border-text-muted/10 p-lg flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <p className="text-text-secondary text-[10px] font-bold uppercase tracking-widest">
                  Shipper
                </p>
                <DollarSign className="size-4 text-brand-primary opacity-50" />
              </div>
              <h3 className="text-h2-bold text-text-primary mt-md">
                {deliveryData?.numShippers || 0}
              </h3>
            </Card>
          </div>
        </div>

        {/* Route Timeline - shows all nodes */}
        <div className="space-y-md lg:space-y-lg">
          <div className="flex items-center justify-between px-xs">
            <h2 className="text-h4-bold text-text-primary">
              Lộ Trình
            </h2>
            <Badge
              variant="outline"
              className="rounded-full border-text-muted/20 text-text-secondary text-[10px] font-bold px-3">
              {sortedSchedule.length} ĐIỂM DỪNG
            </Badge>
          </div>

          <div className="relative space-y-0">
            {/* Visual Route Line */}
            {sortedSchedule.length > 0 && (
              <div className="absolute left-[26px] top-12 bottom-12 w-0.5 border-l-2 border-dashed border-info/20 z-0 hidden lg:block" />
            )}

            {sortedSchedule.map((node, idx) => {
              const isCompleted = node.status === 'COMPLETED';
              const isStore = node.type === 'STORE' || node.type === 'PICKUP';
              const isFirstPending = idx === firstPendingIdx;
              const hasOrder = !!node.orderId;
              const prevTravelTime = idx > 0 ? sortedSchedule[idx - 1]?.travel_time_minutes : undefined;

              const arrivalTime = node.arrival_datetime
                ? (() => {
                    try {
                      return new Date(node.arrival_datetime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
                    } catch { return node.arrival_datetime; }
                  })()
                : null;

              return (
                <div key={`${node.node}-${node.orderId || idx}`} className="relative z-10">
                  {/* Travel time separator */}
                  {prevTravelTime != null && (
                    <div className="flex items-center gap-md py-md">
                      <div className="h-px flex-1 bg-border-primary-50/20" />
                      <Timer className="size-3 text-text-muted" />
                      <span className="text-text-muted text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">
                        {prevTravelTime} PHÚT
                      </span>
                      <div className="h-px flex-1 bg-border-primary-50/20" />
                    </div>
                  )}

                  {/* Connection dot on timeline (desktop) */}
                  <div className={cn(
                    "absolute -left-[32px] top-8 size-4 rounded-full border-2 border-white shadow-sm z-20 hidden lg:block",
                    isCompleted ? "bg-success" : isStore ? "bg-info" : "bg-brand-primary"
                  )} />

                  <Card
                    id={node.orderCode ? `order-${node.orderCode}` : `node-${idx}`}
                    className={cn(
                      "rounded-[16px] border-none shadow-sm overflow-hidden transition-all duration-300",
                      isFirstPending && !isCompleted
                        ? "bg-info/5 border border-info/20 ring-1 ring-info/20"
                        : isCompleted
                          ? "bg-surface-accent/40 opacity-70"
                          : "bg-surface-accent/60 hover:shadow-md"
                    )}
                  >
                    <CardContent className={cn(
                      "p-lg lg:p-xl",
                      isFirstPending && !isCompleted ? "space-y-lg" : "space-y-md"
                    )}>
                      <div className="flex items-start justify-between gap-md">
                        <div className="flex items-center gap-md min-w-0">
                          <div className={cn(
                            "size-10 rounded-[12px] flex items-center justify-center shadow-md shrink-0",
                            isCompleted
                              ? "bg-success/10 text-success"
                              : isStore
                                ? "bg-info/10 text-info"
                                : "bg-brand-primary/10 text-brand-primary"
                          )}>
                            {isCompleted ? (
                              <Check className="size-5" />
                            ) : isStore ? (
                              <Store className="size-5" />
                            ) : (
                              <Package className="size-5" />
                            )}
                          </div>
                          <div className="min-w-0">
                            {/* Badges row */}
                            <div className="flex items-center gap-sm flex-wrap mb-1">
                              {arrivalTime && (
                                <Badge className="bg-brand-primary/10 text-brand-primary text-[10px] font-extrabold tracking-wider px-2 py-0.5 rounded-full border-none">
                                  {arrivalTime}
                                </Badge>
                              )}
                              {isCompleted && (
                                <Badge className="bg-success/10 text-success text-[10px] font-extrabold tracking-wider px-2 py-0.5 rounded-full border-none gap-sm">
                                  <Check className="size-3" /> HOÀN THÀNH
                                </Badge>
                              )}
                              {node.action_amount != null && (
                                <Badge className={cn(
                                  "text-[10px] font-extrabold tracking-wider px-2 py-0.5 rounded-full border-none",
                                  node.action_amount > 0
                                    ? "bg-info/10 text-info"
                                    : "bg-warning/10 text-warning"
                                )}>
                                  {node.action_amount > 0 ? `+${node.action_amount}` : node.action_amount}
                                </Badge>
                              )}
                              {node.load_after_action != null && (
                                <Badge className="bg-surface-accent text-text-secondary text-[10px] font-extrabold tracking-wider px-2 py-0.5 rounded-full border-none">
                                  Tải: {node.load_after_action}
                                </Badge>
                              )}
                            </div>
                            <p className={cn(
                              "text-[10px] font-bold uppercase tracking-widest leading-none mb-1",
                              isCompleted ? "text-success" : isStore ? "text-info" : "text-brand-primary"
                            )}>
                              {!hasOrder
                                ? "Điểm Xuất Phát"
                                : isCompleted
                                  ? (isStore ? "Đã Nhận Hàng" : "Đã Giao Hàng")
                                  : (isStore ? "Nhận Hàng" : "Giao Hàng")}
                            </p>
                            <h3 className={cn(
                              "leading-tight truncate",
                              isFirstPending && !isCompleted ? "text-h3-bold" : "text-body-md-semibold"
                            )}>
                              {!hasOrder
                                ? (node.storeName || "Điểm Xuất Phát")
                                : `${isStore ? 'Pickup' : 'Deliver'}: ${node.orderCode || 'N/A'}`}
                            </h3>
                          </div>
                        </div>
                        {isFirstPending && !isCompleted && (
                          <Badge className="bg-info text-white hover:bg-info/90 text-[10px] font-extrabold tracking-widest px-3 py-1 rounded-full shrink-0 uppercase">
                            Đang Tới
                          </Badge>
                        )}
                      </div>

                      <div className={cn(
                        "space-y-sm text-text-secondary",
                        isFirstPending && !isCompleted ? "text-body-sm-reg" : "text-[12px]"
                      )}>
                        {hasOrder && (
                          <>
                            {isStore && node.storeName && (
                              <p><span className="font-semibold">Cửa Hàng:</span> {node.storeName}</p>
                            )}
                            {!isStore && node.customerName && (
                              <p><span className="font-semibold">Khách Hàng:</span> {node.customerName}{node.customerPhone ? ` (${node.customerPhone})` : ''}</p>
                            )}
                          </>
                        )}

                        {(node.address || node.storeAddress) && (
                          <div className="flex items-start gap-sm">
                            <MapPin className="size-4 text-text-muted shrink-0 mt-0.5" />
                            <p className="leading-snug line-clamp-2">
                              {isStore ? node.storeAddress : node.address}
                            </p>
                          </div>
                        )}

                        {hasOrder && node.orderCode && (
                          <p><span className="font-semibold">Mã Đơn:</span> #{node.orderCode}</p>
                        )}

                        {node.items && node.items.length > 0 && (
                          <div className="space-y-xs">
                            {node.items.map((item, i) => (
                              <p key={i}>• {item.quantity}x {item.name}</p>
                            ))}
                          </div>
                        )}

                        {node.total && (
                          <p><span className="font-semibold">Tổng:</span> {parseInt(node.total).toLocaleString()} VND</p>
                        )}
                      </div>

                      {hasOrder && !isCompleted && (
                        <div className="pt-md border-t border-border-primary-50/10">
                          {isStore ? (
                            <Button
                              className={cn(
                                "w-full rounded-full text-white gap-sm",
                                isFirstPending
                                  ? "h-14 bg-success hover:bg-success/90 label-button-md shadow-lg shadow-success/20 active:scale-95 transition-all"
                                  : "h-10 bg-success hover:bg-success/90 label-button-sm text-[12px]"
                              )}
                              onClick={() => confirmPickup(node.orderId!, {
                                onSuccess: () => toast.success("Đã xác nhận nhận hàng"),
                                onError: (err: any) => toast.error(err?.response?.data?.message || "Xác nhận nhận hàng thất bại"),
                              })}
                              disabled={isPickupPending}
                            >
                              <Package className={isFirstPending ? "size-6" : "size-4"} />
                              {isPickupPending ? "Đang xác nhận..." : "Xác Nhận Nhận Hàng"}
                            </Button>
                          ) : (
                            <Button
                              className={cn(
                                "w-full rounded-full text-white gap-sm",
                                isFirstPending
                                  ? "h-14 bg-brand-primary hover:bg-brand-accent label-button-md shadow-lg shadow-brand-primary/20 active:scale-95 transition-all"
                                  : "h-10 bg-brand-primary hover:bg-brand-accent label-button-sm text-[12px]"
                              )}
                              onClick={() => completeDelivery(node.orderId!, {
                                onSuccess: () => toast.success("Đã hoàn thành giao hàng"),
                                onError: (err: any) => toast.error(err?.response?.data?.message || "Hoàn thành giao hàng thất bại"),
                              })}
                              disabled={isCompletePending}
                            >
                              <MapPin className={isFirstPending ? "size-6" : "size-4"} />
                              {isCompletePending ? "Đang hoàn tất..." : "Hoàn Tất Giao Hàng"}
                            </Button>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </div>

          {/* Quick Support / Support Button */}
          <Button
            variant="ghost"
            className="w-full h-14 rounded-[24px] border-2 border-dashed border-text-muted/20 text-text-muted hover:border-brand-primary hover:text-brand-primary hover:bg-brand-primary/5 transition-all gap-md label-button-md">
            <Timer className="size-5" /> Cần Hỗ Trợ? Liên Hệ Điều Phối
          </Button>
        </div>
      </div>
    </div>
  );
}
