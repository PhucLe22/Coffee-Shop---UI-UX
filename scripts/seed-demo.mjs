#!/usr/bin/env node
/**
 * Demo seed for Coffee Collective.
 *
 * Seeds stores, staff, products, vouchers and sample orders through the
 * backend's existing /internal endpoints (same calls the admin UI makes).
 * Categories and option groups have no create endpoint in the UI, so the
 * script reuses whatever the backend already has and maps products onto them.
 *
 * Usage:
 *   SEED_ADMIN_IDENTIFIER=admin@example.com SEED_ADMIN_PASSWORD=secret \
 *   node scripts/seed-demo.mjs [--dry-run] [--no-images] [--no-orders]
 *
 * Env:
 *   SEED_API_URL            Backend base URL (falls back to NEXT_PUBLIC_API_URL / .env.local)
 *   SEED_ADMIN_IDENTIFIER   Admin email or phone
 *   SEED_ADMIN_PASSWORD     Admin password
 *   SEED_STAFF_PASSWORD     Password for seeded staff accounts (default: Demo@123)
 *
 * Safe to re-run: stores, products, vouchers and staff that already exist
 * (matched by code / sku / email) are skipped. Orders are always added.
 */

import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const args = new Set(process.argv.slice(2));
const DRY_RUN = args.has("--dry-run");
const WITH_IMAGES = !args.has("--no-images");
const WITH_ORDERS = !args.has("--no-orders");

