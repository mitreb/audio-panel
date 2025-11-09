import { Link, useLocation } from 'react-router';
import { LayoutDashboard, Users, Package } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const sidebarNavItems = [
  {
    title: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    title: 'Products',
    href: '/admin/products',
    icon: Package,
  },
  {
    title: 'Users',
    href: '/admin/users',
    icon: Users,
  },
];

function AdminSidebar() {
  const location = useLocation();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex h-16 items-center px-4">
          <h2 className="text-lg font-semibold group-data-[collapsible=icon]:hidden">
            Admin Panel
          </h2>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {sidebarNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;

              return (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={isActive}>
                    <Link to={item.href}>
                      <Icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-[calc(100vh-4rem)] w-full">
        <AdminSidebar />
        <main className="flex-1 flex flex-col w-full">
          <div className="sticky top-0 z-10 flex h-16 items-center border-b bg-background px-6">
            <SidebarTrigger />
          </div>
          <div className="flex-1 w-full">
            <div className="p-6">{children}</div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
