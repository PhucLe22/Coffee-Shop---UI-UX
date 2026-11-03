/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  addresses, buildOrder, categories, customers, optionGroups, orders, products,
  SHIPPER_POSITION, slugify, staff, stores, vouchers,
} from "./data";

export class MockHttpError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

export interface MockRequest {
  method: string;
  path: string;
  params: Record<string, string>;
  query: Record<string, any>;
  body: any;
  user: any | null;
}

type Result = { data: any; meta?: any; message?: string } | { raw: any };
type Handler = (req: MockRequest) => Result;

// --- helpers ------------------------------------------------------------------

const ok = (data: any, meta?: any, message = "Thành công"): Result => ({ data, meta, message });

function paginate(list: any[], query: Record<string, any>) {
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.max(1, Number(query.limit) || 10);
  const totalPages = Math.max(1, Math.ceil(list.length / limit));
  return ok(list.slice((page - 1) * limit, page * limit), {
    totalItems: list.length,
    currentPage: page,
    pageSize: limit,
    totalPages,
    hasNext: page < totalPages,
  });
}

const norm = (s: string) => slugify(s ?? "").replace(/-/g, " ");
const matches = (value: string, q?: string) => !q || norm(value).includes(norm(q));
const byId = <T extends { id: string }>(list: T[], id: string, what: string) => {
  const item = list.find((x) => x.id === id);
  if (!item) throw new MockHttpError(404, `Không tìm thấy ${what}`);
  return item;
};
const requireUser = (req: MockRequest) => {
  if (!req.user) throw new MockHttpError(401, "Vui lòng đăng nhập");
  return req.user;
};
const now = () => new Date().toISOString();
const newId = (prefix: string) => `${prefix}-${Math.random().toString(16).slice(2, 10)}-mock`;