function loadEnvFile(file) {
  const path = resolve(ROOT, file);
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (match && !(match[1] in process.env)) {
      process.env[match[1]] = match[2].replace(/^["']|["']$/g, "");
    }
  }
}
loadEnvFile(".env.local");
loadEnvFile(".env");

const API_URL = (process.env.SEED_API_URL || process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "");
const ADMIN_IDENTIFIER = process.env.SEED_ADMIN_IDENTIFIER;
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD;
const STAFF_PASSWORD = process.env.SEED_STAFF_PASSWORD || "Demo@123";

// ---------------------------------------------------------------------------
// Demo data
// ---------------------------------------------------------------------------

const img = (id) => `https://images.unsplash.com/photo-${id}?w=800&h=800&fit=crop&fm=jpg&q=80`;

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

const STORES = [
  { code: "CC-Q1", name: "Coffee Collective Nguyễn Huệ", address: "42 Nguyễn Huệ, Bến Nghé, Quận 1, TP. Hồ Chí Minh", hotline: "02838221001", lat: 10.7745, lng: 106.7038 },
  { code: "CC-Q3", name: "Coffee Collective Võ Văn Tần", address: "118 Võ Văn Tần, Phường 6, Quận 3, TP. Hồ Chí Minh", hotline: "02838221002", lat: 10.7752, lng: 106.6890 },
  { code: "CC-BT", name: "Coffee Collective Thảo Điền", address: "21 Quốc Hương, Thảo Điền, TP. Thủ Đức, TP. Hồ Chí Minh", hotline: "02838221003", lat: 10.8040, lng: 106.7330 },
  { code: "CC-PN", name: "Coffee Collective Phan Xích Long", address: "203 Phan Xích Long, Phường 2, Phú Nhuận, TP. Hồ Chí Minh", hotline: "02838221004", lat: 10.7990, lng: 106.6880 },
];

// One cashier, one kitchen, one shipper per store; one manager for the flagship.
const STAFF_ROLES = ["CASHIER", "KITCHEN", "SHIPPER"];
const STAFF_NAMES = [
  "Nguyễn Minh Anh", "Trần Gia Huy", "Lê Thảo Vy", "Phạm Đức Long",
  "Hoàng Ngọc Hân", "Vũ Quang Khải", "Đặng Thu Trang", "Bùi Tuấn Kiệt",
  "Đỗ Khánh Linh", "Ngô Bảo Nam", "Dương Mỹ Duyên", "Lý Hoàng Phúc",
];

// `category` holds keywords matched against existing category names (case/diacritic-insensitive).
const PRODUCTS = [
  // Cà phê Việt
  { sku: "CF-PHIN-DEN", name: "Cà Phê Phin Đen", category: ["ca phe", "coffee"], basePrice: 29000, costPrice: 9000, image: IMAGES.espressoBar, prep: 4,
    description: "Robusta Đắk Lắk rang đậm, pha phin truyền thống. Đắng sâu, hậu vị sô-cô-la đen." },
  { sku: "CF-PHIN-SUA", name: "Cà Phê Sữa Đá", category: ["ca phe", "coffee"], basePrice: 35000, costPrice: 11000, image: IMAGES.icedMilkCoffee, prep: 4,
    description: "Phin Robusta hòa cùng sữa đặc, rót trên đá viên. Hương vị Sài Gòn mỗi sáng." },
  { sku: "CF-BAC-XIU", name: "Bạc Xỉu", category: ["ca phe", "coffee"], basePrice: 39000, costPrice: 12000, image: IMAGES.icedLatte, prep: 4,
    description: "Nhiều sữa, ít cà phê — ngọt dịu, béo mịn, dành cho người mới làm quen cà phê." },
  { sku: "CF-MUOI", name: "Cà Phê Muối", category: ["ca phe", "coffee"], basePrice: 45000, costPrice: 14000, image: IMAGES.icedMilkCoffee, prep: 5,
    description: "Lớp kem muối Huế mằn mặn phủ trên cà phê phin đậm đà. Signature của nhà." },
  { sku: "CF-TRUNG", name: "Cà Phê Trứng", category: ["ca phe", "coffee"], basePrice: 49000, costPrice: 15000, image: IMAGES.latteArt, prep: 6,
    description: "Kem trứng đánh bông kiểu Hà Nội, béo như custard, trên nền espresso nóng." },
  { sku: "CF-COLD-BREW", name: "Cold Brew Cam Sả", category: ["ca phe", "coffee", "cold"], basePrice: 55000, costPrice: 16000, image: IMAGES.icedTea, prep: 3,
    description: "Ủ lạnh 18 giờ từ Arabica Cầu Đất, thêm cam vàng và sả tươi. Thanh, sáng, ít đắng." },
  // Espresso
  { sku: "ES-ESPRESSO", name: "Espresso", category: ["espresso", "ca phe", "coffee"], basePrice: 39000, costPrice: 10000, image: IMAGES.espressoBar, prep: 3,
    description: "Shot đôi từ blend Arabica Đà Lạt & Ethiopia. Crema dày, hương caramel và quả mọng." },
  { sku: "ES-AMERICANO", name: "Americano", category: ["espresso", "ca phe", "coffee"], basePrice: 45000, costPrice: 11000, image: IMAGES.espressoBar, prep: 3,
    description: "Espresso đôi kéo dài với nước nóng hoặc đá. Nhẹ nhàng, giữ trọn hương rang." },
  { sku: "ES-CAPPUCCINO", name: "Cappuccino", category: ["espresso", "ca phe", "coffee"], basePrice: 55000, costPrice: 15000, image: IMAGES.cappuccino, prep: 5,
    description: "Espresso, sữa nóng và lớp foam dày tỉ lệ 1:1:1, rắc bột cacao." },
  { sku: "ES-LATTE", name: "Caffè Latte", category: ["espresso", "ca phe", "coffee"], basePrice: 55000, costPrice: 15000, image: IMAGES.lattePour, prep: 5,
    description: "Sữa tươi đánh mịn, vẽ latte art trên espresso đôi. Êm, cân bằng." },
  { sku: "ES-CARAMEL-MAC", name: "Caramel Macchiato", category: ["espresso", "ca phe", "coffee"], basePrice: 62000, costPrice: 18000, image: IMAGES.latteDuo, prep: 5,
    description: "Vanilla, sữa tươi, espresso rót tầng và sốt caramel nhà làm." },
  { sku: "ES-FLAT-WHITE", name: "Flat White", category: ["espresso", "ca phe", "coffee"], basePrice: 59000, costPrice: 16000, image: IMAGES.latteArt, prep: 5,
    description: "Ristretto đôi với microfoam mỏng — đậm vị cà phê hơn latte." },
  // Trà
  { sku: "TEA-DAO-CAM-SA", name: "Trà Đào Cam Sả", category: ["tra", "tea"], basePrice: 49000, costPrice: 13000, image: IMAGES.icedTea, prep: 4,
    description: "Trà đen ủ lạnh, đào miếng giòn, cam vàng và sả đập dập. Best-seller mùa hè." },
  { sku: "TEA-VAI-HOA-HONG", name: "Trà Vải Hoa Hồng", category: ["tra", "tea"], basePrice: 52000, costPrice: 14000, image: IMAGES.icedTea, prep: 4,
    description: "Trà Ô Long, vải thiều Lục Ngạn và siro hoa hồng. Thơm nhẹ, thanh mát." },
  { sku: "TEA-SUA-TRAN-CHAU", name: "Trà Sữa Trân Châu Đường Đen", category: ["tra sua", "milk tea", "tra", "tea"], basePrice: 55000, costPrice: 15000, image: IMAGES.bubbleTea, prep: 5,
    description: "Sữa tươi, trà Assam và trân châu đường đen nấu mỗi 2 giờ." },
  { sku: "TEA-SUA-OOLONG", name: "Trà Sữa Ô Long Nướng", category: ["tra sua", "milk tea", "tra", "tea"], basePrice: 52000, costPrice: 14000, image: IMAGES.milkTeaJars, prep: 5,
    description: "Ô Long rang lửa than, hương khói nhẹ, béo vừa phải." },
  { sku: "TEA-MATCHA-LATTE", name: "Matcha Latte", category: ["matcha", "tra", "tea"], basePrice: 59000, costPrice: 18000, image: IMAGES.icedLatte, prep: 5,
    description: "Matcha Uji ceremonial grade đánh tay, sữa tươi thanh trùng." },
  // Đá xay
  { sku: "FR-COOKIE", name: "Cookies & Cream Đá Xay", category: ["da xay", "frappe", "ice blended"], basePrice: 65000, costPrice: 19000, image: IMAGES.icedLatte, prep: 6,
    description: "Bánh Oreo, kem sữa và đá xay mịn, phủ whipping cream." },
  { sku: "FR-CARAMEL", name: "Caramel Frappé", category: ["da xay", "frappe", "ice blended"], basePrice: 65000, costPrice: 19000, image: IMAGES.icedMilkCoffee, prep: 6,
    description: "Espresso, sốt caramel và đá xay — mát lạnh, ngọt vừa." },
  // Bánh
  { sku: "BK-CROISSANT", name: "Croissant Bơ Pháp", category: ["banh", "bakery", "pastry", "food"], basePrice: 35000, costPrice: 12000, image: IMAGES.croissant, prep: 2,
    description: "Bơ Isigny AOP, 27 lớp ngàn lớp, nướng mới mỗi sáng lúc 6h." },
  { sku: "BK-CHOCO-CAKE", name: "Bánh Sô-cô-la Tan Chảy", category: ["banh", "bakery", "dessert", "food"], basePrice: 49000, costPrice: 17000, image: IMAGES.chocolateCake, prep: 3,
    description: "Sô-cô-la đen 70% Bến Tre, nhân tan chảy. Hợp nhất với Americano." },
  { sku: "BK-COOKIE", name: "Cookie Sô-cô-la Chip", category: ["banh", "bakery", "dessert", "food"], basePrice: 25000, costPrice: 8000, image: IMAGES.cookies, prep: 1,
    description: "Giòn rìa, dẻo tâm, rắc muối biển. Nướng theo mẻ nhỏ." },
  // Combo
  { sku: "CB-SANG", name: "Combo Bữa Sáng", category: ["combo", "banh", "bakery", "food"], type: "COMBO", basePrice: 59000, costPrice: 21000, image: IMAGES.croissant, prep: 4,
    description: "Cà Phê Sữa Đá + Croissant Bơ Pháp. Tiết kiệm 11.000đ, phục vụ đến 10h." },
  { sku: "CB-CHIEU", name: "Combo Trà Chiều", category: ["combo", "banh", "bakery", "food"], type: "COMBO", basePrice: 89000, costPrice: 30000, image: IMAGES.chocolateCake, prep: 5,
    description: "Trà Đào Cam Sả + Bánh Sô-cô-la Tan Chảy. Áp dụng 14h – 17h." },
];

const now = Date.now();
const inDays = (d) => new Date(now + d * 86400000).toISOString();
const VOUCHERS = [
  { code: "WELCOME20", discountType: "PERCENT", discountValue: 20, maxDiscount: 30000, minOrderAmount: 50000, maxUsage: 500, expiresAt: inDays(90) },
  { code: "FREESHIP15", discountType: "FIXED", discountValue: 15000, minOrderAmount: 100000, maxUsage: 300, expiresAt: inDays(60) },
  { code: "SANGSOM", discountType: "PERCENT", discountValue: 15, maxDiscount: 20000, minOrderAmount: 40000, maxUsage: 200, expiresAt: inDays(30) },
  { code: "COMBO50K", discountType: "FIXED", discountValue: 50000, minOrderAmount: 250000, maxUsage: 100, expiresAt: inDays(45) },
  { code: "Q1OPENING", discountType: "PERCENT", discountValue: 30, maxDiscount: 50000, minOrderAmount: 80000, maxUsage: 150, expiresAt: inDays(14), storeCode: "CC-Q1" },
  { code: "THAODIEN10", discountType: "FIXED", discountValue: 10000, minOrderAmount: 60000, maxUsage: 200, expiresAt: inDays(30), storeCode: "CC-BT" },
];

const DEMO_PHONES = ["0901234567", "0912345678", "0938765432", "0987654321", "0977112233", "0909998877"];

// ---------------------------------------------------------------------------
// HTTP helpers
// ---------------------------------------------------------------------------

async function api(method, path, { token, body, form } = {}) {
  const headers = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  if (body) headers["Content-Type"] = "application/json";
  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: form ?? (body ? JSON.stringify(body) : undefined),
  });
  const text = await res.text();
  let json;
  try { json = text ? JSON.parse(text) : {}; } catch { json = { message: text }; }
  if (!res.ok) {
    const err = new Error(`${method} ${path} → ${res.status}: ${json.message ?? text}`);
    err.status = res.status;
    throw err;
  }
  return json;
}

