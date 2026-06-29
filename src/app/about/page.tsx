"use client";

import { MapPin, Coffee, Leaf, Heart, Store, Users, Award, Bean } from "lucide-react";
import { AppButton } from "@/shared/ui";
import Link from "next/link";

const values = [
  {
    icon: Coffee,
    title: "Chất lượng",
    desc: "Mỗi hạt cà phê được tuyển chọn từ những vùng trồng nổi tiếng nhất thế giới.",
  },
  {
    icon: Leaf,
    title: "Bền vững",
    desc: "Cam kết canh tác bền vững và hỗ trợ nông dân địa phương.",
  },
  {
    icon: Heart,
    title: "Đam mê",
    desc: "Tình yêu cà phê được thể hiện qua từng tách cà phê hoàn hảo.",
  },
  {
    icon: MapPin,
    title: "Kết nối",
    desc: "Không gian kết nối cộng đồng yêu cà phê tại Việt Nam.",
  },
];

const stats = [
  { icon: Store, value: "10+", label: "Cửa hàng" },
  { icon: Users, value: "50K+", label: "Khách hàng" },
  { icon: Award, value: "5+", label: "Năm kinh nghiệm" },
  { icon: Bean, value: "20+", label: "Loại cà phê" },
];

const timeline = [
  { year: "2020", title: "Thành lập", desc: "Khai trương cửa hàng đầu tiên tại TP. Hồ Chí Minh với tình yêu cà phê đặc sản." },
  { year: "2021", title: "Mở rộng", desc: "Ra mắt cửa hàng thứ hai và giới thiệu dòng cà phê rang xay tại nhà." },
  { year: "2022", title: "Hợp tác quốc tế", desc: "Hợp tác trực tiếp với nông trại cà phê tại Ethiopia và Colombia." },
  { year: "2023", title: "Phát triển", desc: "Đạt 10 cửa hàng trên toàn quốc, phục vụ hơn 50,000 khách hàng." },
  { year: "2024", title: "Đổi mới", desc: "Ra mắt ứng dụng đặt hàng và chương trình khách hàng thân thiết." },
];

const origins = [
  {
    region: "Việt Nam",
    image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=1974&auto=format&fit=crop",
    note: "Đắng, đậm đà",
    desc: "Cà phê Robusta và Arabica từ cao nguyên Đà Lạt và Buôn Ma Thuột.",
  },
  {
    region: "Ethiopia",
    image: "https://images.unsplash.com/photo-1504639725590-34d0984388bd?q=80&w=1974&auto=format&fit=crop",
    note: "Hoa quả, tinh tế",
    desc: "Cà phê Yirgacheffe với hương thơm hoa cỏ và cam quýt đặc trưng.",
  },
  {
    region: "Colombia",
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefda?q=80&w=1974&auto=format&fit=crop",
    note: "Cân bằng, mượt mà",
    desc: "Cà phê từ vùng Huila với vị caramel ngọt ngào và hậu vị sô-cô-la.",
  },
];

