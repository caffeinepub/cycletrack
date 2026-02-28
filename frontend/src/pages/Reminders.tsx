import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCycleEntries, useGetPreferences } from '../hooks/useQueries';
import ReminderCard from '../components/ReminderCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Bell, Plus } from 'lucide-react';
import { calculateUpcomingEvents } from '../lib/cycleUtils';

export default function Reminders() {
  const { identity } = useInternetIdentity();
  const navigate = useNavigate();
  const isAuthenticated = !!identity;

  const { data: cycleEntries = [], isLoading: entriesLoading } = useGetCycleEntries();
  const { data: preferences, isLoading: prefsLoading } = useGetPreferences();

  if (!isAuthenticated) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <Bell className="w-8 h-8 text-primary" />
        </div>
        <h2 className="font-serif text-2xl font-bold mb-2">Sign in to view reminders</h2>
        <p className="text-muted-foreground mb-6">Your personalized cycle reminders will appear here.</p>
        <Button onClick={() => navigate({ to: '/' })} className="rounded-xl">
          Go to Home
        </Button>
      </div>
    );
  }

  const isLoading = entriesLoading || prefsLoading;
  const upcomingEvents = calculateUpcomingEvents(cycleEntries, preferences ?? null);

  // Filter by reminder days preference
  const reminderDays = preferences ? Number(preferences.reminderDaysBefore) : 3;
  const filteredEvents = upcomingEvents.filter(e => e.daysUntil <= 30);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 animate-fade-in">
      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground">Reminders</h1>
          <p className="text-muted-foreground mt-1">
            Upcoming cycle events and health reminders.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="rounded-xl flex-shrink-0"
          onClick={() => navigate({ to: '/settings' })}
        >
          Configure
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <Skeleton key={i} className="h-24 w-full rounded-2xl" />
          ))}
        </div>
      ) : cycleEntries.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Bell className="w-8 h-8 text-primary opacity-50" />
          </div>
          <h3 className="font-semibold text-foreground mb-2">No reminders yet</h3>
          <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto">
            Log your first period to start receiving personalized cycle reminders and predictions.
          </p>
          <Button onClick={() => navigate({ to: '/log' })} className="rounded-xl">
            <Plus className="w-4 h-4 mr-1.5" />
            Log First Period
          </Button>
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-muted-foreground">No upcoming events in the next 30 days.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Upcoming section */}
          <div>
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              Next 30 Days
            </h2>
            <div className="space-y-3">
              {filteredEvents.map((event, i) => (
                <ReminderCard key={i} event={event} />
              ))}
            </div>
          </div>

          {/* Info note */}
          <div className="rounded-xl bg-secondary/60 p-4 mt-4">
            <p className="text-xs text-muted-foreground">
              <strong className="text-foreground">Note:</strong> These predictions are based on your logged cycle data and average cycle length ({preferences ? Number(preferences.preferredCycleLength) : 28} days). Individual cycles may vary. Consult a healthcare provider for medical advice.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
