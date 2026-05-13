import { MapPin } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/ui/card";

export function DesktopDestination() {
  return (
    <Card className="bg-surface-accent border border-border-primary-50 shadow-none rounded-md">
      <CardHeader>
        <CardTitle className="text-body-sm-reg text-text-secondary uppercase tracking-widest font-bold flex gap-sm items-center">
          <MapPin className="size-6 text-brand-primary" /> DESTINATION
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-1 w-full ">
          <p className="text-h4-bold text-text-primary w-full">
            4822 Birchwood Avenue, Apt 4C Seattle, WA 98101
          </p>
          <span className="text-body-sm-semibold text-text-muted">
            Gate Code: 1234 • Leave at Door
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
