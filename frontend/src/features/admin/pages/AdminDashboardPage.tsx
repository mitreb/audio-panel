import { useAdminStats } from '../hooks';
import { Users, Package } from 'lucide-react';
import { StatsCard, RecentProducts } from '../components/dashboard';
import { PageLoader } from '@/components/page-loader';

export function AdminDashboardPage() {
  const { data: stats, isLoading, error } = useAdminStats();

  if (isLoading) {
    return <PageLoader />;
  }

  if (error) {
    return (
      <div className="text-destructive text-center">
        Failed to load dashboard statistics
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Admin Dashboard</h2>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <StatsCard
          title="Total Users"
          value={stats?.totalUsers}
          description="Registered users in the system"
          icon={Users}
        />
        <StatsCard
          title="Total Products"
          value={stats?.totalProducts}
          description="Music products in the catalog"
          icon={Package}
        />
      </div>

      {/* Recent Products */}
      <RecentProducts products={stats?.recentProducts} />
    </div>
  );
}
