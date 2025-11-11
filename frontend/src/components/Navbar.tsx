import { Link, useLocation } from 'react-router';
import { Button } from '@/components/ui/button';
import {
  Music,
  LogOut,
  User,
  ShieldCheck,
  LayoutDashboard,
} from 'lucide-react';
import { useAuth } from '../features/auth';
import { ModeToggle } from '../features/theme';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

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
              {/* User dropdown menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <User className="h-4 w-4" />
                    <span className="hidden sm:inline">{user.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user.name}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard" className="cursor-pointer">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  {user.role === 'ADMIN' && (
                    <DropdownMenuItem asChild>
                      <Link to="/admin" className="cursor-pointer">
                        <ShieldCheck className="mr-2 h-4 w-4" />
                        Admin Dashboard
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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
