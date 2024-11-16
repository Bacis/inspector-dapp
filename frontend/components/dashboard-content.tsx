import { RadialChart } from "@/components/charts/radial";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { AlertTriangle, ShieldAlert } from "lucide-react";
import Image from "next/image";
import { RadialBarChart } from "recharts";

export function DashboardContent() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <div className="aspect-video rounded-xl flex flex-row items-center justify-center gap-6">
          <div>
            <AlertTriangle size={24} className="text-red-900" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold">321</h2>
            <h3 className="text-sm text-muted-foreground">
              Total Fraudolent Interactions
            </h3>
          </div>
        </div>
        <div className="aspect-video rounded-xl bg-muted/50" />
        <div className="aspect-video rounded-xl bg-muted/50" />
      </div>
      <div className="min-h-[900px] rounded-xl md:min-h-min flex flex-col gap-4">
        <h3 className="font-semibold text-xl">Fraudolent Interactions</h3>
        <div className="bg-secondary rounded-xl flex max-w-xs flex-col justify-center items-center p-6 gap-4">
          <ShieldAlert size={16} className="text-red-900" />
          <h5>Alert</h5>
          <AspectRatio ratio={1.77} className="bg-muted">
            <Image
              alt="Image"
              src="/images/placeholder.png"
              fill
              className="rounded-md"
            />
          </AspectRatio>
        </div>
      </div>
    </div>
  );
}
