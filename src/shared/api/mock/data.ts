/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * In-memory demo dataset used when NEXT_PUBLIC_USE_MOCK=true.
 * Generated deterministically relative to "now" so the demo always looks fresh.
 * Mutations (new orders, edits) live until the page is fully reloaded.
 */

// --- deterministic helpers --------------------------------------------------

let seed = 20261103;
const rand = () => {
  seed = (seed * 1664525 + 1013904223) % 4294967296;
  return seed / 4294967296;
};
const pick = <T,>(arr: T[]): T => arr[Math.floor(rand() * arr.length)];
const uuid = (prefix: string, n: number) =>
  `${prefix.padEnd(8, "0").slice(0, 8)}-0000-4000-8000-${String(n).padStart(12, "0")}`;

export const slugify = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/gi, "d")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const NOW = Date.now();
const minutesAgo = (m: number) => new Date(NOW - m * 60000).toISOString();
const CREATED = minutesAgo(60 * 24 * 60);

const img = (id: string) => `https://images.unsplash.com/photo-${id}?w=800&h=800&fit=crop&q=80`;
const IMAGES = {
  icedMilkCoffee: img("1461023058943-07fcbe16d735"),
  latteDuo: img("1495474472287-4d71bcdd2085"),
  espressoBar: img("1497935586351-b67a49e012bf"),
  cookies: img("1499636136210-6f4ee915583e"),
  cappuccino: img("1509042239860-f550ce710b93"),
  icedLatte: img("1517701604599-bb29b565090c"),
  milkTeaJars: img("1525803377221-4f6ccdaa5133"),
  lattePour: img("1541167760496-1628856ab772"),
  croissant: img("1555507036-ab1f4038808a"),
  icedTea: img("1556679343-c7306c1976bc"),
  bubbleTea: img("1558857563-b371033873b8"),
  latteArt: img("1572442388796-11668a67e53d"),
  chocolateCake: img("1578985545062-69928b1d9587"),
};

// --- categories & option groups ----------------------------------------------

const CATEGORY_DEFS = [
  ["ca-phe", "Cà Phê Việt"],
  ["espresso", "Espresso"],
  ["tra", "Trà & Trà Sữa"],
  ["da-xay", "Đá Xay"],
  ["banh", "Bánh Ngọt"],
  ["combo", "Combo"],
] as const;

export const categories = CATEGORY_DEFS.map(([slug, name], i) => ({
  id: uuid("cate", i + 1),
  slug,
  name,
  sortOrder: i + 1,
  isActive: true,
  createdAt: CREATED,
  updatedAt: CREATED,
}));
const categoryBySlug = (slug: string) => categories.find((c) => c.slug === slug)!;

const optionGroupDefs: Array<[string, boolean, boolean, Array<[string, number]>]> = [
  ["Kích cỡ", true, false, [["Nhỏ (S)", 0], ["Vừa (M)", 6000], ["Lớn (L)", 10000]]],
  ["Mức đường", true, false, [["100% đường", 0], ["70% đường", 0], ["50% đường", 0], ["Không đường", 0]]],
  ["Mức đá", true, false, [["Đá bình thường", 0], ["Ít đá", 0], ["Không đá", 0]]],
  ["Topping", false, true, [["Trân châu đen", 8000], ["Thạch cà phê", 8000], ["Kem muối", 10000], ["Thêm shot espresso", 12000]]],
];

export const optionGroups = optionGroupDefs.map(([name, isRequired, isMultiple, opts], gi) => ({
  id: uuid("optg", gi + 1),
  name,
  isRequired,
  isMultiple,
  sortOrder: gi + 1,
  isActive: true,
  createdAt: CREATED,
  updatedAt: CREATED,
  options: opts.map(([optName, basePrice], oi) => ({
    id: uuid(`opt${gi}`, oi + 1),
    name: optName,
    basePrice,
    sortOrder: oi + 1,
    isActive: true,
  })),
}));

// --- products ------------------------------------------------------------------

type ProductDef = {
  sku: string; name: string; cat: string; price: number; cost: number;
  image: string; prep: number; desc: string; type?: string; groups?: number[];
};

