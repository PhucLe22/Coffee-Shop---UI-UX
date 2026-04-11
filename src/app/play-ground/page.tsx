"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/shared/ui";
import { useAuthStore } from "@/store/auth.store";
import { UserType } from "@/shared/api";
import {
  Info,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Search,
  Settings,
  User,
  ArrowRight,
  Copy,
  MousePointer2,
  Layers,
} from "lucide-react";

export default function DesignSystemPlayground() {
  const { user, setAuth, logout, _hasHydrated } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleTestLogin = () => {
    setAuth({
      id: "1",
      name: "Test User",
      email: "test@example.com",
      type: UserType.CUSTOMER,
      accessToken: "fake-access-token",
      refreshToken: "fake-refresh-token",
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-40">
      {/* HEADER SECTION */}
      <header className="border-b bg-slate-50/50 sticky top-0 z-50 backdrop-blur-md">
        <div className="container mx-auto p-10 flex justify-between items-end">
          <div>
            <h1 className="text-5xl font-black tracking-tighter uppercase">
              Design System
            </h1>
            <p className="text-muted-foreground mt-2 text-lg font-medium">
              Core Foundations & Visual Language v1.0
            </p>
          </div>
          <div className="hidden md:block text-right font-mono text-xs text-muted-foreground">
            Built with shadcn/ui + Tailwind CSS
          </div>
        </div>
      </header>

      <main className="container mx-auto p-10 space-y-32">
        {/* 01. TYPOGRAPHY SYSTEM */}
        <section id="typography">
          <div className="flex items-center gap-3 mb-10">
            <div className="bg-primary text-primary-foreground w-10 h-10 rounded-full flex items-center justify-center font-bold">
              01
            </div>
            <h2 className="text-3xl font-bold tracking-tight">
              Typography System
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 border rounded-3xl p-10 shadow-sm">
            <div className="lg:col-span-2 space-y-10">
              <div className="space-y-2">
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
                  Display & Headings
                </p>
                <h1 className="text-6xl font-black tracking-tighter italic">
                  Heading 9xl
                </h1>
                <h1 className="text-5xl font-extrabold tracking-tight">
                  Heading 5xl
                </h1>
                <h2 className="text-4xl font-bold">Heading 4xl</h2>
                <h3 className="text-3xl font-semibold">Heading 3xl</h3>
                <h4 className="text-2xl font-medium">Heading 2xl</h4>
              </div>
              <div className="space-y-4">
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
                  Body & Paragraphs
                </p>
                <p className="text-lg leading-relaxed max-w-2xl">
                  <b>Large Body:</b> The quick brown fox jumps over the lazy
                  dog. Dùng cho các đoạn dẫn nhập hoặc nội dung quan trọng cần
                  độ đọc tốt.
                </p>
                <p className="text-base leading-7 text-muted-foreground max-w-2xl">
                  <b>Default Body:</b> Standard paragraph text. Nội dung chính
                  của website sử dụng kích thước 16px (1rem) với khoảng cách
                  dòng vừa phải để tối ưu trải nghiệm đọc.
                </p>
                <p className="text-sm font-medium">
                  Small Text: Dùng cho captions, metadata, hoặc các nhãn phụ.
                </p>
              </div>
            </div>
            <div className="bg-slate-50 rounded-2xl p-6 border space-y-6">
              <h4 className="font-bold text-sm uppercase">Font Weights</h4>
              <div className="space-y-2 font-mono text-sm">
                <p className="font-light italic">Font Light (300)</p>
                <p className="font-normal">Font Normal (400)</p>
                <p className="font-medium text-primary">Font Medium (500)</p>
                <p className="font-semibold">Font Semibold (600)</p>
                <p className="font-bold">Font Bold (700)</p>
                <p className="font-black">Font Black (900)</p>
              </div>
            </div>
          </div>
        </section>

        {/* 02. COLOR ARCHITECTURE */}
        <section id="colors">
          <div className="flex items-center gap-3 mb-10">
            <div className="bg-primary text-primary-foreground w-10 h-10 rounded-full flex items-center justify-center font-bold">
              02
            </div>
            <h2 className="text-3xl font-bold tracking-tight">
              Color Architecture
            </h2>
          </div>

          <div className="space-y-12">
            <div>
              <h3 className="text-sm font-bold uppercase mb-4 text-muted-foreground flex items-center gap-2">
                <Layers size={14} /> Core Brand Colors
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <ColorTile
                  bg="bg-primary"
                  text="text-primary-foreground"
                  label="Primary"
                  hex="#0F172A"
                />
                <ColorTile
                  bg="bg-secondary"
                  text="text-secondary-foreground"
                  label="Secondary"
                  hex="#F1F5F9"
                />
                <ColorTile
                  bg="bg-accent"
                  text="text-accent-foreground"
                  label="Accent"
                  hex="#F1F5F9"
                />
                <ColorTile
                  bg="bg-muted"
                  text="text-muted-foreground"
                  label="Muted"
                  hex="#F1F5F9"
                />
                <ColorTile
                  bg="bg-destructive"
                  text="text-destructive-foreground"
                  label="Destructive"
                  hex="#EF4444"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-sm font-bold uppercase mb-4 text-muted-foreground">
                  Semantic States
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-20 bg-blue-500 rounded-xl flex items-end p-3 text-white font-bold text-xs shadow-lg shadow-blue-500/20">
                    Info
                  </div>
                  <div className="h-20 bg-emerald-500 rounded-xl flex items-end p-3 text-white font-bold text-xs shadow-lg shadow-emerald-500/20">
                    Success
                  </div>
                  <div className="h-20 bg-amber-500 rounded-xl flex items-end p-3 text-white font-bold text-xs shadow-lg shadow-amber-500/20">
                    Warning
                  </div>
                  <div className="h-20 bg-rose-600 rounded-xl flex items-end p-3 text-white font-bold text-xs shadow-lg shadow-rose-600/20">
                    Error
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-bold uppercase mb-4 text-muted-foreground">
                  Surface & Border
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-20 bg-background border rounded-xl flex items-end p-3 font-bold text-xs">
                    Background
                  </div>
                  <div className="h-20 bg-card border shadow-sm rounded-xl flex items-end p-3 font-bold text-xs">
                    Card Surface
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 03. SPACING & MEASUREMENT */}
        <section id="spacing">
          <div className="flex items-center gap-3 mb-10">
            <div className="bg-primary text-primary-foreground w-10 h-10 rounded-full flex items-center justify-center font-bold">
              03
            </div>
            <h2 className="text-3xl font-bold tracking-tight">
              Spacing & Measurement
            </h2>
          </div>

          <div className="border rounded-3xl p-10 bg-slate-50/50 relative overflow-hidden">
            <div className="space-y-6">
              {[2, 4, 8, 12, 16, 24, 32].map((s) => (
                <div key={s} className="flex items-center gap-6">
                  <span className="w-16 font-mono text-[10px] text-muted-foreground italic">
                    Tailwind {s / 4}
                  </span>
                  <div
                    className="h-4 bg-primary rounded-full"
                    style={{ width: `${s * 4}px` }}></div>
                  <span className="text-sm font-bold">{s * 4}px</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 04. ELEVATION, RADIUS & EFFECTS */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <div>
            <h2 className="text-3xl font-bold mb-8">04. Elevation & Shadows</h2>
            <div className="grid grid-cols-2 gap-8">
              <div className="h-40 bg-white border shadow-sm rounded-2xl flex items-center justify-center text-xs font-medium">
                Shadow SM
              </div>
              <div className="h-40 bg-white border shadow-md rounded-2xl flex items-center justify-center text-xs font-medium text-blue-600">
                Shadow MD
              </div>
              <div className="h-40 bg-white border shadow-2xl rounded-2xl flex items-center justify-center text-xs font-medium">
                Shadow 2XL
              </div>
              <div className="h-40 bg-white shadow-[0_20px_50px_rgba(8,_112,_184,_0.3)] rounded-2xl flex items-center justify-center text-xs font-bold text-blue-500 border border-blue-100">
                Custom Brand
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-3xl font-bold mb-8">05. Corners & Radius</h2>
            <div className="grid grid-cols-2 gap-8">
              <div className="h-40 bg-primary text-white rounded-none flex items-center justify-center text-xs font-mono">
                None (0px)
              </div>
              <div className="h-40 bg-primary text-white rounded-md flex items-center justify-center text-xs font-mono">
                Medium (6px)
              </div>
              <div className="h-40 bg-primary text-white rounded-3xl flex items-center justify-center text-xs font-mono">
                3XL (24px)
              </div>
              <div className="h-40 bg-primary text-white rounded-full flex items-center justify-center text-xs font-mono">
                Full (999px)
              </div>
            </div>
          </div>
        </section>

        {/* 05. GLASSMORPHISM & OPACITY */}
        <section>
          <h2 className="text-3xl font-bold mb-8">06. Glassmorphism & Depth</h2>
          <div className="relative h-[300px] rounded-3xl overflow-hidden shadow-2xl border">
            <img
              src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop"
              className="absolute inset-0 w-full h-full object-cover"
              alt="Background"
            />
            <div className="absolute inset-0 flex items-center justify-center gap-6 p-10">
              <div className="w-1/3 h-40 bg-white/20 backdrop-blur-md rounded-2xl border border-white/30 flex items-center justify-center text-white font-bold text-lg shadow-xl">
                Soft Blur
              </div>
              <div className="w-1/3 h-40 bg-white/40 backdrop-blur-2xl rounded-2xl border border-white/50 flex items-center justify-center text-white font-bold text-lg shadow-xl">
                High Depth
              </div>
            </div>
          </div>
        </section>

        {/* 06. ICONOGRAPHY & INTERACTION */}
        <section id="icons">
          <h2 className="text-3xl font-bold mb-10 flex items-center gap-3">
            <MousePointer2 className="text-primary" /> Iconography & States
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="border rounded-3xl p-10 flex flex-wrap gap-10 justify-center text-muted-foreground">
              <IconGroup icon={<Search />} label="Search" />
              <IconGroup icon={<Settings />} label="Settings" />
              <IconGroup icon={<User />} label="Profile" />
              <IconGroup
                icon={<CheckCircle2 className="text-green-500" />}
                label="Success"
              />
              <IconGroup
                icon={<AlertTriangle className="text-amber-500" />}
                label="Warning"
              />
              <IconGroup
                icon={<XCircle className="text-red-500" />}
                label="Error"
              />
              <IconGroup
                icon={<Info className="text-blue-500" />}
                label="Info"
              />
            </div>

            <div className="border rounded-3xl p-10 space-y-8">
              <div>
                <p className="text-xs font-bold uppercase text-muted-foreground mb-4 font-mono italic underline">
                  Interactive Components
                </p>
                <div className="flex flex-wrap gap-4 items-center">
                  <Button
                    size="lg"
                    className="rounded-full shadow-lg shadow-primary/20 hover:scale-105 transition-transform">
                    Primary Button <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button variant="outline" className="rounded-full">
                    Secondary
                  </Button>
                  <Button variant="ghost" className="rounded-full">
                    Ghost
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    className="rounded-full">
                    <XCircle />
                  </Button>
                </div>
              </div>
              <div className="space-y-4">
                <div className="animate-pulse flex space-x-4 items-center">
                  <div className="rounded-full bg-slate-200 h-10 w-10"></div>
                  <div className="flex-1 space-y-3 py-1">
                    <div className="h-2 bg-slate-200 rounded"></div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="h-2 bg-slate-200 rounded col-span-2"></div>
                      <div className="h-2 bg-slate-200 rounded col-span-1"></div>
                    </div>
                  </div>
                </div>
                <p className="text-[10px] text-center text-muted-foreground font-mono">
                  Skeleton Loading State
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 07. STATE MANAGEMENT (ZUSTAND) */}
        <section id="state">
          <div className="flex items-center gap-3 mb-10">
            <div className="bg-primary text-primary-foreground w-10 h-10 rounded-full flex items-center justify-center font-bold">
              07
            </div>
            <h2 className="text-3xl font-bold tracking-tight">
              State Management (Zustand)
            </h2>
          </div>

          <div className="border rounded-3xl p-10 bg-slate-50/50">
            {!mounted || !_hasHydrated ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                <p>Hydrating store...</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <p className="font-medium">Status:</p>
                  {user ? (
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase">
                      Logged In
                    </span>
                  ) : (
                    <span className="bg-slate-200 text-slate-600 px-3 py-1 rounded-full text-xs font-bold uppercase">
                      Logged Out
                    </span>
                  )}
                </div>

                {user && (
                  <div className="bg-white p-6 rounded-2xl border space-y-2 font-mono text-sm">
                    <p>
                      <span className="text-muted-foreground">Name:</span> {user.name}
                    </p>
                    <p>
                      <span className="text-muted-foreground">Email:</span> {user.email}
                    </p>
                    <p>
                      <span className="text-muted-foreground">Type:</span> {user.type}
                    </p>
                  </div>
                )}

                <div className="flex gap-4">
                  {!user ? (
                    <Button onClick={handleTestLogin}>Test Login</Button>
                  ) : (
                    <Button variant="destructive" onClick={logout}>
                      Logout
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* FOOTER NAV */}
      <footer className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-8 py-4 rounded-full shadow-2xl flex gap-8 items-center border border-primary-foreground/20 backdrop-blur-lg">
        <a
          href="#typography"
          className="text-xs font-bold uppercase hover:underline">
          Typography
        </a>
        <div className="w-[1px] h-4 bg-primary-foreground/30"></div>
        <a
          href="#colors"
          className="text-xs font-bold uppercase hover:underline">
          Colors
        </a>
        <div className="w-[1px] h-4 bg-primary-foreground/30"></div>
        <a
          href="#spacing"
          className="text-xs font-bold uppercase hover:underline">
          Spacing
        </a>
        <div className="w-[1px] h-4 bg-primary-foreground/30"></div>
        <a
          href="#icons"
          className="text-xs font-bold uppercase hover:underline">
          Components
        </a>
        <div className="w-[1px] h-4 bg-primary-foreground/30"></div>
        <a
          href="#state"
          className="text-xs font-bold uppercase hover:underline">
          State
        </a>
      </footer>
    </div>
  );
}

// HELPER COMPONENTS
function ColorTile({
  bg,
  text,
  label,
  hex,
}: {
  bg: string;
  text: string;
  label: string;
  hex: string;
}) {
  return (
    <div
      className={`group relative p-4 rounded-2xl border flex flex-col justify-end h-32 transition-all hover:scale-105 shadow-sm ${bg} ${text}`}>
      <span className="font-black text-sm uppercase tracking-tighter leading-tight">
        {label}
      </span>
      <span className="text-[10px] font-mono opacity-60 uppercase">{hex}</span>
      <button className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Copy size={12} />
      </button>
    </div>
  );
}
function IconGroup({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex flex-col items-center gap-3 transition-colors hover:text-primary cursor-help group">
      <div className="p-4 bg-slate-50 rounded-2xl border group-hover:bg-white transition-colors">
        {/* Ép kiểu props để TypeScript chấp nhận thuộc tính 'size' */}
        {React.isValidElement(icon)
          ? React.cloneElement(icon as React.ReactElement<{ size?: number }>, {
              size: 28,
            })
          : icon}
      </div>
      <span className="text-[10px] font-bold uppercase tracking-widest">
        {label}
      </span>
    </div>
  );
}
