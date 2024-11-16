"use client";

import { DashboardContent } from "@/components/dashboard-content";
import { Switch } from "@/components/ui/switch";
import { useOCRPolling } from "@/hooks/use-ocr-polling";
import { useEffect, useState } from "react";
import { Eye, EyeClosed, EyeOff } from "lucide-react";

export default function DashboardBody() {
  const [isEnabled, setIsEnabled] = useState(false);
  const { data, error, isLoading } = useOCRPolling(isEnabled);
  const [decodedScreenshots, setDecodedScreenshots] = useState<string[]>([]);

  function handleSwitchChange(checked: boolean) {
    setIsEnabled(checked);
  }

  useEffect(() => {
    if (data?.suspicious) {
      setDecodedScreenshots((prev) => [...prev, data.screenshot]);
    }
  }, [data]);

  return (
    <>
      <div className="ml-6 mt-2 space-y-2">
        <div className="flex items-center gap-2">
          <div className="transition-opacity duration-300">
            {isEnabled ? (
              <Eye className="h-5 w-5 text-primary animate-in fade-in" />
            ) : (
              <EyeClosed className="h-5 w-5 text-muted-foreground animate-in fade-in" />
            )}
          </div>
          <Switch checked={isEnabled} onCheckedChange={handleSwitchChange} />
        </div>
        {isLoading && (
          <p className="text-sm text-muted-foreground">Scanning...</p>
        )}
        {error && <p className="text-sm text-red-500">Error: {error}</p>}
      </div>
      <DashboardContent screenshots={decodedScreenshots} />
    </>
  );
}
