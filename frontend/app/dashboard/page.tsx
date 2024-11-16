import { DashboardContent } from "@/components/dashboard-content";
import { SidebarFrame } from "@/components/sidebar";
import { SidebarHeader } from "@/components/sidebar-header";

export default function DashboardPage() {
  return (
    <SidebarFrame>
      <SidebarHeader />
      <DashboardContent />
    </SidebarFrame>
  );
}