const DRINK = [0, 1, 2, 3];
const HOT_ONLY = [0, 1];
const PRODUCT_DEFS: ProductDef[] = [
  { sku: "CF-PHIN-DEN", name: "Cà Phê Phin Đen", cat: "ca-phe", price: 29000, cost: 9000, image: IMAGES.espressoBar, prep: 4, groups: DRINK,
    desc: "Robusta Đắk Lắk rang đậm, pha phin truyền thống. Đắng sâu, hậu vị sô-cô-la đen." },
  { sku: "CF-PHIN-SUA", name: "Cà Phê Sữa Đá", cat: "ca-phe", price: 35000, cost: 11000, image: IMAGES.icedMilkCoffee, prep: 4, groups: DRINK,
    desc: "Phin Robusta hòa cùng sữa đặc, rót trên đá viên. Hương vị Sài Gòn mỗi sáng." },
  { sku: "CF-BAC-XIU", name: "Bạc Xỉu", cat: "ca-phe", price: 39000, cost: 12000, image: IMAGES.icedLatte, prep: 4, groups: DRINK,
    desc: "Nhiều sữa, ít cà phê — ngọt dịu, béo mịn, dành cho người mới làm quen cà phê." },
  { sku: "CF-MUOI", name: "Cà Phê Muối", cat: "ca-phe", price: 45000, cost: 14000, image: IMAGES.icedMilkCoffee, prep: 5, groups: DRINK,
    desc: "Lớp kem muối Huế mằn mặn phủ trên cà phê phin đậm đà. Signature của nhà." },
  { sku: "CF-TRUNG", name: "Cà Phê Trứng", cat: "ca-phe", price: 49000, cost: 15000, image: IMAGES.latteArt, prep: 6, groups: HOT_ONLY,
    desc: "Kem trứng đánh bông kiểu Hà Nội, béo như custard, trên nền espresso nóng." },
  { sku: "CF-COLD-BREW", name: "Cold Brew Cam Sả", cat: "ca-phe", price: 55000, cost: 16000, image: IMAGES.icedTea, prep: 3, groups: DRINK,
    desc: "Ủ lạnh 18 giờ từ Arabica Cầu Đất, thêm cam vàng và sả tươi. Thanh, sáng, ít đắng." },
  { sku: "ES-ESPRESSO", name: "Espresso", cat: "espresso", price: 39000, cost: 10000, image: IMAGES.espressoBar, prep: 3, groups: [1],
    desc: "Shot đôi từ blend Arabica Đà Lạt & Ethiopia. Crema dày, hương caramel và quả mọng." },
  { sku: "ES-AMERICANO", name: "Americano", cat: "espresso", price: 45000, cost: 11000, image: IMAGES.espressoBar, prep: 3, groups: DRINK,
    desc: "Espresso đôi kéo dài với nước nóng hoặc đá. Nhẹ nhàng, giữ trọn hương rang." },
  { sku: "ES-CAPPUCCINO", name: "Cappuccino", cat: "espresso", price: 55000, cost: 15000, image: IMAGES.cappuccino, prep: 5, groups: HOT_ONLY,
    desc: "Espresso, sữa nóng và lớp foam dày tỉ lệ 1:1:1, rắc bột cacao." },
  { sku: "ES-LATTE", name: "Caffè Latte", cat: "espresso", price: 55000, cost: 15000, image: IMAGES.lattePour, prep: 5, groups: DRINK,
    desc: "Sữa tươi đánh mịn, vẽ latte art trên espresso đôi. Êm, cân bằng." },
  { sku: "ES-CARAMEL-MAC", name: "Caramel Macchiato", cat: "espresso", price: 62000, cost: 18000, image: IMAGES.latteDuo, prep: 5, groups: DRINK,
    desc: "Vanilla, sữa tươi, espresso rót tầng và sốt caramel nhà làm." },
  { sku: "ES-FLAT-WHITE", name: "Flat White", cat: "espresso", price: 59000, cost: 16000, image: IMAGES.latteArt, prep: 5, groups: HOT_ONLY,
    desc: "Ristretto đôi với microfoam mỏng — đậm vị cà phê hơn latte." },
  { sku: "TEA-DAO-CAM-SA", name: "Trà Đào Cam Sả", cat: "tra", price: 49000, cost: 13000, image: IMAGES.icedTea, prep: 4, groups: DRINK,
    desc: "Trà đen ủ lạnh, đào miếng giòn, cam vàng và sả đập dập. Best-seller mùa hè." },
  { sku: "TEA-VAI-HOA-HONG", name: "Trà Vải Hoa Hồng", cat: "tra", price: 52000, cost: 14000, image: IMAGES.icedTea, prep: 4, groups: DRINK,
    desc: "Trà Ô Long, vải thiều Lục Ngạn và siro hoa hồng. Thơm nhẹ, thanh mát." },
  { sku: "TEA-SUA-TRAN-CHAU", name: "Trà Sữa Trân Châu Đường Đen", cat: "tra", price: 55000, cost: 15000, image: IMAGES.bubbleTea, prep: 5, groups: DRINK,
    desc: "Sữa tươi, trà Assam và trân châu đường đen nấu mỗi 2 giờ." },
  { sku: "TEA-SUA-OOLONG", name: "Trà Sữa Ô Long Nướng", cat: "tra", price: 52000, cost: 14000, image: IMAGES.milkTeaJars, prep: 5, groups: DRINK,
    desc: "Ô Long rang lửa than, hương khói nhẹ, béo vừa phải." },
  { sku: "TEA-MATCHA-LATTE", name: "Matcha Latte", cat: "tra", price: 59000, cost: 18000, image: IMAGES.icedLatte, prep: 5, groups: DRINK,
    desc: "Matcha Uji ceremonial grade đánh tay, sữa tươi thanh trùng." },
  { sku: "FR-COOKIE", name: "Cookies & Cream Đá Xay", cat: "da-xay", price: 65000, cost: 19000, image: IMAGES.icedLatte, prep: 6, groups: [0, 1, 3],
    desc: "Bánh Oreo, kem sữa và đá xay mịn, phủ whipping cream." },
  { sku: "FR-CARAMEL", name: "Caramel Frappé", cat: "da-xay", price: 65000, cost: 19000, image: IMAGES.icedMilkCoffee, prep: 6, groups: [0, 1, 3],
    desc: "Espresso, sốt caramel và đá xay — mát lạnh, ngọt vừa." },
  { sku: "BK-CROISSANT", name: "Croissant Bơ Pháp", cat: "banh", price: 35000, cost: 12000, image: IMAGES.croissant, prep: 2,
    desc: "Bơ Isigny AOP, 27 lớp ngàn lớp, nướng mới mỗi sáng lúc 6h." },
  { sku: "BK-CHOCO-CAKE", name: "Bánh Sô-cô-la Tan Chảy", cat: "banh", price: 49000, cost: 17000, image: IMAGES.chocolateCake, prep: 3,
    desc: "Sô-cô-la đen 70% Bến Tre, nhân tan chảy. Hợp nhất với Americano." },
  { sku: "BK-COOKIE", name: "Cookie Sô-cô-la Chip", cat: "banh", price: 25000, cost: 8000, image: IMAGES.cookies, prep: 1,
    desc: "Giòn rìa, dẻo tâm, rắc muối biển. Nướng theo mẻ nhỏ." },
  { sku: "CB-SANG", name: "Combo Bữa Sáng", cat: "combo", type: "COMBO", price: 59000, cost: 21000, image: IMAGES.croissant, prep: 4,
    desc: "Cà Phê Sữa Đá + Croissant Bơ Pháp. Tiết kiệm 11.000đ, phục vụ đến 10h." },
  { sku: "CB-CHIEU", name: "Combo Trà Chiều", cat: "combo", type: "COMBO", price: 89000, cost: 30000, image: IMAGES.chocolateCake, prep: 5,
    desc: "Trà Đào Cam Sả + Bánh Sô-cô-la Tan Chảy. Áp dụng 14h – 17h." },
];

