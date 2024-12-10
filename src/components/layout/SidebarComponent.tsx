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
} from "@/components/ui/sidebar";

export interface SidebarProps {
  applicationTabTitle: string;
  links: {
    title: string;
    url: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  }[];
  locale: string;
}

export default function SidebarComponent({ applicationTabTitle, links, locale }: SidebarProps) {
    return (
        <Sidebar>
            <SidebarContent>
                <SidebarGroup>
                <SidebarGroupLabel>{ applicationTabTitle }</SidebarGroupLabel>
                <SidebarGroupContent>
                    <SidebarMenu>
                    {links.map((item) => (
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