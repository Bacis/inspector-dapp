"use client";

import { DashboardContent } from "@/components/dashboard-content";
import { SidebarFrame } from "@/components/sidebar";
import { SidebarHeader } from "@/components/sidebar-header";
import { Switch } from "@/components/ui/switch";
import { useOCRPolling } from "@/hooks/use-ocr-polling";
import { useState } from "react";

export default function DashboardPage() {
  const [isEnabled, setIsEnabled] = useState(false);
  const { data, error, isLoading } = useOCRPolling(isEnabled);

  function handleSwitchChange(checked: boolean) {
    setIsEnabled(checked);
  }

  return (
    <SidebarFrame>
      <SidebarHeader />
      <div className="ml-6 mt-2 space-y-2">
        <div className="flex items-center gap-2">
          <Switch checked={isEnabled} onCheckedChange={handleSwitchChange} />
          <span className="text-sm text-muted-foreground">
            {isEnabled ? "OCR Scanning Active" : "OCR Scanning Inactive"}
          </span>
        </div>
        {isLoading && (
          <p className="text-sm text-muted-foreground">Scanning...</p>
        )}
        {error && <p className="text-sm text-red-500">Error: {error}</p>}
      </div>
      <DashboardContent ocrData={data} />
    </SidebarFrame>
  );
}
