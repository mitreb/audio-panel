export interface AdminStats {
  totalUsers: number;
  totalProducts: number;
  recentProducts: Array<{
    id: string;
    name: string;
    artist: string;
    coverImage: string | null;
    createdAt: string;
    user: {
      name: string;
      email: string;
    };
  }>;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'USER' | 'ADMIN';
  createdAt: string;
  _count: {
    products: number;
  };
}

export interface AdminProduct {
  id: string;
  name: string;
  artist: string;
  coverImage: string | null;
  createdAt: string;
  updatedAt: string;
  userId: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}