async function listAll(path, token, extraParams = {}) {
  const items = [];
  for (let page = 1; page <= 50; page++) {
    const qs = new URLSearchParams({ page: String(page), limit: "100", ...extraParams });
    const res = await api("GET", `${path}?${qs}`, { token });
    items.push(...(res.data ?? []));
    if (!res.meta?.hasNext) break;
  }
  return items;
}

async function login(identifier, password) {
  const res = await api("POST", "/auth/login", { body: { identifier, password } });
  return res.data?.tokens?.accessToken ?? res.data?.accessToken;
}

const normalize = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/gi, "d").toLowerCase();
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const chance = (p) => Math.random() < p;
const log = (...m) => console.log(...m);

// ---------------------------------------------------------------------------
// Seed steps
// ---------------------------------------------------------------------------

async function seedStores(token) {
  log("\n☕ Stores");
  const existing = await listAll("/internal/admin/stores", token);
  const byCode = new Map(existing.map((s) => [s.code, s]));
  for (const store of STORES) {
    if (byCode.has(store.code)) { log(`  · skip ${store.code} (exists)`); continue; }
    const res = await api("POST", "/internal/admin/stores", { token, body: store });
    byCode.set(store.code, res.data);
    log(`  + ${store.code} ${store.name}`);
  }
  return byCode;
}