export const products: any[] = PRODUCT_DEFS.map((p, i) => {
  const category = categoryBySlug(p.cat);
  return {
    id: uuid("prod", i + 1),
    sku: p.sku,
    name: p.name,
    slug: slugify(p.name),
    description: p.desc,
    type: p.type ?? "SIMPLE",
    basePrice: p.price,
    costPrice: p.cost,
    taxRate: 8,
    thumbnail: p.image,
    images: [p.image],
    categoryId: category.id,
    category: { id: category.id, name: category.name, slug: category.slug },
    sortOrder: i + 1,
    preparationTime: p.prep,
    isActive: true,
    createdAt: minutesAgo(60 * 24 * (40 - i)),
    updatedAt: CREATED,
    optionGroups: (p.groups ?? []).map((gi, sort) => {
      const g = optionGroups[gi];
      return {
        id: g.id,
        name: g.name,
        isRequired: g.isRequired,
        isMultiple: g.isMultiple,
        sortOrder: sort + 1,
        options: g.options.map((o) => ({ ...o, price: o.basePrice })),
      };
    }),
  };
});

// --- stores ----------------------------------------------------------------------

export const stores: any[] = [
  { code: "CC-Q1", name: "Coffee Collective Nguyễn Huệ", address: "42 Nguyễn Huệ, Bến Nghé, Quận 1, TP. Hồ Chí Minh", hotline: "02838221001", lat: 10.7745, lng: 106.7038 },
  { code: "CC-Q3", name: "Coffee Collective Võ Văn Tần", address: "118 Võ Văn Tần, Phường 6, Quận 3, TP. Hồ Chí Minh", hotline: "02838221002", lat: 10.7752, lng: 106.689 },
  { code: "CC-BT", name: "Coffee Collective Thảo Điền", address: "21 Quốc Hương, Thảo Điền, TP. Thủ Đức, TP. Hồ Chí Minh", hotline: "02838221003", lat: 10.804, lng: 106.733 },
  { code: "CC-PN", name: "Coffee Collective Phan Xích Long", address: "203 Phan Xích Long, Phường 2, Phú Nhuận, TP. Hồ Chí Minh", hotline: "02838221004", lat: 10.799, lng: 106.688 },
].map((s, i) => ({ id: uuid("stor", i + 1), ...s, isActive: true, isDeleted: false }));

