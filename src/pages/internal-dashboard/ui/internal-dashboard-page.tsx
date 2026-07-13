"use client";

import { useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  ChevronRight,
  Truck,
  Network,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";
import { useShipperRoutes } from "@/entities/delivery/api/use-shipper-routes";
import { useSolveNetwork } from "@/entities/delivery/api/use-solve-network";
import { ShipperRouteMap } from "@/widgets/shipper-route-map";

export default function DashboardPage() {
  const [selectedShipperId, setSelectedShipperId] = useState<string>("ALL");
  const { data: allData } = useShipperRoutes();
  const { data: filteredData } = useShipperRoutes(
    selectedShipperId === "ALL" ? undefined : selectedShipperId,
  );
  const { mutate: solveNetwork, isPending: isSolving } = useSolveNetwork();

  const allShippers = allData?.data?.shippers || [];
  const shippers = filteredData?.data?.shippers || [];
  const routeData = filteredData?.data;

  return (
    <div className="flex flex-col p-md md:p-lg gap-md md:gap-lg animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-md">
        <Button
          onClick={() => solveNetwork(2000)}
          disabled={isSolving}
          className="h-12 gap-md whitespace-nowrap bg-brand-primary text-inverse-text hover:bg-brand-accent">
          <Network className="size-5" />
          {isSolving ? "Đang kích hoạt..." : "Kích hoạt solver"}
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-sm md:gap-md">
        <StatCard
          title="Doanh Thu"
          value="$154K"
          trend="+12.5%"
          trendType="up"
        />
        <StatCard
          title="Chi Nhánh"
          value="14"
          trend="Stable"
          trendType="neutral"
        />
        <StatCard title="Hóa Đơn" value="28" trend="-5.2%" trendType="down" />
        <StatCard
          title="Khách Hàng"
          value="1.4K"
          trend="+8.4%"
          trendType="up"
        />
      </div>

      {/* Middle Row */}
      <div className="grid grid-cols-1 gap-md md:gap-lg">
        {/* Shipper Routes Map */}
        <Card className="bg-white border-0 shadow-sm rounded-md overflow-hidden flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between p-md md:p-lg pb-0">
            <div className="flex flex-col gap-xs">
              <CardTitle className="text-[10px] md:text-h5-bold text-text-primary uppercase tracking-wider opacity-60">
                Tuyến Giao Hàng
              </CardTitle>
              <h2 className="text-body-md-bold md:text-h3-bold text-text-primary">
                Bản Đồ Shipper
              </h2>
            </div>
            <div className="flex items-center gap-sm">
              <div className="relative">
                <select
                  value={selectedShipperId}
                  onChange={(e) => setSelectedShipperId(e.target.value)}
                  className="h-9 rounded-md border border-border-primary-50 bg-white px-md text-[12px] text-text-primary font-semibold outline-none focus:border-brand-primary appearance-none cursor-pointer pr-xl">
                  <option value="ALL">Tất Cả Shipper</option>
                  {allShippers.map((s) => (
                    <option key={s.shipperId} value={s.shipperId}>
                      {s.shipperName}
                    </option>
                  ))}
                </select>
                <ChevronRight className="size-3 text-text-muted absolute right-2 top-1/2 -translate-y-1/2 rotate-90 pointer-events-none" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-md md:p-lg flex-1 min-h-0">
            <div className="h-[320px] md:h-[400px] w-full rounded-md overflow-hidden bg-surface-muted/30">
              {shippers.length > 0 ? (
                <ShipperRouteMap shippers={shippers} />
              ) : (
                <div className="size-full flex flex-col items-center justify-center gap-md text-text-muted">
                  <Truck className="size-10" />
                  <p className="text-body-sm-reg">
                    Không có dữ liệu tuyến đường
                  </p>
                </div>
              )}
            </div>
            {routeData && (
              <div className="flex items-center gap-lg mt-md text-[11px] text-text-secondary font-semibold">
                <span>
                  {routeData.numShippers} shipper
                  {routeData.numShippers !== 1 ? "s" : ""}
                </span>
                <span className="size-1 rounded-full bg-text-muted" />
                <span>
                  {routeData.numOrders} order
                  {routeData.numOrders !== 1 ? "s" : ""}
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  trend,
  trendType,
}: {
  title: string;
  value: string;
  trend: string;
  trendType: "up" | "down" | "neutral";
}) {
  return (
    <Card className="bg-white border-0 shadow-sm rounded-md hover:shadow-md transition-shadow">
      <CardContent className="p-md flex flex-col gap-xs">
        <p className="text-[10px] md:text-body-sm-semibold text-text-muted uppercase tracking-wider">
          {title}
        </p>
        <h3 className="text-h3-bold md:text-h2-bold text-text-primary">
          {value}
        </h3>
        <div className="flex items-center gap-xs">
          {trendType === "up" && (
            <TrendingUp className="size-3 md:size-4 text-success" />
          )}
          {trendType === "down" && (
            <TrendingDown className="size-3 md:size-4 text-error" />
          )}
          {trendType === "neutral" && (
            <Minus className="size-3 md:size-4 text-text-muted" />
          )}
          <span
            className={cn(
              "text-[10px] md:text-[12px] font-bold",
              trendType === "up"
                ? "text-success"
                : trendType === "down"
                  ? "text-error"
                  : "text-text-muted",
            )}>
            {trend}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
