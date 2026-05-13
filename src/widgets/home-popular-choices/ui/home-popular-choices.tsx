import { DesktopProductCard } from "@/entities/product";

const POPULAR_PRODUCTS = [
  {
    name: "Velvet Cortado",
    description: "Balanced & Nutty",
    price: "$5.25",
    slug: "velvet-cortado",
    imageUrl:
      "https://i.pinimg.com/1200x/5c/fd/93/5cfd93bf09153e97707fff073ccd309c.jpg?q=80&w=400&auto=format&fit=crop",
  },
  {
    name: "Artisan Espresso",
    description: "Dark & Intense",
    price: "$4.50",
    slug: "artisan-espresso",
    imageUrl:
      "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?q=80&w=400&auto=format&fit=crop",
  },
  {
    name: "Maple Pecan Latte",
    description: "Sweet & Toasty",
    price: "$6.50",
    slug: "maple-pecan-latte",
    imageUrl:
      "https://i.pinimg.com/736x/0f/a9/a2/0fa9a2821fb3473e720388a36105e39d.jpg?q=80&w=400&auto=format&fit=crop",
  },
  {
    name: "Cold Brew Stout",
    description: "Smooth & Bold",
    price: "$5.75",
    slug: "cold-brew-stout",
    imageUrl:
      "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?q=80&w=400&auto=format&fit=crop",
  },
];

export function HomePopularChoices() {
  return (
    <section className="px-2xl py-2xl flex flex-col items-center gap-xl">
      <div className="flex flex-col items-center gap-sm text-center max-w-[1152px]">
        <h2 className="text-h1-bold text-text-primary">Popular Choices</h2>
        <p className="text-body-lg-reg text-text-secondary">
          Voted by our community of coffee enthusiasts in the Greenwich Village
          collective.
        </p>
      </div>

      <div className="grid grid-cols-4 gap-xl w-full max-w-[1152px]">
        {POPULAR_PRODUCTS.map((product) => (
          <DesktopProductCard key={product.slug} {...product} />
        ))}
      </div>
    </section>
  );
}