// --- people ------------------------------------------------------------------------

// Demo logins (any password, 6+ chars): khachhang@demo.vn, admin@demo.vn, cashier@demo.vn, kitchen@demo.vn, shipper@demo.vn
export const customers: any[] = [
  ["Phúc Lê", "khachhang@demo.vn", "0901234567", "GOLD", 1250],
  ["Nguyễn Thùy Dung", "dung.nguyen@gmail.com", "0912345678", "SILVER", 640],
  ["Trần Quốc Bảo", "bao.tran@gmail.com", "0938765432", "PLATINUM", 3820],
  ["Lê Hoài An", "hoaian@gmail.com", "0987654321", "BRONZE", 120],
  ["Phạm Minh Khoa", "khoa.pham@gmail.com", "0977112233", "SILVER", 410],
  ["Võ Ngọc Trâm", "tram.vo@gmail.com", "0909998877", "GOLD", 1980],
].map(([name, email, phone, tier, points], i) => ({
  id: uuid("cust", i + 1), name, email, phone, tier, points, type: "CUSTOMER",
}));

const STAFF_DEFS: Array<[string, string, string, number]> = [
  ["Admin Demo", "admin@demo.vn", "ADMIN", 0],
  ["Nguyễn Minh Anh", "manager@demo.vn", "MANAGER", 0],
  ["Trần Gia Huy", "cashier@demo.vn", "CASHIER", 0],
  ["Lê Thảo Vy", "kitchen@demo.vn", "KITCHEN", 0],
  ["Phạm Đức Long", "shipper@demo.vn", "SHIPPER", 0],
  ["Hoàng Ngọc Hân", "cashier.q3@demo.vn", "CASHIER", 1],
  ["Vũ Quang Khải", "kitchen.q3@demo.vn", "KITCHEN", 1],
  ["Đặng Thu Trang", "shipper.q3@demo.vn", "SHIPPER", 1],
  ["Bùi Tuấn Kiệt", "cashier.td@demo.vn", "CASHIER", 2],
  ["Đỗ Khánh Linh", "kitchen.td@demo.vn", "KITCHEN", 2],
  ["Ngô Bảo Nam", "cashier.pn@demo.vn", "CASHIER", 3],
  ["Lý Hoàng Phúc", "shipper.pn@demo.vn", "SHIPPER", 3],
];

export const staff: any[] = STAFF_DEFS.map(([name, email, role, si], i) => ({
  id: uuid("staf", i + 1),
  name,
  email,
  phone: `0966${String(100001 + i).slice(-6)}`,
  role,
  storeId: stores[si].id,
  storeName: stores[si].name,
  isActive: true,
  createdAt: minutesAgo(60 * 24 * (90 - i)),
  updatedAt: CREATED,
}));

