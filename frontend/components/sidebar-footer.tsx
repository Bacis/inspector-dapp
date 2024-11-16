import {
  DropdownMenu,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenuAction,
  SidebarGroupContent,
  SidebarFooter,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  GalleryVerticalEnd,
  ChevronsUpDown,
  AudioWaveform,
  Command,
  Plus,
  Frame,
  Ellipsis,
  Folder,
  Forward,
  Trash2,
  PieChart,
  Map,
  LifeBuoy,
  Send,
  Sparkles,
  BadgeCheck,
  CreditCard,
  Bell,
  LogOut,
  ShieldAlert,
  Shield,
  EarthLock,
  Siren,
} from "lucide-react";
import Image from "next/image";

import { DropdownMenuContent } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useCustomAuth, usePrivy } from "@privy-io/react-auth";

export default function SidebarFooterContent() {
  const { user } = usePrivy();
  console.log(user);

  if (!user) {
    return null;
  }

  const { email } = user;

  return (
    <SidebarFooter>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage
                    alt="monkeydluffy"
                    src="https://dwhyltrbwlslhgcbqqxl.supabase.co/storage/v1/object/public/assets/avatar4f3f76e8-0736-46c2-9d7f-bf93ffaa753d_bdc2e5bc-e343-4924-a650-c90c2aaad696.jpeg"
                  />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    Monkey D. Luffy
                  </span>
                  <span className="truncate text-xs">
                    {email?.toString() ?? ""}
                  </span>
                </div>
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              sideOffset={4}
              className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            >
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage
                      alt="monkeydluffy"
                      src="https://dwhyltrbwlslhgcbqqxl.supabase.co/storage/v1/object/public/assets/avatar338390a7-1949-41b0-afd0-c5e9a28068b9_d6c2a74b-263a-4d57-a122-a564a1fb24ff.jpeg"
                    />
                    <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      Monkey D. Luffy
                    </span>
                    <span className="truncate text-xs">
                      monkeydluffy@pirateking.com
                    </span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <Sparkles />
                  Upgrade to Pro
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <BadgeCheck />
                  Account
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <CreditCard />
                  Billing
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Bell />
                  Notifications
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOut />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  );
}
