import Link from "next/link";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Image from "next/image";

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
          <SidebarGroupLabel>{applicationTabTitle}</SidebarGroupLabel>
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
      <SidebarFooter>
        <SidebarGroup>
          <SidebarGroupLabel>Language</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {locale === "en" && (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link href="/de" className="flex items-center gap-2">
                      <Image
                        src="/static/flags/de.png"
                        alt="German Flag"
                        width={24}
                        height={24}
                        className="rounded-full object-cover"
                      />
                      <span>Switch to German</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
              {locale === "de" && (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link href="/en" className="flex items-center gap-2">
                      <Image
                        src="/static/flags/en.png"
                        alt="English Flag"
                        width={24}
                        height={24}
                        className="rounded-full object-cover"
                      />
                      <span>Switch to English</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarFooter>
    </Sidebar>
  );
}