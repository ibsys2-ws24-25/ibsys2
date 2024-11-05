import { Calendar, Home, Inbox, Search, Settings } from "lucide-react"
import Link from "next/link";
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"


const items = [
    {
      title: "Home",
      url: "/",
      icon: Home,
    },
    {
      title: "Bill of Materials",
      url: "/bill-of-materials",
      icon: Search,
    },
    {
      title: "Periods",
      url: "/periods",
      icon: Calendar,
    },
    {
      title: "Reports",
      url: "/reports",
      icon: Inbox,
    },
    {
      title: "Settings",
      url: "/settings",
      icon: Settings,
    },
]
  
  

export default function SidebarComponent() {
    return (
        <Sidebar>
            <SidebarContent>
                <SidebarGroup>
                <SidebarGroupLabel>Application</SidebarGroupLabel>
                <SidebarGroupContent>
                    <SidebarMenu>
                    {items.map((item) => (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton asChild>
                                <Link href={item.url}>
                                    <item.icon />
                                    <span>{item.title}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                    </SidebarMenu>
                </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    );
}