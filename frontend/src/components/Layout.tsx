import { Link, useRouter } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  LayoutDashboard,
  BookOpen,
  Bell,
  Settings,
  LogIn,
  LogOut,
  Menu,
  Heart,
  CalendarDays,
  HeartHandshake,
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const navLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, authRequired: true },
  { to: '/log', label: 'Cycle Log', icon: CalendarDays, authRequired: true },
  { to: '/reminders', label: 'Reminders', icon: Bell, authRequired: true },
  { to: '/intimacy', label: 'Intimacy', icon: HeartHandshake, authRequired: true },
  { to: '/education', label: 'Learn', icon: BookOpen, authRequired: false },
  { to: '/settings', label: 'Settings', icon: Settings, authRequired: true },
];

export default function Layout({ children }: LayoutProps) {
  const { identity, login, clear, loginStatus } = useInternetIdentity();
  const queryClient = useQueryClient();
  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === 'logging-in';
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();
  const currentPath = router.state.location.pathname;

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
    } else {
      try {
        await login();
      } catch (error: unknown) {
        if (error instanceof Error && error.message === 'User is already authenticated') {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  const visibleLinks = navLinks.filter(l => !l.authRequired || isAuthenticated);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/90 backdrop-blur-md border-b border-border shadow-xs">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <img
              src="/assets/generated/app-icon.dim_128x128.png"
              alt="CycleTrack"
              className="w-8 h-8 rounded-xl object-cover"
            />
            <span className="font-serif font-semibold text-xl text-foreground tracking-tight">
              CycleTrack
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {visibleLinks.map(({ to, label, icon: Icon }) => {
              const isActive = currentPath === to;
              return (
                <Link
                  key={to}
                  to={to}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              );
            })}
          </nav>

          {/* Auth Button */}
          <div className="flex items-center gap-2">
            <Button
              onClick={handleAuth}
              disabled={isLoggingIn}
              variant={isAuthenticated ? 'outline' : 'default'}
              size="sm"
              className="hidden md:flex items-center gap-1.5"
            >
              {isLoggingIn ? (
                <span className="animate-pulse-soft">Logging in…</span>
              ) : isAuthenticated ? (
                <>
                  <LogOut className="w-4 h-4" />
                  Logout
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  Login
                </>
              )}
            </Button>

            {/* Mobile Menu */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72 bg-card">
                <div className="flex flex-col gap-2 mt-8">
                  {visibleLinks.map(({ to, label, icon: Icon }) => {
                    const isActive = currentPath === to;
                    return (
                      <Link
                        key={to}
                        to={to}
                        onClick={() => setMobileOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                          isActive
                            ? 'bg-primary/10 text-primary'
                            : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        {label}
                      </Link>
                    );
                  })}
                  <div className="mt-4 pt-4 border-t border-border">
                    <Button
                      onClick={() => { handleAuth(); setMobileOpen(false); }}
                      disabled={isLoggingIn}
                      variant={isAuthenticated ? 'outline' : 'default'}
                      className="w-full"
                    >
                      {isLoggingIn ? 'Logging in…' : isAuthenticated ? 'Logout' : 'Login'}
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card mt-auto">
        <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <img
              src="/assets/generated/app-icon.dim_128x128.png"
              alt=""
              className="w-5 h-5 rounded-md object-cover opacity-70"
            />
            <span>© {new Date().getFullYear()} CycleTrack. Your health, your data.</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/education" className="hover:text-foreground transition-colors">Learn</Link>
            <Link to="/settings" className="hover:text-foreground transition-colors">Privacy</Link>
            <span className="flex items-center gap-1">
              Built with <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500 mx-0.5" /> using{' '}
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== 'undefined' ? window.location.hostname : 'cycletrack')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline font-medium"
              >
                caffeine.ai
              </a>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
