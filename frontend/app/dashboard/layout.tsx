import { SidebarFrame } from "@/components/sidebar";
import { SidebarHeader } from "@/components/sidebar-header";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  // Assuming decodedScreenshots is fetched from an API or passed as prop
  // If fetching data, consider moving it to a separate component
  return (
    <div className="min-h-screen">
      <SidebarFrame>
        <SidebarHeader />
        {children}
      </SidebarFrame>
    </div>
  );
}