const distanceKm = (a: { lat: number; lng: number }, b: { lat: number; lng: number }) => {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos((a.lat * Math.PI) / 180) * Math.cos((b.lat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
};

const orderCountBySku = () => {
  const counts = new Map<string, number>();
  for (const o of orders) for (const it of o.orderItems) counts.set(it.sku, (counts.get(it.sku) ?? 0) + it.quantity);
  return counts;
};

const activeProducts = () => products.filter((p) => p.isActive);

function filterProducts(list: any[], query: Record<string, any>) {
  return list
    .filter((p) => !query.categoryId || p.categoryId === query.categoryId)
    .filter((p) => matches(`${p.name} ${p.sku} ${p.description}`, query.search))
    .filter((p) => query.isActive === undefined || String(p.isActive) === String(query.isActive));
}

// --- auth -----------------------------------------------------------------------

export const tokenFor = (id: string) => `mock.${id}`;

function findAccount(identifier: string) {
  const id = identifier?.trim().toLowerCase();
  const s = staff.find((x) => x.email === id || x.phone === id);
  if (s) {
    const store = stores.find((st) => st.id === s.storeId);
    return { id: s.id, name: s.name, email: s.email, phone: s.phone, type: "STAFF", role: s.role, storeName: s.storeName, lat: store?.lat, lng: store?.lng };
  }
  const c = customers.find((x) => x.email === id || x.phone === id);
  if (c) return { id: c.id, name: c.name, email: c.email, phone: c.phone, type: "CUSTOMER", tier: c.tier, points: c.points };
  return null;
}

export function userFromToken(token?: string | null) {
  if (!token?.startsWith("mock.")) return null;
  const id = token.slice(5);
  const s = staff.find((x) => x.id === id);
  if (s) return findAccount(s.email);
  const c = customers.find((x) => x.id === id);
  return c ? findAccount(c.email) : null;
}

const loginResponse = (user: any) =>
  ok({ user, tokens: { accessToken: tokenFor(user.id), refreshToken: `${tokenFor(user.id)}.refresh` } });

// --- orders ---------------------------------------------------------------------

const STATUS_LABELS: Record<string, string> = {
  NEW: "Đã đặt hàng",
  CONFIRMED: "Đã xác nhận",
  PREPARING: "Đang pha chế",
  READY: "Sẵn sàng",
  DELIVERING: "Đang giao hàng",
  PICKED_UP: "Shipper đã lấy hàng",
  DELIVERED: "Đã giao hàng",
  COMPLETED: "Hoàn thành",
  CANCELLED: "Đã hủy",
};

function activitiesFor(order: any) {
  const flow = order.type === "DELIVERY"
    ? ["NEW", "CONFIRMED", "PREPARING", "READY", "DELIVERING", "DELIVERED"]
    : ["NEW", "CONFIRMED", "PREPARING", "READY", "COMPLETED"];
  const start = new Date(order.createdAt).getTime();
  const reached = order.status === "CANCELLED" ? 0 : Math.max(0, flow.indexOf(order.status === "COMPLETED" && order.type === "DELIVERY" ? "DELIVERED" : order.status));
  const steps = flow.map((status, i) => {
    const isPast = i <= reached && order.status !== "CANCELLED" ? true : i === 0;
    const time = new Date(start + [0, 2, 4, 10, 14, 30][i] * 60000).toISOString();
    return { status, label: STATUS_LABELS[status], time: isPast ? time : i === flow.length - 1 ? order.expectedReadyAt : null, isPast, isEstimate: !isPast && i === flow.length - 1 };
  });
  if (order.status === "CANCELLED") {
    return [steps[0], { status: "CANCELLED", label: STATUS_LABELS.CANCELLED, time: order.updatedAt, isPast: true }];
  }
  return steps;
}

function setStatus(order: any, status: string) {
  order.status = status;
  order.updatedAt = now();
  if (order.delivery) {
    if (status === "DELIVERING" || status === "PICKED_UP") order.delivery.status = "PICKED_UP";
    if (status === "DELIVERED" || status === "COMPLETED") order.delivery.status = "DELIVERED";
    if (status === "CANCELLED") order.delivery.status = "CANCELLED";
  }
  return ok(order);
}

const findOrder = (id: string) => {
  const order = orders.find((o) => o.id === id || o.orderCode === id);
  if (!order) throw new MockHttpError(404, "Không tìm thấy đơn hàng");
  return order;
};

function filterOrders(list: any[], query: Record<string, any>) {
  return list
    .filter((o) => !query.status || o.status === query.status)
    .filter((o) => !query.startDate || o.createdAt >= new Date(query.startDate).toISOString())
    .filter((o) => !query.endDate || o.createdAt <= new Date(new Date(query.endDate).getTime() + 86400000).toISOString())
    .filter((o) => !query.minTotal || o.total >= Number(query.minTotal))
    .filter((o) => !query.maxTotal || o.total <= Number(query.maxTotal))
    .filter((o) => !query.search || matches(`${o.orderCode} ${o.customer?.name ?? ""} ${o.customer?.phone ?? ""}`, query.search));
}

function voucherDiscount(code: string | undefined, amount: number, storeId?: string) {
  if (!code) return { voucher: null, discount: 0 };
  const v = vouchers.find((x) => x.code.toUpperCase() === code.toUpperCase());
  if (!v || !v.isActive) throw new MockHttpError(400, "Mã giảm giá không tồn tại hoặc đã hết hạn");
  if (v.expiresAt && v.expiresAt < now()) throw new MockHttpError(400, "Mã giảm giá đã hết hạn");
  if (v.usedCount >= v.maxUsage) throw new MockHttpError(400, "Mã giảm giá đã hết lượt sử dụng");
  if (v.minOrderAmount && amount < v.minOrderAmount) throw new MockHttpError(400, `Đơn tối thiểu ${v.minOrderAmount.toLocaleString("vi-VN")}đ`);
  if (v.storeId && storeId && v.storeId !== storeId) throw new MockHttpError(400, `Mã chỉ áp dụng tại ${v.store?.name}`);
  let discount = v.discountType === "PERCENT" ? Math.round((amount * v.discountValue) / 100) : v.discountValue;
  if (v.maxDiscount) discount = Math.min(discount, v.maxDiscount);
  return { voucher: v, discount: Math.min(discount, amount) };
}

function createOrder(body: any, opts: { customer: any; store: any }) {
  const lines = (body.items ?? []).map((it: any) => ({
    product: byId(products, it.productId, "sản phẩm"),
    quantity: Number(it.quantity) || 1,
    optionIds: (it.options ?? []).map((o: any) => o.optionId),
    note: it.note,
  }));
  if (!lines.length) throw new MockHttpError(400, "Đơn hàng chưa có sản phẩm");
  const draft = buildOrder({ store: opts.store, customer: opts.customer, type: body.type, status: "NEW", createdMinutesAgo: 0, lines });
  const { voucher, discount } = voucherDiscount(body.voucherCode, Number(draft.subtotal), opts.store.id);
  const info = body.deliveryInfo;
  const order = buildOrder({
    store: opts.store,
    customer: opts.customer,
    type: body.type,
    status: "NEW",
    createdMinutesAgo: 0,
    lines,
    discount,
    tableNumber: body.tableNumber ?? null,
    note: body.note ?? null,
    delivery: body.type === "DELIVERY"
      ? { addressLine: info?.addressLine ?? "", lat: SHIPPER_POSITION.lat + 0.004, lng: SHIPPER_POSITION.lng - 0.003, receiverName: info?.receiverName, receiverPhone: info?.receiverPhone }
      : null,
  });
  if (voucher) voucher.usedCount++;
  orders.unshift(order);
  return order;
}

// --- delivery -------------------------------------------------------------------

function shipperRoutes() {
  const active = orders.filter((o) => o.type === "DELIVERY" && ["CONFIRMED", "PREPARING", "READY", "DELIVERING", "PICKED_UP"].includes(o.status));
  const shippers = staff.filter((s) => s.role === "SHIPPER");
  const assigned = new Map<string, any[]>();
  active.forEach((o, i) => {
    const shipperId = o.delivery?.assignedShipper?.id ?? shippers[i % shippers.length].id;
    assigned.set(shipperId, [...(assigned.get(shipperId) ?? []), o]);
  });
  const start = Date.now();
  const routes = [...assigned.entries()].map(([shipperId, list]) => {
    const shipper = staff.find((s) => s.id === shipperId)!;
    const store = stores.find((s) => s.id === list[0].store.id) ?? stores[0];
    let minutes = 0;
    const node = (type: string, o: any | null, lat: number, lng: number, travel: number) => {
      minutes += travel;
      return {
        node: `${type}-${o?.id ?? store.id}`,
        type,
        status: o?.status ?? null,
        orderId: o?.id ?? null,
        orderCode: o?.orderCode ?? null,
        customerName: o?.customer?.name ?? null,
        customerPhone: o?.customer?.phone ?? null,
        address: type === "DELIVERY" ? o.address : store.address,
        lat, lng,
        storeId: store.id,
        storeName: store.name,
        storeAddress: store.address,
        arrival_datetime: new Date(start + minutes * 60000).toISOString(),
        items: o ? o.orderItems.map((it: any) => ({ name: it.name, quantity: it.quantity })) : null,
        total: o ? Number(o.total) : null,
        travel_time_minutes: travel,
        load_after_action: 0,
        action_amount: o ? o.orderItems.length : 0,
      };
    };
    const nodes = [
      node("STORE", null, store.lat, store.lng, 0),
      ...list.map((o) => node("PICKUP", o, store.lat, store.lng, 2)),
      ...list.map((o) => node("DELIVERY", o, o.delivery?.lat ?? store.lat + 0.005, o.delivery?.lng ?? store.lng + 0.005, 8)),
    ];
    return { shipperId, shipperName: shipper.name, isPersisted: true, routes: nodes };
  });
  return { numShippers: routes.length, numOrders: active.length, shippers: routes };
}

function deliverySchedule() {
  const data = shipperRoutes();
  return {
    ...data,
    shippers: data.shippers.map((s) => ({
      ...s,
      routes: s.routes.map((r, i) => ({ ...r, node: i, shipperId: s.shipperId, shipperName: s.shipperName, address: r.address, total: r.total != null ? String(r.total) : undefined })),
    })),
    formattedOrders: orders
      .filter((o) => o.type === "DELIVERY" && !["COMPLETED", "DELIVERED", "CANCELLED"].includes(o.status))
      .map((o) => ({
        id: o.orderCode,
        customer: o.customer?.name ?? "Khách",
        customerPhone: o.customer?.phone ?? "",
        status: o.status,
        address: o.address ?? "",
        items: o.orderItems.map((it: any) => `${it.quantity}x ${it.name}`).join(", "),
        location: { lat: o.delivery?.lat ?? 10.776, lng: o.delivery?.lng ?? 106.702 },
        isFocused: false,
      })),
  };
}

// --- AI chat (keyword based) ----------------------------------------------------

function aiChat(body: any) {
  const last = [...(body.messages ?? [])].reverse().find((m: any) => m.role === "user")?.content ?? "";
  const q = norm(last);
  const tool = (toolName: string, output: any) => [{ type: "tool-result", toolCallId: newId("call"), toolName, input: {}, output, dynamic: false }];

  const codeMatch = last.match(/CC\d{6}/i);
  if (codeMatch) {
    const order = orders.find((o) => o.orderCode === codeMatch[0].toUpperCase());
    if (order) {
      return { text: `Đơn ${order.orderCode} đang ở trạng thái "${STATUS_LABELS[order.status] ?? order.status}".`,
        toolResults: tool("getOrder", { ...order, items: order.orderItems }) };
    }
  }
  if (/gan|gan nhat|gan day/.test(q) && /cua hang|quan|chi nhanh/.test(q)) {
    const store = stores[0];
    return { text: `Cửa hàng gần bạn nhất là ${store.name}.`, toolResults: tool("findClosestStore", { ...store, distance: 0.8 }) };
  }
  if (/cua hang|chi nhanh|dia chi/.test(q)) {
    return { text: `Coffee Collective hiện có ${stores.length} cửa hàng tại TP. Hồ Chí Minh:`, toolResults: tool("findAllStores", stores) };
  }
  if (/khuyen mai|voucher|giam gia|ma giam|uu dai/.test(q)) {
    const active = vouchers.filter((v) => v.isActive);
    return { text: "Đây là các ưu đãi đang áp dụng:", toolResults: tool("checkPromotions", active) };
  }
  const named = products.find((p) => q.includes(norm(p.name)));
  if (named) {
    return { text: `${named.name}: ${named.description}`, toolResults: tool("getProduct", named) };
  }
  if (/goi y|nen uong|recommend|ngon|best|ban chay|dac biet/.test(q)) {
    const counts = orderCountBySku();
    const top = [...activeProducts()].sort((a, b) => (counts.get(b.sku) ?? 0) - (counts.get(a.sku) ?? 0))[0];
    return { text: `Món được yêu thích nhất tuần này là ${top.name}. Bạn thử nhé!`, toolResults: tool("getProduct", top) };
  }
  const found = activeProducts().filter((p) => q.split(" ").some((w: string) => w.length > 2 && norm(p.name).includes(w)));
  if (found.length) {
    return { text: `Mình tìm thấy ${found.length} món phù hợp, nổi bật nhất là ${found[0].name}.`, toolResults: tool("searchProducts", { items: found }) };
  }
  return { text: "Xin chào! Mình là trợ lý của Coffee Collective ☕ Bạn có thể hỏi mình gợi ý đồ uống, cửa hàng gần nhất, khuyến mãi hoặc tra cứu đơn hàng (ví dụ: CC260001)." };
}

// --- routes -----------------------------------------------------------------------

const routes: Array<[string, string, Handler]> = [
  // Auth
  ["POST", "/auth/login", ({ body }) => {
    const user = findAccount(body?.identifier);
    if (!user) throw new MockHttpError(401, "Tài khoản demo không tồn tại. Thử khachhang@demo.vn hoặc admin@demo.vn");
    return loginResponse(user);
  }],
  ["POST", "/auth/register", ({ body }) => {
    const c = { id: newId("cust"), name: body.name, email: body.email, phone: body.phone, tier: "BRONZE", points: 0, type: "CUSTOMER" };
    customers.push(c);
    return ok({ id: c.id, email: c.email, phone: c.phone });
  }],
  ["POST", "/auth/logout", () => ok(null)],
  ["POST", "/auth/refresh", ({ user }) => (user ? loginResponse(user) : (() => { throw new MockHttpError(401, "Hết phiên"); })())],
  ["POST", "/auth/forgot-password", () => ok(null, undefined, "Đã gửi email đặt lại mật khẩu (demo)")],
  ["POST", "/auth/reset-password", () => ok(null, undefined, "Đặt lại mật khẩu thành công (demo)")],
  ["GET", "/auth/me", (req) => ok(requireUser(req))],
  ["GET", "/auth/profile", (req) => {
    const u = requireUser(req);
    const s = staff.find((x) => x.id === u.id);
    const store = s ? stores.find((st) => st.id === s.storeId) : null;
    return ok({ ...u, tier: u.tier ?? null, points: u.points ?? 0, userInfo: { email: u.email, phone: u.phone, name: u.name },
      storeInfo: store ? { id: store.id, name: store.name, address: store.address } : {}, managerInfo: null });
  }],
  ["PUT", "/auth/profile", (req) => {
    const u = requireUser(req);
    const target = customers.find((c) => c.id === u.id) ?? staff.find((s) => s.id === u.id);
    Object.assign(target, req.body);
    return ok(userFromToken(tokenFor(u.id)));
  }],

  // Catalog
  ["GET", "/categories", ({ query }) => paginate(categories, { ...query, limit: query.limit ?? 100 })],
  ["GET", "/products/new", ({ query }) => ok([...activeProducts()].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, Number(query.limit) || 5))],
  ["GET", "/products/hot", ({ query }) => {
    const counts = orderCountBySku();
    return ok([...activeProducts()].sort((a, b) => (counts.get(b.sku) ?? 0) - (counts.get(a.sku) ?? 0)).slice(0, Number(query.limit) || 5));
  }],
  ["GET", "/products/search", ({ query }) => ok(filterProducts(activeProducts(), { search: query.q }).slice(0, Number(query.limit) || 10))],
  ["GET", "/products/id/:id", ({ params }) => ok(byId(products, params.id, "sản phẩm"))],
  ["GET", "/products/:slug", ({ params }) => {
    const p = products.find((x) => x.slug === params.slug || x.id === params.slug);
    if (!p) throw new MockHttpError(404, "Không tìm thấy sản phẩm");
    return ok(p);
  }],
  ["GET", "/products", ({ query }) => paginate(filterProducts(activeProducts(), query), query)],
  ["GET", "/internal/products", ({ query }) => paginate(filterProducts(products, query), query)],
  ["GET", "/internal/admin/products", ({ query }) => paginate(filterProducts(products, query), query)],
  ["GET", "/internal/admin/products/:id", ({ params }) => ok(byId(products, params.id, "sản phẩm"))],
  ["GET", "/internal/products/:id", ({ params }) => ok(byId(products, params.id, "sản phẩm"))],
  ["POST", "/internal/products", ({ body }) => {
    const p = productFromForm(body, null);
    products.unshift(p);
    return ok(p, undefined, "Tạo sản phẩm thành công");
  }],
  ["PUT", "/internal/products/:id", ({ params, body }) => {
    const p = byId(products, params.id, "sản phẩm");
    Object.assign(p, productFromForm(body, p));
    return ok(p, undefined, "Cập nhật sản phẩm thành công");
  }],
  ["PATCH", "/internal/products/:id/toggle-active", ({ params }) => {
    const p = byId(products, params.id, "sản phẩm");
    p.isActive = !p.isActive;
    return ok(p);
  }],
  ["PUT", "/internal/products/:id/option-groups/:groupId", ({ params, body }) => {
    const p = byId(products, params.id, "sản phẩm");
    const g = p.optionGroups.find((x: any) => x.id === params.groupId);
    if (g) {
      g.sortOrder = body.sortOrder ?? g.sortOrder;
      for (const v of body.optionValues ?? []) {
        const o = g.options.find((x: any) => x.id === v.optionId);
        if (o) Object.assign(o, { price: v.price ?? o.price, isActive: v.isActive ?? o.isActive });
      }
    }
    return ok(p);
  }],
  ["DELETE", "/internal/products/:id", ({ params }) => remove(products, params.id)],
  ["DELETE", "/internal/admin/products/:id", ({ params }) => remove(products, params.id)],
  ["GET", "/internal/option-groups", ({ query }) => paginate(optionGroups, { ...query, limit: query.limit ?? 100 })],
  ["GET", "/internal/option-groups/:id", ({ params }) => ok(byId(optionGroups, params.id, "nhóm tùy chọn"))],

  // Orders (customer)
  ["GET", "/orders/code/:code", ({ params }) => ok(findOrder(params.code))],
  ["GET", "/orders/phone/:phone", ({ params, query }) => paginate(orders.filter((o) => o.customer?.phone === params.phone), query)],
  ["GET", "/orders/:id/activities", ({ params }) => ok(activitiesFor(findOrder(params.id)))],
  ["GET", "/orders/:id", ({ params }) => ok(findOrder(params.id))],
  ["GET", "/orders", (req) => {
    const u = requireUser(req);
    return paginate(filterOrders(orders.filter((o) => o.customer?.id === u.id), req.query), req.query);
  }],
  ["POST", "/orders", (req) => {
    const customer = req.user?.type === "CUSTOMER" ? customers.find((c) => c.id === req.user.id) : null;
    const store = stores.find((s) => s.id === req.body.storeId) ?? stores[0];
    return ok(createOrder(req.body, { customer, store }), undefined, "Đặt hàng thành công");
  }],

  // Orders (internal)
  ["GET", "/internal/orders/:id", ({ params }) => ok(findOrder(params.id))],
  ["GET", "/internal/orders", (req) => {
    const u = req.user;
    const s = u ? staff.find((x) => x.id === u.id) : null;
    const scoped = s && s.role !== "ADMIN" ? orders.filter((o) => o.store.id === s.storeId) : orders;
    return paginate(filterOrders(scoped, req.query), req.query);
  }],
  ["POST", "/internal/orders", (req) => {
    const s = req.user ? staff.find((x) => x.id === req.user.id) : null;
    const store = stores.find((st) => st.id === s?.storeId) ?? stores[0];
    const customer = customers.find((c) => c.id === req.body.customerId || (req.body.phone && c.phone === req.body.phone)) ?? null;
    return ok(createOrder(req.body, { customer, store }), undefined, "Tạo đơn thành công");
  }],
  ["PATCH", "/internal/orders/:id/status", ({ params, body }) => setStatus(findOrder(params.id), body.status)],
  ["PATCH", "/internal/orders/:id/pickup", ({ params }) => setStatus(findOrder(params.id), "DELIVERING")],
  ["PATCH", "/internal/orders/:id/complete", ({ params }) => setStatus(findOrder(params.id), "COMPLETED")],
  ["PATCH", "/internal/orders/:id/delivery/complete", ({ params }) => setStatus(findOrder(params.id), "DELIVERED")],
  ["PATCH", "/internal/orders/:id/delivery/return", ({ params }) => setStatus(findOrder(params.id), "CANCELLED")],
  ["DELETE", "/internal/orders/:id", ({ params }) => setStatus(findOrder(params.id), "CANCELLED")],

  // Stores
  ["GET", "/stores", ({ query }) => {
    let list = stores.filter((s) => s.isActive && !s.isDeleted && matches(`${s.name} ${s.address}`, query.search));
    if (query.lat && query.lng) {
      const here = { lat: Number(query.lat), lng: Number(query.lng) };
      list = list.map((s) => ({ ...s, distance: distanceKm(here, s) })).sort((a, b) => a.distance - b.distance);
    }
    return paginate(list, { ...query, limit: query.limit ?? 50 });
  }],
  ["GET", "/internal/admin/stores", ({ query }) => paginate(stores.filter((s) => !s.isDeleted && matches(`${s.name} ${s.code}`, query.search)), query)],
  ["POST", "/internal/admin/stores", ({ body }) => {
    const s = { id: newId("stor"), isActive: true, isDeleted: false, lat: null, lng: null, ...body };
    stores.push(s);
    return ok(s, undefined, "Tạo cửa hàng thành công");
  }],
  ["PUT", "/internal/admin/stores/:id", ({ params, body }) => ok(Object.assign(byId(stores, params.id, "cửa hàng"), body))],
  ["DELETE", "/internal/admin/stores/:id", ({ params }) => ok(Object.assign(byId(stores, params.id, "cửa hàng"), { isDeleted: true }))],

  // Staff & customers
  ["GET", "/internal/staff", ({ query }) => paginate(staff.filter((s) => !query.role || s.role === query.role), query)],
  ["POST", "/internal/auth/register/staff", ({ body }) => {
    const store = byId(stores, body.storeId, "cửa hàng");
    const s = { id: newId("staf"), name: body.name, email: body.email, phone: body.phone, role: body.role, storeId: store.id, storeName: store.name, isActive: true, createdAt: now(), updatedAt: now() };
    staff.push(s);
    return ok({ user: { ...s }, staff: s }, undefined, "Tạo nhân viên thành công");
  }],
  ["PUT", "/internal/staff/:id", ({ params, body }) => {
    const s = byId(staff, params.id, "nhân viên");
    Object.assign(s, body);
    if (body.storeId) s.storeName = stores.find((st) => st.id === body.storeId)?.name;
    return ok(s);
  }],
  ["DELETE", "/internal/staff/:id/hard", ({ params }) => remove(staff, params.id)],
  ["DELETE", "/internal/staff/:id", ({ params }) => ok(Object.assign(byId(staff, params.id, "nhân viên"), { isActive: false }))],
  ["GET", "/internal/customers/search", ({ query }) => ok(customers.filter((c) => matches(`${c.name} ${c.phone}`, query.query)).map(({ id, name, phone }) => ({ id, name, phone })))],
  ["POST", "/internal/auth/register/guest", ({ body }) => {
    const c = { id: newId("cust"), name: body.name, phone: body.phone, email: null, tier: "BRONZE", points: 0, type: "CUSTOMER" };
    customers.push(c);
    return ok(c);
  }],

  // Vouchers & promotions
  ["GET", "/internal/vouchers", ({ query }) => paginate(vouchers
    .filter((v) => !query.storeId || v.storeId === query.storeId)
    .filter((v) => query.isActive === undefined || String(v.isActive) === String(query.isActive))
    .filter((v) => !query.discountType || v.discountType === query.discountType)
    .filter((v) => matches(v.code, query.search)), query)],
  ["POST", "/internal/vouchers", ({ body }) => {
    const store = body.storeId ? stores.find((s) => s.id === body.storeId) : null;
    const v = { id: newId("vouc"), scope: "PUBLIC", usedCount: 0, isActive: true, maxDiscount: null, minOrderAmount: null, expiresAt: null, maxUsage: 100,
      ...body, storeId: store?.id ?? null, store: store ? { id: store.id, name: store.name } : null };
    vouchers.unshift(v);
    return ok(v, undefined, "Tạo voucher thành công");
  }],
  ["PATCH", "/internal/vouchers/:id", ({ params, body }) => ok(Object.assign(byId(vouchers, params.id, "voucher"), body))],
  ["DELETE", "/internal/vouchers/:id", ({ params }) => remove(vouchers, params.id)],
  ["GET", "/promotions/suggest", ({ query }) => {
    const amount = Number(query.orderAmount) || 0;
    const list = vouchers
      .filter((v) => v.isActive && v.usedCount < v.maxUsage && (!v.expiresAt || v.expiresAt > now()))
      .filter((v) => !v.storeId || !query.storeId || v.storeId === query.storeId)
      .map((v) => {
        let est = v.discountType === "PERCENT" ? Math.round((amount * v.discountValue) / 100) : v.discountValue;
        if (v.maxDiscount) est = Math.min(est, v.maxDiscount);
        const eligible = !v.minOrderAmount || amount >= v.minOrderAmount;
        return { ...v, discountValue: String(v.discountValue), minOrderAmount: v.minOrderAmount != null ? String(v.minOrderAmount) : null,
          maxDiscount: v.maxDiscount != null ? String(v.maxDiscount) : null, customerVouchers: [], redemptions: [], estimatedDiscount: eligible ? est : 0 };
      })
      .sort((a, b) => b.estimatedDiscount - a.estimatedDiscount);
    return ok(list);
  }],
  ["GET", "/promotions", ({ query }) => paginate(vouchers
    .filter((v) => v.isActive && (!v.expiresAt || v.expiresAt > now()))
    .filter((v) => !query.storeId || !v.storeId || v.storeId === query.storeId)
    .filter((v) => !query.discountType || v.discountType === query.discountType), query)],
  ["POST", "/promotions/validate", ({ body }) => {
    const { voucher, discount } = voucherDiscount(body.code, Number(body.orderAmount) || 0, body.storeId);
    return ok({ id: voucher!.id, code: voucher!.code, discountType: voucher!.discountType, discountValue: voucher!.discountValue,
      discountAmount: discount, maxDiscount: voucher!.maxDiscount, minOrderAmount: voucher!.minOrderAmount }, undefined, "Áp dụng mã thành công");
  }],

  // Addresses
  ["GET", "/addresses/autocomplete", ({ query }) => ok(addresses.concat(stores.map((s) => ({ addressLine: s.address, lat: s.lat, lng: s.lng })))
    .filter((a) => matches(a.addressLine, query.text))
    .slice(0, Number(query.limit) || 5)
    .map((a) => ({ formatted: a.addressLine, address_line1: a.addressLine.split(",")[0], address_line2: a.addressLine.split(",").slice(1).join(",").trim(),
      street: null, housenumber: null, city: "TP. Hồ Chí Minh", state: null, postcode: null, country: "Việt Nam", lat: a.lat, lon: a.lng,
      result_type: "building", rank: { confidence: 0.9, confidence_city_level: 1 } })))],
  ["GET", "/addresses", (req) => {
    const u = requireUser(req);
    return ok(addresses.filter((a) => a.customerId === u.id));
  }],
  ["POST", "/addresses", (req) => {
    const u = requireUser(req);
    if (req.body.isDefault) addresses.forEach((a) => { if (a.customerId === u.id) a.isDefault = false; });
    const a = { id: newId("addr"), customerId: u.id, lat: 10.776, lng: 106.702, isDefault: false, createdAt: now(), updatedAt: now(), ...req.body };
    addresses.push(a);
    return ok(a);
  }],
  ["PUT", "/addresses/:id", ({ params, body }) => {
    const a = byId(addresses, params.id, "địa chỉ");
    if (body.isDefault) addresses.forEach((x) => { if (x.customerId === a.customerId) x.isDefault = false; });
    return ok(Object.assign(a, body, { updatedAt: now() }));
  }],
  ["DELETE", "/addresses/:id", ({ params }) => remove(addresses, params.id)],

  // Delivery & kitchen
  ["GET", "/internal/kitchen/delivery-schedule", () => ok(deliverySchedule())],
  ["GET", "/internal/admin/shipper-routes", ({ query }) => {
    const data = shipperRoutes();
    if (query.shipperId) data.shippers = data.shippers.filter((s) => s.shipperId === query.shipperId);
    return { raw: { success: true, data } };
  }],
  ["POST", "/internal/admin/shipper-routes", () => ({ raw: { success: true, data: shipperRoutes() } })],
  ["POST", "/internal/kitchen/solve-network", () => ok(null, undefined, "Đã tối ưu lộ trình (demo)")],

  // AI
  ["POST", "/ai/chat", ({ body }) => ok(aiChat(body))],
];

function remove(list: any[], id: string) {
  const i = list.findIndex((x) => x.id === id);
  if (i < 0) throw new MockHttpError(404, "Không tìm thấy");
  list.splice(i, 1);
  return ok(null, undefined, "Đã xóa");
}

function productFromForm(body: any, existing: any | null) {
  const parse = (v: any) => (typeof v === "string" ? JSON.parse(v) : v);
  const categoryId = body.category ? parse(body.category).id : body.categoryId ?? existing?.categoryId;
  const category = categories.find((c) => c.id === categoryId) ?? categories[0];
  const groupsInput = body.optionGroups ? parse(body.optionGroups) : null;
  const image = body.image instanceof Blob ? URL.createObjectURL(body.image) : undefined;
  const num = (v: any, fallback: any) => (v === undefined || v === "" ? fallback : Number(v));
  return {
    id: existing?.id ?? newId("prod"),
    sku: body.sku ?? existing?.sku,
    name: body.name ?? existing?.name,
    slug: slugify(body.name ?? existing?.name ?? ""),
    description: body.description ?? existing?.description ?? "",
    type: body.type ?? existing?.type ?? "SIMPLE",
    basePrice: num(body.basePrice, existing?.basePrice ?? 0),
    costPrice: num(body.costPrice, existing?.costPrice ?? 0),
    taxRate: num(body.taxRate, existing?.taxRate ?? 0),
    thumbnail: image ?? existing?.thumbnail ?? null,
    images: image ? [image] : existing?.images ?? [],
    categoryId: category.id,
    category: { id: category.id, name: category.name, slug: category.slug },
    sortOrder: num(body.sortOrder, existing?.sortOrder ?? 1),
    preparationTime: existing?.preparationTime ?? 5,
    isActive: existing?.isActive ?? true,
    createdAt: existing?.createdAt ?? now(),
    updatedAt: now(),
    optionGroups: groupsInput
      ? groupsInput.map((gi: any) => {
          const g = optionGroups.find((x) => x.id === gi.optionGroupId)!;
          return { id: g.id, name: g.name, isRequired: g.isRequired, isMultiple: g.isMultiple, sortOrder: gi.sortOrder,
            options: g.options.map((o) => ({ ...o, price: gi.optionValues?.find((v: any) => v.optionId === o.id)?.price ?? o.basePrice })) };
        })
      : existing?.optionGroups ?? [],
  };
}

// --- dispatcher -------------------------------------------------------------------

const compiled = routes.map(([method, pattern, handler]) => {
  const keys: string[] = [];
  const regex = new RegExp(`^${pattern.replace(/:(\w+)/g, (_, k) => { keys.push(k); return "([^/]+)"; })}/?$`);
  return { method, regex, keys, handler };
});

export function handle(req: Omit<MockRequest, "params">): { status: number; body: any } {
  for (const route of compiled) {
    if (route.method !== req.method) continue;
    const m = req.path.match(route.regex);
    if (!m) continue;
    const params = Object.fromEntries(route.keys.map((k, i) => [k, decodeURIComponent(m[i + 1])]));
    const result = route.handler({ ...req, params });
    if ("raw" in result) return { status: 200, body: result.raw };
    return { status: 200, body: { success: true, message: result.message ?? "Thành công", data: result.data, ...(result.meta ? { meta: result.meta } : {}) } };
  }
  throw new MockHttpError(404, `[mock] Chưa hỗ trợ ${req.method} ${req.path}`);
}
