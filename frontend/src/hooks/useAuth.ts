import { useContext } from 'react';
import { AuthContextInstance } from '../contexts/AuthContext';
import type { AuthContext } from '../types/auth';

export function useAuth(): AuthContext {
  const context = useContext(AuthContextInstance);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
