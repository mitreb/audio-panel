import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AdminSidebar } from './AdminSidebar';

interface AdminLayoutProps {
  children: React.ReactNode;
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
