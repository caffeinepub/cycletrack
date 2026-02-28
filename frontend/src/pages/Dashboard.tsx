import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile, useGetCycleEntries, useGetCurrentCycleDay, useGetPreferences } from '../hooks/useQueries';
import ProfileSetupModal from '../components/ProfileSetupModal';
import CycleCalendar from '../components/CycleCalendar';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { CalendarDays, Bell, Plus, TrendingUp } from 'lucide-react';
import { calculateUpcomingEvents, nanosecondsToDate, formatDateShort } from '../lib/cycleUtils';
import { FertilityPhase } from '../backend';
import { useGetFertilityPhases } from '../hooks/useQueries';

export default function Dashboard() {
  const { identity } = useInternetIdentity();
  const navigate = useNavigate();
  const isAuthenticated = !!identity;

  const { data: userProfile, isLoading: profileLoading, isFetched: profileFetched } = useGetCallerUserProfile();
  const { data: cycleEntries = [], isLoading: entriesLoading } = useGetCycleEntries();
  const { data: currentCycleDay, isLoading: dayLoading } = useGetCurrentCycleDay();
  const { data: preferences, isLoading: prefsLoading } = useGetPreferences();

  const cycleDayNum = currentCycleDay ? Number(currentCycleDay) : 1;
  const { data: fertilityPhases = [] } = useGetFertilityPhases(BigInt(cycleDayNum));

  const showProfileSetup = isAuthenticated && !profileLoading && profileFetched && userProfile === null;

  if (!isAuthenticated) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <CalendarDays className="w-8 h-8 text-primary" />
        </div>
        <h2 className="font-serif text-2xl font-bold mb-2">Sign in to view your dashboard</h2>
        <p className="text-muted-foreground mb-6">Track your cycle and understand your body better.</p>
        <Button onClick={() => navigate({ to: '/' })} className="rounded-xl">
          Go to Home
        </Button>
      </div>
    );
  }

  const isLoading = profileLoading || entriesLoading || dayLoading || prefsLoading;
  const upcomingEvents = calculateUpcomingEvents(cycleEntries, preferences ?? null);
  const nextEvent = upcomingEvents[0];

  // Determine current phase label
  const currentPhaseResult = fertilityPhases.find(p => Number(p.dayInCycle) === cycleDayNum);
  const phaseLabels: Record<string, { label: string; color: string; bg: string }> = {
    [FertilityPhase.menstrual]: { label: 'Menstrual Phase', color: 'text-rose-600', bg: 'bg-rose-500/10' },
    [FertilityPhase.follicular]: { label: 'Follicular Phase', color: 'text-amber-600', bg: 'bg-amber-400/10' },
    [FertilityPhase.ovulation]: { label: 'Ovulation', color: 'text-emerald-600', bg: 'bg-emerald-500/10' },
    [FertilityPhase.luteal]: { label: 'Luteal Phase', color: 'text-violet-600', bg: 'bg-violet-400/10' },
  };
  const phaseInfo = currentPhaseResult
    ? phaseLabels[currentPhaseResult.phase as string] ?? { label: 'Tracking', color: 'text-primary', bg: 'bg-primary/10' }
    : { label: 'Start Tracking', color: 'text-primary', bg: 'bg-primary/10' };

  const latestEntry = cycleEntries.length > 0
    ? [...cycleEntries].sort((a, b) => Number(b.startDate - a.startDate))[0]
    : null;

  return (
    <>
      <ProfileSetupModal open={showProfileSetup} />

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 animate-fade-in">
        {/* Welcome Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl font-bold text-foreground">
              {userProfile ? `Hello, ${userProfile.name} 🌸` : 'Your Dashboard'}
            </h1>
            <p className="text-muted-foreground mt-1">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <Button
            onClick={() => navigate({ to: '/log' })}
            className="rounded-xl flex-shrink-0"
            size="sm"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Log Period
          </Button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Current Cycle Day */}
          <div className="bg-card rounded-2xl border border-border p-4 shadow-xs">
            {isLoading ? (
              <Skeleton className="h-16 w-full rounded-xl" />
            ) : (
              <>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Cycle Day</p>
                <p className="font-serif text-4xl font-bold text-foreground mt-1">{cycleDayNum}</p>
                <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium mt-2 ${phaseInfo.bg} ${phaseInfo.color}`}>
                  {phaseInfo.label}
                </div>
              </>
            )}
          </div>

          {/* Next Period */}
          <div className="bg-card rounded-2xl border border-border p-4 shadow-xs">
            {isLoading ? (
              <Skeleton className="h-16 w-full rounded-xl" />
            ) : (
              <>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Next Period</p>
                {nextEvent && nextEvent.type === 'period' ? (
                  <>
                    <p className="font-serif text-4xl font-bold text-foreground mt-1">{nextEvent.daysUntil}</p>
                    <p className="text-xs text-muted-foreground mt-2">days away</p>
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground mt-2">Log a cycle to predict</p>
                )}
              </>
            )}
          </div>

          {/* Cycle Length */}
          <div className="bg-card rounded-2xl border border-border p-4 shadow-xs">
            {isLoading ? (
              <Skeleton className="h-16 w-full rounded-xl" />
            ) : (
              <>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Cycle Length</p>
                <p className="font-serif text-4xl font-bold text-foreground mt-1">
                  {preferences ? Number(preferences.preferredCycleLength) : 28}
                </p>
                <p className="text-xs text-muted-foreground mt-2">days</p>
              </>
            )}
          </div>

          {/* Cycles Logged */}
          <div className="bg-card rounded-2xl border border-border p-4 shadow-xs">
            {isLoading ? (
              <Skeleton className="h-16 w-full rounded-xl" />
            ) : (
              <>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Cycles Logged</p>
                <p className="font-serif text-4xl font-bold text-foreground mt-1">{cycleEntries.length}</p>
                <p className="text-xs text-muted-foreground mt-2">total entries</p>
              </>
            )}
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar - takes 2 cols */}
          <div className="lg:col-span-2">
            {isLoading ? (
              <Skeleton className="h-80 w-full rounded-2xl" />
            ) : (
              <CycleCalendar entries={cycleEntries} preferences={preferences ?? null} />
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Upcoming Events */}
            <div className="bg-card rounded-2xl border border-border p-4 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-sm text-foreground">Upcoming</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs rounded-lg"
                  onClick={() => navigate({ to: '/reminders' })}
                >
                  <Bell className="w-3.5 h-3.5 mr-1" />
                  All
                </Button>
              </div>
              {isLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-14 w-full rounded-xl" />
                  <Skeleton className="h-14 w-full rounded-xl" />
                </div>
              ) : upcomingEvents.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Log a cycle to see upcoming events.
                </p>
              ) : (
                <div className="space-y-2">
                  {upcomingEvents.slice(0, 3).map((event, i) => (
                    <div key={i} className="flex items-center justify-between p-2.5 rounded-xl bg-secondary/50">
                      <div>
                        <p className="text-xs font-medium text-foreground">{event.label}</p>
                        <p className="text-xs text-muted-foreground">{formatDateShort(event.date)}</p>
                      </div>
                      <span className="text-sm font-bold text-foreground font-serif">{event.daysUntil}d</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Last Period */}
            {latestEntry && (
              <div className="bg-card rounded-2xl border border-border p-4 shadow-xs">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  <h3 className="font-semibold text-sm text-foreground">Last Period</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Started {formatDateShort(nanosecondsToDate(latestEntry.startDate))}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Duration: {Number(latestEntry.cycleLength)} days
                </p>
              </div>
            )}

            {/* Quick Actions */}
            {cycleEntries.length === 0 && !isLoading && (
              <div className="bg-primary/5 rounded-2xl border border-primary/15 p-4">
                <p className="text-sm font-medium text-foreground mb-2">Get started</p>
                <p className="text-xs text-muted-foreground mb-3">
                  Log your first period to unlock cycle predictions and fertility tracking.
                </p>
                <Button
                  size="sm"
                  className="w-full rounded-xl"
                  onClick={() => navigate({ to: '/log' })}
                >
                  <Plus className="w-3.5 h-3.5 mr-1.5" />
                  Log First Period
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
