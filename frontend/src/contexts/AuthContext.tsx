import { createContext, useEffect, useState } from 'react';
import { AuthService } from '../services/authService';
import type {
  User,
  LoginCredentials,
  RegisterData,
  AuthContext,
} from '../types/auth';

const AuthContextInstance = createContext<AuthContext | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check authentication on app load
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      setIsLoading(true);
      const currentUser = await AuthService.checkAuth();
      setUser(currentUser);
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials: LoginCredentials) => {
    const response = await AuthService.login(credentials);
    setUser(response.user);
  };

  const register = async (data: RegisterData) => {
    const response = await AuthService.register(data);
    setUser(response.user);
  };

  const logout = async () => {
    await AuthService.logout();
    setUser(null);
  };

  const value: AuthContext = {
    user,
    isLoading,
    login,
    register,
    logout,
  };

  return (
    <AuthContextInstance.Provider value={value}>
      {children}
    </AuthContextInstance.Provider>
  );
}

export { AuthContextInstance };
