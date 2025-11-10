import { Link, useLocation } from 'react-router';
import { Button } from '@/components/ui/button';
import { Music, LogOut, User, ShieldCheck } from 'lucide-react';
import { useAuth } from '../features/auth';
import { ModeToggle } from '../features/theme';

export function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const isLandingPage = location.pathname === '/';

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <nav
      className={`sticky top-0 z-50 ${
        isLandingPage
          ? 'bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60'
          : 'bg-card border-b'
      }`}
    >
      <div className="flex h-16 items-center px-4 sm:px-6 max-w-7xl mx-auto">
        {/* Logo section on the left */}
        <Link
          to="/"
          className="flex items-center space-x-2 hover:opacity-80 transition-opacity text-primary"
        >
          <Music className="h-5 w-5 sm:h-6 sm:w-6" />
          <span className="text-base sm:text-lg font-semibold">
            Audio Panel
          </span>
        </Link>

        {/* Spacer to push content to the right */}
        <div className="flex-1" />

        {/* Right side navigation */}
        <div className="flex items-center gap-2 sm:gap-4">
          {user ? (
            <>
              {/* Admin link for admin users */}
              {user.role === 'ADMIN' && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="hidden sm:flex"
                  >
                    <Link to="/admin">
                      <ShieldCheck className="mr-2 h-4 w-4" />
                      Admin
                    </Link>
                  </Button>
                  {/* Mobile admin button - icon only */}
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="sm:hidden"
                  >
                    <Link to="/admin">
                      <ShieldCheck className="h-4 w-4" />
                    </Link>
                  </Button>
                  <div className="h-6 w-px bg-border hidden sm:block" />
                </>
              )}

              {/* User info and logout */}
              <div className="flex items-center gap-2">
                {/* Desktop user button */}
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="hidden sm:flex"
                >
                  <Link to="/dashboard" className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span>{user.name}</span>
                  </Link>
                </Button>
                {/* Mobile user button - icon only */}
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="sm:hidden"
                >
                  <Link to="/dashboard">
                    <User className="h-4 w-4" />
                  </Link>
                </Button>

                {/* Desktop logout button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="hidden sm:flex"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
                {/* Mobile logout button - icon only */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="sm:hidden"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </>
          ) : (
            <>
              {/* Login and Register buttons for non-authenticated users */}
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link to="/login">Sign In</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link to="/register">Sign Up</Link>
                </Button>
              </div>
            </>
          )}

          {/* Dark mode toggle */}
          <div className="h-6 w-px bg-border hidden sm:block" />
          <ModeToggle />
        </div>
      </div>
    </nav>
  );
}