export default function AboutPage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative h-[50vh] md:h-[60vh] min-h-[400px] flex items-center justify-center bg-text-primary overflow-hidden">
        <div
          className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=2071&auto=format&fit=crop')] bg-cover bg-center opacity-50"
        />
        <div className="absolute inset-0 bg-linear-to-t from-text-primary/80 via-text-primary/30 to-transparent" />
        <div className="relative z-10 flex flex-col items-center gap-md px-lg md:px-xl text-center">
          <span className="text-overline-inter text-brand-primary tracking-widest uppercase">
            Câu chuyện của chúng tôi
          </span>
          <h1 className="text-display-lg text-white leading-tight">
            Hành trình từ những hạt cà phê
          </h1>
          <p className="text-body-md-reg md:text-body-lg-reg text-white/80">
            Từ những vùng cao nguyên Việt Nam đến từng tách cà phê thơm ngon mỗi ngày.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-brand-primary py-2xl px-lg md:px-2xl">
        <div className="mx-auto max-w-4xl grid grid-cols-2 md:grid-cols-4 gap-lg">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center gap-sm text-white">
              <stat.icon className="size-8 text-white/80" />
              <span className="text-h1-bold text-white">{stat.value}</span>
              <span className="text-body-sm-semibold text-white/70">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Story */}
      <section className="bg-surface-main py-3xl px-lg md:px-2xl">
        <div className="mx-auto max-w-4xl flex flex-col gap-xl">
          <div className="grid md:grid-cols-2 gap-xl items-center">
            <div className="flex flex-col gap-md">
              <span className="text-overline-inter text-brand-primary tracking-widest uppercase">
                Khởi đầu
              </span>
              <h2 className="text-h2-bold text-text-primary">Verdant Amber Coffee Collective</h2>
              <p className="text-body-md-reg text-text-secondary leading-relaxed">
                Được thành lập với sứ mệnh mang đến những trải nghiệm cà phê đặc biệt,
                Verdant Amber Coffee Collective kết hợp tinh hoa cà phê thế giới với
                văn hóa cà phê Việt Nam độc đáo.
              </p>
              <p className="text-body-md-reg text-text-secondary leading-relaxed">
                Chúng tôi hợp tác trực tiếp với các nông trại cà phê tại Việt Nam,
                Ethiopia và Colombia để đảm bảo chất lượng tốt nhất từ nguồn gốc.
              </p>
            </div>
            <div className="h-[250px] md:h-[400px] rounded-md overflow-hidden">
              <div className="size-full bg-[url('https://images.unsplash.com/photo-1559525836-8171a7cb7af6?q=80&w=1974&auto=format&fit=crop')] bg-cover bg-center" />
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="bg-surface-accent py-3xl px-lg md:px-2xl">
        <div className="flex flex-col gap-2xl">
          <div className="flex flex-col items-center gap-md text-center">
            <span className="text-overline-inter text-brand-primary tracking-widest uppercase">
              Hành trình phát triển
            </span>
            <h2 className="text-h2-bold text-text-primary">Cột mốc quan trọng</h2>
          </div>

          <div className="relative ml-[15px] md:ml-[23px]">
            <div className="absolute left-[7px] top-2 bottom-2 w-px bg-surface-muted" />
            <div className="flex flex-col gap-lg">
              {timeline.map((item) => (
                <div key={item.year} className="relative flex gap-5 md:gap-8">
                  <div className="flex flex-col items-center">
                    <div className="size-[14px] rounded-full border-2 border-brand-primary bg-white flex items-center justify-center flex-shrink-0 mt-1 z-10">
                      <div className="size-[6px] rounded-full bg-brand-primary" />
                    </div>
                  </div>
                  <div className="flex flex-col gap-xs">
                    <span className="text-overline-inter text-brand-primary font-bold">{item.year}</span>
                    <h3 className="text-h4-bold text-text-primary">{item.title}</h3>
                    <p className="text-body-md-reg text-text-secondary">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Origins */}
      <section className="bg-surface-main py-3xl px-lg md:px-2xl">
        <div className="flex flex-col gap-2xl">
          <div className="flex flex-col items-center gap-md text-center">
            <span className="text-overline-inter text-brand-primary tracking-widest uppercase">
              Nguồn gốc cà phê
            </span>
            <h2 className="text-h2-bold text-text-primary">Tinh hoa từ ba miền</h2>
            <p className="text-body-md-reg text-text-secondary">
              Chúng tôi chọn lọc những hạt cà phê ngon nhất từ ba vùng trồng nổi tiếng thế giới.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-lg">
            {origins.map((origin) => (
              <div key={origin.region} className="flex flex-col rounded-md border border-surface-muted overflow-hidden bg-white">
                <div className="h-48 bg-cover bg-center" style={{ backgroundImage: `url(${origin.image})` }} />
                <div className="flex flex-col gap-sm p-lg md:p-xl">
                  <div className="flex items-center justify-between">
                    <h3 className="text-h4-bold text-text-primary">{origin.region}</h3>
                    <span className="text-body-sm-semibold text-brand-primary">{origin.note}</span>
                  </div>
                  <p className="text-body-sm-reg text-text-secondary leading-relaxed">{origin.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-surface-accent py-3xl px-lg md:px-2xl">
        <div className="flex flex-col gap-2xl items-center">
          <div className="flex flex-col items-center gap-md text-center">
            <span className="text-overline-inter text-brand-primary tracking-widest uppercase">
              Giá trị cốt lõi
            </span>
            <h2 className="text-h2-bold text-text-primary">Tại sao chọn chúng tôi?</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-lg w-full">
            {values.map((value) => (
              <div
                key={value.title}
                className="flex flex-col items-center text-center gap-md bg-white p-lg md:p-xl rounded-md border border-surface-muted"
              >
                <div className="flex size-14 items-center justify-center rounded-full bg-brand-primary/10">
                  <value.icon className="size-7 text-brand-primary" />
                </div>
                <h3 className="text-h4-bold text-text-primary">{value.title}</h3>
                <p className="text-body-sm-reg text-text-secondary leading-relaxed">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-text-primary py-3xl px-lg md:px-2xl">
        <div className="flex flex-col items-center gap-md text-center">
          <h2 className="text-h2-bold text-white">Bắt đầu hành trình của bạn</h2>
          <p className="text-body-md-reg text-white/70">
            Ghé thăm cửa hàng gần nhất và khám phá thế giới cà phê cùng Verdant.
          </p>
          <div className="flex flex-col sm:flex-row gap-md mt-md w-full sm:w-auto">
            <Link href="/locations" className="w-full sm:w-auto">
              <AppButton variant="secondary" className="rounded-full px-xl w-full sm:w-auto">
                Tìm cửa hàng
              </AppButton>
            </Link>
            <Link href="/menu" className="w-full sm:w-auto">
              <AppButton variant="primary" className="rounded-full px-xl w-full sm:w-auto">
                Xem thực đơn
              </AppButton>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