async function seedStaff(token, storesByCode) {
  log("\n👥 Staff");
  const existing = await listAll("/internal/staff", token).catch(() => []);
  const emails = new Set(existing.map((s) => s.email));
  const cashiers = new Map();
  let n = 0;
  for (const store of STORES) {
    const storeId = storesByCode.get(store.code)?.id;
    if (!storeId) continue;
    const roles = store.code === "CC-Q1" ? ["MANAGER", ...STAFF_ROLES] : STAFF_ROLES;
    for (const role of roles) {
      const name = STAFF_NAMES[n % STAFF_NAMES.length];
      const email = `${role.toLowerCase()}.${store.code.toLowerCase()}@demo.coffeecollective.vn`;
      const phone = `0966${String(100000 + n).slice(-6)}`;
      n++;
      if (role === "CASHIER") cashiers.set(store.code, email);
      if (emails.has(email)) { log(`  · skip ${email} (exists)`); continue; }
      try {
        await api("POST", "/internal/auth/register/staff", { token, body: { name, email, phone, password: STAFF_PASSWORD, storeId, role } });
        log(`  + ${role.padEnd(8)} ${email}`);
      } catch (e) {
        log(`  ! ${email}: ${e.message}`);
      }
    }
  }
  return cashiers;
}

function matchCategory(categories, keywords) {
  for (const kw of keywords) {
    const hit = categories.find((c) => normalize(c.name).includes(kw));
    if (hit) return hit;
  }
  return null;
}