export const addresses: any[] = [
  { label: "Nhà", addressLine: "15 Lê Thánh Tôn, Bến Nghé, Quận 1, TP. Hồ Chí Minh", lat: 10.7781, lng: 106.7019, isDefault: true },
  { label: "Công ty", addressLine: "Bitexco Financial Tower, 2 Hải Triều, Quận 1, TP. Hồ Chí Minh", lat: 10.7717, lng: 106.7044, isDefault: false },
].map((a, i) => ({
  id: uuid("addr", i + 1),
  receiverName: customers[0].name,
  receiverPhone: customers[0].phone,
  customerId: customers[0].id,
  createdAt: CREATED,
  updatedAt: CREATED,
  ...a,
}));

// --- vouchers ------------------------------------------------------------------------

const inDays = (d: number) => new Date(NOW + d * 86400000).toISOString();
export const vouchers: any[] = [
  { code: "WELCOME20", discountType: "PERCENT", discountValue: 20, maxDiscount: 30000, minOrderAmount: 50000, maxUsage: 500, usedCount: 132, expiresAt: inDays(90), store: null },
  { code: "FREESHIP15", discountType: "FIXED", discountValue: 15000, maxDiscount: null, minOrderAmount: 100000, maxUsage: 300, usedCount: 87, expiresAt: inDays(60), store: null },
  { code: "SANGSOM", discountType: "PERCENT", discountValue: 15, maxDiscount: 20000, minOrderAmount: 40000, maxUsage: 200, usedCount: 54, expiresAt: inDays(30), store: null },
  { code: "COMBO50K", discountType: "FIXED", discountValue: 50000, maxDiscount: null, minOrderAmount: 250000, maxUsage: 100, usedCount: 12, expiresAt: inDays(45), store: null },
  { code: "Q1OPENING", discountType: "PERCENT", discountValue: 30, maxDiscount: 50000, minOrderAmount: 80000, maxUsage: 150, usedCount: 149, expiresAt: inDays(14), store: stores[0] },
  { code: "THAODIEN10", discountType: "FIXED", discountValue: 10000, maxDiscount: null, minOrderAmount: 60000, maxUsage: 200, usedCount: 31, expiresAt: inDays(30), store: stores[2] },
  { code: "TET2026", discountType: "PERCENT", discountValue: 25, maxDiscount: 40000, minOrderAmount: 100000, maxUsage: 300, usedCount: 300, expiresAt: inDays(-20), store: null, isActive: false },
].map((v, i) => ({
  id: uuid("vouc", i + 1),
  scope: "PUBLIC",
  isActive: true,
  ...v,
  storeId: v.store?.id ?? null,
  store: v.store ? { id: v.store.id, name: v.store.name } : null,
}));

// --- orders ----------------------------------------------------------------------------

const DELIVERY_ADDRESSES: Array<[string, number, number]> = [
  ["88 Đồng Khởi, Bến Nghé, Quận 1", 10.7769, 106.7031],
  ["25 Tôn Đức Thắng, Bến Nghé, Quận 1", 10.7808, 106.7065],
  ["160 Pasteur, Bến Nghé, Quận 1", 10.7798, 106.6969],
  ["210 Nam Kỳ Khởi Nghĩa, Phường 6, Quận 3", 10.7819, 106.6905],
  ["12 Xuân Thủy, Thảo Điền, TP. Thủ Đức", 10.8031, 106.7369],
  ["45 Hoa Lan, Phường 2, Phú Nhuận", 10.7976, 106.6905],
];

export const orders: any[] = [];
let orderSeq = 0;

