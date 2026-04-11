import { MapPin, Play } from "lucide-react";
import { AppButton } from "@/shared/ui";

export function HomeHero() {
  return (
    <section className="px-2xl py-2xl flex items-center justify-between min-h-[900px] gap-2xl">
      <div className="flex-1 flex flex-col gap-xl max-w-[608px]">
        <div className="flex items-center gap-sm">
          <MapPin className="size-6 text-text-secondary" />
          <span className="text-body-md-bold text-text-secondary uppercase">
            GREENWICH VILLAGE, NY
          </span>
        </div>

        <h1 className="text-display-lg text-text-primary leading-[1.1]">
          The Honey-Oak
          <br />
          Flat White
        </h1>

        <p className="text-body-lg-reg text-text-secondary">
          A curated micro-lot blend finished with cold pressed wildflower honey
          and toasted oak infused milk. The morning ritual, redefined.
        </p>

        <div className="flex items-center gap-md">
          <AppButton variant="primary">CUSTOMIZE YOURS</AppButton>
          <AppButton variant="outline" className="gap-sm">
            <Play className="size-5 fill-text-primary" />
            The Brewing Story
          </AppButton>
        </div>
      </div>

      <div className="flex-1 relative max-w-[608px] h-[730px]">
        <div className="w-full h-full rounded-lg bg-surface-muted overflow-hidden">
          {/* Placeholder for actual image */}
          <div className="w-full h-full bg-[url('https://i.pinimg.com/736x/ee/f2/37/eef23753ef5ce2b33148cb628aa9d443.jpg?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center" />
        </div>

        {/* Info Card Overlay */}
        <div className="absolute bottom-md left-md bg-white/20 backdrop-blur-lg border border-white/30 rounded-md p-md w-[307px] shadow-lg">
          <h3 className="text-h4-bold text-text-inverse mb-sm">
            Estate Series No. 24
          </h3>
          <p className="text-body-sm-reg text-text-inverse opacity-80">
            Single-origin beans from the Sidama region, Ethiopia. Roasted in
            small batches every Tuesday.
          </p>
        </div>
      </div>
    </section>
  );
}