// Attach option groups by name: drinks get size/sugar/ice/topping, food gets none.
function optionGroupsFor(product, optionGroups) {
  const isDrink = !product.category.some((k) => ["banh", "bakery", "pastry", "food", "dessert"].includes(k));
  if (!isDrink || product.type === "COMBO") return [];
  const patterns = [/size|kich/, /duong|sugar|ngot/, /da\b|ice|\bda /, /topping/];
  const groups = [];
  for (const [i, re] of patterns.entries()) {
    const group = optionGroups.find((g) => re.test(normalize(g.name)) && g.options?.length);
    if (!group || groups.some((g) => g.optionGroupId === group.id)) continue;
    groups.push({
      optionGroupId: group.id,
      sortOrder: i + 1,
      optionValues: group.options.map((o) => ({ optionId: o.id, price: Number(o.basePrice) || 0 })),
    });
  }
  return groups;
}

async function fetchImage(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    return new Blob([await res.arrayBuffer()], { type: res.headers.get("content-type") || "image/jpeg" });
  } catch {
    return null;
  }
}

async function seedProducts(token) {
  log("\n🥤 Products");
  const categories = (await api("GET", "/categories?page=1&limit=100")).data ?? [];
  if (!categories.length) throw new Error("No categories found. Create at least one category in the backend first.");
  log(`  categories: ${categories.map((c) => c.name).join(", ")}`);
  const optionGroups = await listAll("/internal/option-groups", token).catch(() => []);
  log(`  option groups: ${optionGroups.map((g) => g.name).join(", ") || "(none)"}`);

  const existing = await listAll("/internal/products", token).catch(() => []);
  const skus = new Set(existing.map((p) => p.sku));
  const unmatched = new Set();

  for (const [i, p] of PRODUCTS.entries()) {
    if (skus.has(p.sku)) { log(`  · skip ${p.sku} (exists)`); continue; }
    let category = matchCategory(categories, p.category);
    if (!category) { unmatched.add(p.category[0]); category = categories[0]; }

    const groups = optionGroupsFor(p, optionGroups);
    const blob = WITH_IMAGES ? await fetchImage(p.image) : null;
    // costPrice / preparationTime aren't sent by the admin form; drop them if the backend rejects them.
    const buildForm = (withExtras) => {
      const form = new FormData();
      form.append("sku", p.sku);
      form.append("name", p.name);
      form.append("type", p.type ?? "SIMPLE");
      form.append("basePrice", String(p.basePrice));
      form.append("taxRate", "8");
      form.append("sortOrder", String(i + 1));
      form.append("description", p.description);
      form.append("category", JSON.stringify({ id: category.id }));
      if (withExtras) {
        form.append("costPrice", String(p.costPrice));
        form.append("preparationTime", String(p.prep));
      }
      if (groups.length) form.append("optionGroups", JSON.stringify(groups));
      if (blob) form.append("image", blob, `${p.sku.toLowerCase()}.jpg`);
      return form;
    };

    try {
      await api("POST", "/internal/products", { token, form: buildForm(true) }).catch((e) => {
        if (e.status !== 400 && e.status !== 422) throw e;
        return api("POST", "/internal/products", { token, form: buildForm(false) });
      });
      log(`  + ${p.sku.padEnd(18)} ${p.name} → ${category.name}${groups.length ? ` (+${groups.length} option groups)` : ""}`);
    } catch (e) {
      log(`  ! ${p.sku}: ${e.message}`);
    }
  }
  if (unmatched.size) {
    log(`  ⚠ no category matched [${[...unmatched].join(", ")}] → used "${categories[0].name}". Add those categories and re-run for a nicer menu.`);
  }
}

async function seedVouchers(token, storesByCode) {
  log("\n🎟  Vouchers");
  const existing = await listAll("/internal/vouchers", token).catch(() => []);
  const codes = new Set(existing.map((v) => v.code));
  for (const { storeCode, ...v } of VOUCHERS) {
    if (codes.has(v.code)) { log(`  · skip ${v.code} (exists)`); continue; }
    const body = { ...v };
    if (storeCode) body.storeId = storesByCode.get(storeCode)?.id;
    try {
      await api("POST", "/internal/vouchers", { token, body });
      log(`  + ${v.code}`);
    } catch (e) {
      log(`  ! ${v.code}: ${e.message}`);
    }
  }
}

// Status path each order walks through; final state is chosen per order.
const STATUS_FLOW = ["CONFIRMED", "PREPARING", "READY", "COMPLETED"];

