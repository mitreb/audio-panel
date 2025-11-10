// Contexts
export { AuthProvider, AuthContextInstance } from './contexts/AuthContext';

// Hooks
export { useAuth } from './hooks/useAuth';

// Components
export { ProtectedRoute } from './components/ProtectedRoute';
export { RedirectIfAuthenticated } from './components/RedirectIfAuthenticated';

// Pages
export { LoginPage } from './pages/LoginPage';
export { RegisterPage } from './pages/RegisterPage';

// Types
export type {
  User,
  LoginCredentials,
  RegisterData,
  AuthContext,
} from './types/auth.types';

// Services
export { AuthService } from './services/auth.service';
