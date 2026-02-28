import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { LogIn, CalendarDays, Bell, BookOpen, Shield } from 'lucide-react';

const features = [
  {
    icon: CalendarDays,
    title: 'Cycle Tracking',
    description: 'Log your periods and visualize your cycle phases on a beautiful color-coded calendar.',
    color: 'text-rose-600 bg-rose-500/10',
  },
  {
    icon: Bell,
    title: 'Smart Reminders',
    description: 'Get notified about upcoming periods, fertile windows, and ovulation days.',
    color: 'text-amber-600 bg-amber-400/10',
  },
  {
    icon: BookOpen,
    title: 'Educational Resources',
    description: 'Learn about your reproductive health with accurate, science-based content.',
    color: 'text-emerald-600 bg-emerald-500/10',
  },
  {
    icon: Shield,
    title: 'Private & Secure',
    description: 'Your data lives on the blockchain — only you can access it. No third-party sharing.',
    color: 'text-violet-600 bg-violet-400/10',
  },
];

export default function LandingPage() {
  const { login, loginStatus, identity } = useInternetIdentity();
  const navigate = useNavigate();
  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === 'logging-in';

  const handleGetStarted = async () => {
    if (isAuthenticated) {
      navigate({ to: '/dashboard' });
    } else {
      try {
        await login();
      } catch (error: unknown) {
        if (error instanceof Error && error.message === 'User is already authenticated') {
          navigate({ to: '/dashboard' });
        }
      }
    }
  };

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 via-background to-violet-400/5 pointer-events-none" />
        <div className="max-w-6xl mx-auto px-4 py-16 md:py-24 flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1 text-center md:text-left animate-fade-in">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-soft" />
              Your reproductive health companion
            </div>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-4">
              Track your cycle,{' '}
              <span className="text-primary">understand your body</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-lg mx-auto md:mx-0">
              CycleTrack helps you monitor your menstrual cycle, predict fertile windows, and make informed decisions about your reproductive health — all with complete privacy.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
              <Button
                size="lg"
                onClick={handleGetStarted}
                disabled={isLoggingIn}
                className="rounded-2xl px-8 shadow-bloom"
              >
                {isLoggingIn ? (
                  <span className="animate-pulse-soft">Logging in…</span>
                ) : isAuthenticated ? (
                  'Go to Dashboard'
                ) : (
                  <>
                    <LogIn className="w-4 h-4 mr-2" />
                    Get Started Free
                  </>
                )}
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate({ to: '/education' })}
                className="rounded-2xl px-8"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Learn More
              </Button>
            </div>
          </div>
          <div className="flex-1 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-rose-500/20 to-violet-400/20 rounded-3xl blur-2xl" />
              <img
                src="/assets/generated/hero-bloom.dim_800x400.png"
                alt="CycleTrack illustration"
                className="relative rounded-3xl shadow-bloom max-w-sm w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl font-bold text-foreground mb-3">Everything you need</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            A complete toolkit for understanding and tracking your reproductive health.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map(({ icon: Icon, title, description, color }) => (
            <div key={title} className="bg-card rounded-2xl border border-border p-5 shadow-xs hover:shadow-soft transition-shadow">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-sm text-foreground mb-2">{title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary/5 border-y border-primary/10">
        <div className="max-w-6xl mx-auto px-4 py-14 text-center">
          <h2 className="font-serif text-3xl font-bold text-foreground mb-3">
            Ready to understand your cycle?
          </h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Join CycleTrack today. Your data stays private, on-chain, and always yours.
          </p>
          <Button
            size="lg"
            onClick={handleGetStarted}
            disabled={isLoggingIn}
            className="rounded-2xl px-10 shadow-bloom"
          >
            {isLoggingIn ? 'Logging in…' : isAuthenticated ? 'Go to Dashboard' : 'Start Tracking Free'}
          </Button>
        </div>
      </section>
    </div>
  );
}
