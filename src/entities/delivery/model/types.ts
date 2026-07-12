export interface RouteNode {
  node: string;
  type: "STORE" | "PICKUP" | "DELIVERY";
  status: string | null;
  orderId: string | null;
  orderCode: string | null;
  customerName: string | null;
  customerPhone: string | null;
  address: string;
  lat: number;
  lng: number;
  storeId: string | null;
  storeName: string | null;
  storeAddress: string | null;
  arrival_datetime: string;
  items: { name: string; quantity: number }[] | null;
  total: number | null;
  travel_time_minutes: number;
  load_after_action: number;
  action_amount: number;
}

export interface ShipperRoute {
  shipperId: string;
  shipperName: string;
  isPersisted: boolean;
  routes: RouteNode[];
}

export interface ShipperRoutesData {
  numShippers: number;
  numOrders: number;
  shippers: ShipperRoute[];
}

export interface ShipperRoutesResponse {
  success: boolean;
  data: ShipperRoutesData;
}