async function seedOrders(adminToken, cashiers) {
  log("\n🧾 Orders");
  const products = (await api("GET", "/products?page=1&limit=100")).data ?? [];
  const seeded = products.filter((p) => PRODUCTS.some((d) => d.sku === p.sku) && p.type !== "COMBO");
  if (!seeded.length) { log("  no seeded products visible yet — skipping orders"); return; }

  const details = new Map();
  for (const p of seeded) {
    const res = await api("GET", `/products/id/${p.id}`).catch(() => null);
    details.set(p.id, res?.data ?? p);
  }
  // Weight a few signature drinks so "Hot products" has clear winners.
  const favourites = ["CF-MUOI", "CF-PHIN-SUA", "TEA-DAO-CAM-SA", "ES-LATTE"];
  const weighted = seeded.flatMap((p) => (favourites.includes(p.sku) ? [p, p, p, p] : [p]));

  for (const store of STORES) {
    const email = cashiers.get(store.code);
    let token = adminToken;
    if (email) token = (await login(email, STAFF_PASSWORD).catch(() => null)) ?? adminToken;

    let created = 0;
    for (let i = 0; i < 12; i++) {
      const items = Array.from({ length: 1 + Math.floor(Math.random() * 3) }, () => {
        const product = details.get(pick(weighted).id);
        const options = [];
        for (const g of product.optionGroups ?? []) {
          const active = (g.options ?? []).filter((o) => o.isActive !== false);
          if (!active.length) continue;
          if (g.isRequired || chance(0.35)) options.push({ optionId: (g.isRequired ? active[0] : pick(active)).id });
        }
        return { productId: product.id, quantity: chance(0.2) ? 2 : 1, ...(options.length ? { options } : {}) };
      });
      const dineIn = chance(0.55);
      const body = {
        type: dineIn ? "DINE_IN" : "TAKEAWAY",
        ...(dineIn ? { tableNumber: String(1 + Math.floor(Math.random() * 15)) } : {}),
        ...(chance(0.6) ? { phone: pick(DEMO_PHONES) } : {}),
        paymentMethod: pick(["CASH", "CASH", "MOMO", "CARD", "VNPAY"]),
        items,
      };
      try {
        const order = (await api("POST", "/internal/orders", { token, body })).data;
        // ~70% completed, a few in progress (so the kitchen board isn't empty), a few cancelled.
        const roll = Math.random();
        const steps = roll < 0.7 ? 4 : roll < 0.8 ? 2 : roll < 0.9 ? 1 : 0;
        for (const status of STATUS_FLOW.slice(0, steps)) {
          await api("PATCH", `/internal/orders/${order.id}/status`, { token, body: { status } });
        }
        if (roll >= 0.95) await api("PATCH", `/internal/orders/${order.id}/status`, { token, body: { status: "CANCELLED" } });
        created++;
      } catch (e) {
        log(`  ! ${store.code} order: ${e.message}`);
        if (e.status === 401 || e.status === 403) break;
      }
    }
    log(`  + ${store.code}: ${created} orders`);
  }
}

// ---------------------------------------------------------------------------

async function main() {
  if (DRY_RUN) {
    log(`Dry run — would seed ${STORES.length} stores, ${STORES.length * STAFF_ROLES.length + 1} staff, ` +
      `${PRODUCTS.length} products, ${VOUCHERS.length} vouchers${WITH_ORDERS ? `, ${STORES.length * 12} orders` : ""}.`);
    log(`API: ${API_URL || "(not set)"}`);
    return;
  }
  if (!API_URL) throw new Error("Set SEED_API_URL (or NEXT_PUBLIC_API_URL in .env.local).");
  if (!ADMIN_IDENTIFIER || !ADMIN_PASSWORD) throw new Error("Set SEED_ADMIN_IDENTIFIER and SEED_ADMIN_PASSWORD.");

  log(`Seeding ${API_URL} as ${ADMIN_IDENTIFIER}`);
  const token = await login(ADMIN_IDENTIFIER, ADMIN_PASSWORD);
  if (!token) throw new Error("Login succeeded but no access token was returned.");

  const storesByCode = await seedStores(token);
  const cashiers = await seedStaff(token, storesByCode);
  await seedProducts(token);
  await seedVouchers(token, storesByCode);
  if (WITH_ORDERS) await seedOrders(token, cashiers);

  log(`\n✅ Done. Staff password: ${STAFF_PASSWORD}  (e.g. cashier.cc-q1@demo.coffeecollective.vn)`);
}

main().catch((e) => {
  console.error(`\n❌ ${e.message}`);
  process.exit(1);
});
