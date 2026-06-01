import { MoveRight } from "lucide-react";
import { AppButton } from "@/shared/ui";

export function HomeRituals() {
  return (
    <section className="px-2xl py-2xl bg-gradient-to-b from-text-primary/10 via-text-primary/5 to-transparent">
      <div className="flex justify-between items-end mb-xl">
        <div className="flex flex-col gap-sm">
          <span className="text-overline-inter text-brand-primary uppercase tracking-[0.2em] font-bold">
            The Experience
          </span>
          <h2 className="text-h1-bold text-text-primary">Seasonal Rituals</h2>
        </div>
        <AppButton
          variant="outline"
          className="h-[80px] px-xl border-text-primary text-text-primary rounded-none hover:bg-text-primary hover:text-inverse-text transition-all">
          Explore All Traditions
        </AppButton>
      </div>

      <div className="grid grid-cols-12 grid-rows-2 gap-lg h-[700px]">
        {/* Large Main Card */}
        <div className="col-span-6 row-span-2 relative group overflow-hidden rounded-lg bg-surface-inverse">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center transition-transform duration-700 group-hover:scale-110 opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          <div className="absolute bottom-xl left-xl flex flex-col gap-lg max-w-[404px]">
            <span className="bg-white/20 backdrop-blur-md px-md py-1 rounded-full text-overline text-inverse-text w-fit uppercase">
              MEMBER EXCLUSIVE
            </span>
            <h3 className="text-display-md text-inverse-text leading-tight">
              Sunrise Cupping Sessions
            </h3>
            <p className="text-body-md-reg text-inverse-text opacity-80">
              Join our lead roasters every Saturday at 7AM for an intimate
              journey through three distinct origins.
            </p>
            <AppButton variant="secondary" className="w-fit">
              RESERVE A SEAT
            </AppButton>
          </div>
        </div>

        {/* Top Right Card */}
        <div className="col-span-6 row-span-1 bg-surface-muted rounded-lg p-xl flex gap-xl items-center group relative overflow-hidden">
          <div className="flex flex-col gap-lg flex-1 relative z-10">
            <h3 className="text-h3-bold text-text-primary">
              Sustainable Grounds
            </h3>
            <p className="text-body-sm-reg text-text-secondary max-w-[308px]">
              Bring your own vessel and receive a complimentary &apos;Greenwich&apos; mini
              croissant.
            </p>
            <div className="flex items-center gap-sm text-brand-primary font-bold cursor-pointer group/link">
              Every Wednesday
              <MoveRight className="size-5 transition-transform group-hover/link:translate-x-1" />
            </div>
          </div>

          <div className="size-[128px] rounded-md overflow-hidden relative z-10 shadow-lg">
            <img
              src="https://i.pinimg.com/736x/22/a9/09/22a90992ea777480055a391a5574b65e.jpg?q=80&w=400&auto=format&fit=crop"
              alt="Coffee beans"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Bottom Right Cards - Subgrid */}
        <div className="col-span-3 row-span-1 bg-brand-primary rounded-lg p-xl flex flex-col justify-between group cursor-pointer hover:bg-brand-accent transition-colors">
          <h3 className="text-h3-bold text-inverse-text">
            The Collective Journal
          </h3>
          <div className="flex flex-col gap-lg">
            <p className="text-body-sm-reg text-inverse-text opacity-80">
              Issue #04: The High Altitude Harvest
            </p>
            <div className="flex items-center gap-sm text-inverse-text font-bold">
              Read Issue
              <MoveRight className="size-5 transition-transform group-hover:translate-x-1" />
            </div>
          </div>
        </div>

        <div className="col-span-3 row-span-1 bg-text-primary rounded-lg p-xl flex flex-col justify-between group cursor-pointer hover:bg-black transition-colors">
          <h3 className="text-h3-bold text-inverse-text">
            Flash Cold Brew Subscription
          </h3>
          <div className="flex flex-col gap-1">
            <span className="text-overline text-text-muted">STARTING AT</span>
            <span className="text-display-md text-inverse-text font-extrabold leading-none">
              $24/mo
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