export function buildOrder(input: {
  store: any; customer: any | null; type: string; status: string; createdMinutesAgo: number;
  lines: Array<{ product: any; quantity: number; optionIds?: string[]; note?: string }>;
  tableNumber?: string | null; note?: string | null; discount?: number;
  delivery?: { addressLine: string; lat: number; lng: number; receiverName?: string; receiverPhone?: string } | null;
  shipper?: any | null;
}) {
  orderSeq++;
  const createdAt = minutesAgo(input.createdMinutesAgo);
  const orderItems = input.lines.map((line, li) => {
    const allOptions = (line.product.optionGroups ?? []).flatMap((g: any) => g.options);
    const chosen = (line.optionIds ?? []).map((id) => allOptions.find((o: any) => o.id === id)).filter(Boolean);
    const unit = line.product.basePrice + chosen.reduce((s: number, o: any) => s + (o.price ?? o.basePrice), 0);
    return {
      id: `${uuid("oitm", orderSeq)}-${li}`,
      productId: line.product.id,
      sku: line.product.sku,
      name: line.product.name,
      price: unit,
      quantity: line.quantity,
      discount: 0,
      tax: Math.round(unit * line.quantity * 0.08),
      note: line.note ?? null,
      options: chosen.map((o: any) => o.name),
    };
  });
  const subtotal = orderItems.reduce((s, it) => s + it.price * it.quantity, 0);
  const discount = Math.min(input.discount ?? 0, subtotal);
  const serviceFee = input.type === "DELIVERY" ? 15000 : 0;
  const tax = Math.round((subtotal - discount) * 0.08);
  const total = subtotal - discount + tax + serviceFee;
  const code = `CC${String(260000 + orderSeq)}`;
  const prepMinutes = Math.max(...input.lines.map((l) => l.product.preparationTime ?? 5)) + 5;

  const order: any = {
    id: uuid("ordr", orderSeq),
    orderCode: code,
    status: input.status,
    type: input.type,
    subtotal, discount, tax, serviceFee, total,
    note: input.note ?? null,
    address: input.delivery?.addressLine ?? null,
    tableNumber: input.tableNumber ?? null,
    createdAt,
    updatedAt: createdAt,
    expectedReadyAt: new Date(new Date(createdAt).getTime() + prepMinutes * 60000).toISOString(),
    store: { id: input.store.id, name: input.store.name, address: input.store.address },
    customer: input.customer
      ? { id: input.customer.id, name: input.customer.name, phone: input.customer.phone, tier: input.customer.tier, address: input.delivery?.addressLine }
      : { id: "guest", name: "Khách vãng lai", phone: undefined },
    assignedChef: null,
    delivery: input.type === "DELIVERY"
      ? {
          id: uuid("dlvr", orderSeq),
          status: input.shipper ? (["DELIVERED", "COMPLETED"].includes(input.status) ? "DELIVERED" : "PICKED_UP") : "PENDING",
          assignedShipper: input.shipper ? { id: input.shipper.id, user: { name: input.shipper.name, phone: input.shipper.phone } } : null,
          lat: input.delivery?.lat, lng: input.delivery?.lng,
          receiverName: input.delivery?.receiverName ?? input.customer?.name,
          receiverPhone: input.delivery?.receiverPhone ?? input.customer?.phone,
        }
      : null,
    createdBy: null,
    orderItems,
  };
  // Compatibility fields used by older customer UI components.
  order.items = orderItems.map((it) => ({ id: it.id, name: it.name, quantity: it.quantity, price: it.price, options: it.options }));
  order.totalPrice = total;
  if (order.delivery?.assignedShipper) {
    order.driver = { name: input.shipper.name, phoneNumber: input.shipper.phone, avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop" };
    order.estimatedArrival = new Date(NOW + 12 * 60000).toISOString();
  }
  return order;
}

const popular = ["CF-MUOI", "CF-PHIN-SUA", "TEA-DAO-CAM-SA", "ES-LATTE", "TEA-SUA-TRAN-CHAU"];
const weightedProducts = products.flatMap((p) => (popular.includes(p.sku) ? [p, p, p, p, p] : p.type === "COMBO" ? [p] : [p, p]));
const randomOptions = (product: any) =>
  (product.optionGroups ?? []).flatMap((g: any) => {
    if (g.isRequired) return [pick(g.options as any[]).id];
    return rand() < 0.3 ? [pick(g.options as any[]).id] : [];
  });
const randomLines = () =>
  Array.from({ length: 1 + Math.floor(rand() * 3) }, () => {
    const product = pick(weightedProducts);
    return { product, quantity: rand() < 0.2 ? 2 : 1, optionIds: randomOptions(product) };
  });
const shipperFor = (store: any) => staff.find((s) => s.role === "SHIPPER" && s.storeId === store.id) ?? staff[4];

// 14 days of history: mostly completed, some cancelled.
for (let day = 14; day >= 1; day--) {
  const count = 6 + Math.floor(rand() * 6);
  for (let k = 0; k < count; k++) {
    const store = pick(stores);
    const type = pick(["DINE_IN", "DINE_IN", "TAKEAWAY", "DELIVERY"]);
    const [addr, lat, lng] = pick(DELIVERY_ADDRESSES);
    const roll = rand();
    orders.push(buildOrder({
      store,
      customer: rand() < 0.65 ? pick(customers) : null,
      type,
      status: roll < 0.08 ? "CANCELLED" : type === "DELIVERY" ? "DELIVERED" : "COMPLETED",
      createdMinutesAgo: day * 24 * 60 - (7 * 60 + Math.floor(rand() * 13 * 60)),
      lines: randomLines(),
      tableNumber: type === "DINE_IN" ? String(1 + Math.floor(rand() * 15)) : null,
      delivery: type === "DELIVERY" ? { addressLine: addr, lat, lng } : null,
      shipper: type === "DELIVERY" ? shipperFor(store) : null,
      discount: rand() < 0.2 ? 10000 : 0,
    }));
  }
}

// Today: a live mix so the kitchen board, order list and delivery map have something to show.
const TODAY: Array<[string, string, number]> = [
  ["COMPLETED", "DINE_IN", 240], ["COMPLETED", "TAKEAWAY", 200], ["DELIVERED", "DELIVERY", 170],
  ["COMPLETED", "DINE_IN", 130], ["CANCELLED", "TAKEAWAY", 110], ["READY", "TAKEAWAY", 35],
  ["READY", "DINE_IN", 28], ["PREPARING", "DINE_IN", 18], ["PREPARING", "DELIVERY", 16],
  ["CONFIRMED", "TAKEAWAY", 9], ["CONFIRMED", "DELIVERY", 8], ["NEW", "DINE_IN", 4],
  ["NEW", "DELIVERY", 3], ["NEW", "TAKEAWAY", 2], ["DELIVERING", "DELIVERY", 22], ["DELIVERING", "DELIVERY", 26],
];
TODAY.forEach(([status, type, mins], i) => {
  const store = i % 3 === 0 ? stores[1] : stores[0];
  const [addr, lat, lng] = DELIVERY_ADDRESSES[i % 4];
  orders.push(buildOrder({
    store,
    customer: rand() < 0.7 ? pick(customers.slice(1)) : null,
    type,
    status,
    createdMinutesAgo: mins,
    lines: randomLines(),
    tableNumber: type === "DINE_IN" ? String(1 + (i % 12)) : null,
    delivery: type === "DELIVERY" ? { addressLine: addr, lat, lng } : null,
    shipper: type === "DELIVERY" && ["DELIVERING", "DELIVERED"].includes(status) ? shipperFor(store) : null,
    note: i % 5 === 0 ? "Ít ngọt giúp mình nhé" : null,
  }));
});

// The demo customer's own history, including one order on its way right now.
const me = customers[0];
const byS = (sku: string) => products.find((p) => p.sku === sku);
orders.push(
  buildOrder({ store: stores[0], customer: me, type: "TAKEAWAY", status: "COMPLETED", createdMinutesAgo: 60 * 24 * 9,
    lines: [{ product: byS("CF-MUOI"), quantity: 2, optionIds: randomOptions(byS("CF-MUOI")) }, { product: byS("BK-CROISSANT"), quantity: 1 }] }),
  buildOrder({ store: stores[0], customer: me, type: "DINE_IN", status: "COMPLETED", createdMinutesAgo: 60 * 24 * 4, tableNumber: "6",
    lines: [{ product: byS("ES-LATTE"), quantity: 1, optionIds: randomOptions(byS("ES-LATTE")) }, { product: byS("BK-CHOCO-CAKE"), quantity: 1 }], discount: 15000 }),
  buildOrder({ store: stores[1], customer: me, type: "DELIVERY", status: "DELIVERED", createdMinutesAgo: 60 * 24 * 2,
    lines: [{ product: byS("TEA-DAO-CAM-SA"), quantity: 2, optionIds: randomOptions(byS("TEA-DAO-CAM-SA")) }],
    delivery: { addressLine: addresses[1].addressLine, lat: addresses[1].lat, lng: addresses[1].lng }, shipper: staff[7] }),
  buildOrder({ store: stores[0], customer: me, type: "DELIVERY", status: "DELIVERING", createdMinutesAgo: 14,
    lines: [{ product: byS("CF-PHIN-SUA"), quantity: 1, optionIds: randomOptions(byS("CF-PHIN-SUA")) }, { product: byS("TEA-SUA-TRAN-CHAU"), quantity: 1, optionIds: randomOptions(byS("TEA-SUA-TRAN-CHAU")) }],
    delivery: { addressLine: addresses[0].addressLine, lat: addresses[0].lat, lng: addresses[0].lng }, shipper: staff[4], note: "Gọi trước khi tới giúp mình" }),
);

orders.sort((a, b) => b.createdAt.localeCompare(a.createdAt));

export const SHIPPER_POSITION = { lat: 10.7762, lng: 106.7028 };
