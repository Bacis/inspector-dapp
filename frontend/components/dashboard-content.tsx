import Image from "next/image";
import { Card } from "./ui/card";

interface DashboardContentProps {
  screenshots?: string[];
}

export function DashboardContent({ screenshots = [] }: DashboardContentProps) {
  return (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-bold">OCR Results</h2>
      <div className="grid gap-4">
        {screenshots.map((screenshot, index) => {
          console.log(screenshot);
          return (
            <Card key={index} className="p-4">
              <div className="relative w-full aspect-video">
                <Image
                  src={screenshot}
                  alt={`Screenshot ${index + 1}`}
                  fill
                  className="object-contain"
                  priority={index === 0}
                  unoptimized
                />
              </div>
            </Card>
          );
        })}
        {screenshots.length === 0 && (
          <p className="text-muted-foreground">No OCR data available</p>
        )}
      </div>
    </div>
  );
}
