import { BrowserRouter, Routes, Route, useLocation } from 'react-router';
import { LandingPage, NotFoundPage } from './pages';
import {
  LoginPage,
  RegisterPage,
  AuthProvider,
  ProtectedRoute,
  RedirectIfAuthenticated,
} from './features/auth';
import {
  CreateProductPage,
  UpdateProductPage,
  UserProductsPage,
} from './features/products';
import {
  AdminRoute,
  AdminDashboardPage,
  AdminUsersPage,
  AdminProductsPage,
} from './features/admin';
import { Navbar } from './components';
import { ThemeProvider } from './components/ThemeProvider';

function AppContent() {
  const location = useLocation();
  const isLandingPage = location.pathname === '/';

  return (
    <div
      className={`min-h-screen ${
        isLandingPage ? 'bg-background' : 'bg-muted/30'
      }`}
    >
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            <RedirectIfAuthenticated>
              <LandingPage />
            </RedirectIfAuthenticated>
          }
        />
        <Route
          path="/create"
          element={
            <ProtectedRoute>
              <CreateProductPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/update/:id"
          element={
            <ProtectedRoute>
              <UpdateProductPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <UserProductsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/login"
          element={
            <RedirectIfAuthenticated>
              <LoginPage />
            </RedirectIfAuthenticated>
          }
        />
        <Route
          path="/register"
          element={
            <RedirectIfAuthenticated>
              <RegisterPage />
            </RedirectIfAuthenticated>
          }
        />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboardPage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <AdminRoute>
              <AdminUsersPage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/products"
          element={
            <AdminRoute>
              <AdminProductsPage />
            </AdminRoute>
          }
        />
        {/* 404 Page - explicit route */}
        <Route path="/404" element={<NotFoundPage />} />
        {/* Catch-all route for 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <AuthProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
