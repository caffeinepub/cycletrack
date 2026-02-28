import { Badge } from '@/components/ui/badge';
import { Bell, Flower2, Heart, Shield } from 'lucide-react';
import type { UpcomingEvent } from '../lib/cycleUtils';
import { formatDate } from '../lib/cycleUtils';

interface ReminderCardProps {
  event: UpcomingEvent;
}

const eventConfig = {
  'period': {
    icon: Flower2,
    bgClass: 'bg-rose-500/10 border-rose-500/20',
    iconClass: 'text-rose-600',
    badgeClass: 'bg-rose-500/15 text-rose-700 border-rose-500/25',
    badgeLabel: 'Period',
  },
  'fertile-window': {
    icon: Heart,
    bgClass: 'bg-amber-400/10 border-amber-400/20',
    iconClass: 'text-amber-600',
    badgeClass: 'bg-amber-400/15 text-amber-700 border-amber-400/25',
    badgeLabel: 'Fertile',
  },
  'ovulation': {
    icon: Bell,
    bgClass: 'bg-emerald-500/10 border-emerald-500/20',
    iconClass: 'text-emerald-600',
    badgeClass: 'bg-emerald-500/15 text-emerald-700 border-emerald-500/25',
    badgeLabel: 'Ovulation',
  },
  'safe-period': {
    icon: Shield,
    bgClass: 'bg-violet-400/10 border-violet-400/20',
    iconClass: 'text-violet-600',
    badgeClass: 'bg-violet-400/15 text-violet-700 border-violet-400/25',
    badgeLabel: 'Safe Period',
  },
};

export default function ReminderCard({ event }: ReminderCardProps) {
  const config = eventConfig[event.type];
  const Icon = config.icon;

  return (
    <div className={`rounded-2xl border p-4 ${config.bgClass} animate-fade-in`}>
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-xl bg-white/60 flex items-center justify-center flex-shrink-0 shadow-xs`}>
          <Icon className={`w-5 h-5 ${config.iconClass}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-sm text-foreground">{event.label}</h3>
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${config.badgeClass}`}>
              {config.badgeLabel}
            </span>
            {event.isSafe === true && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-500/15 text-emerald-700 border border-emerald-500/25">
                ✓ Safe Period
              </span>
            )}
            {event.isSafe === false && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-rose-500/15 text-rose-700 border border-rose-500/25">
                ⚠ Unsafe Period
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-1">{formatDate(event.date)}</p>
          <p className="text-sm text-foreground/80 mt-1.5">{event.description}</p>
        </div>
        <div className="flex-shrink-0 text-right">
          <span className="text-2xl font-serif font-bold text-foreground">{event.daysUntil}</span>
          <p className="text-xs text-muted-foreground">day{event.daysUntil !== 1 ? 's' : ''}</p>
        </div>
      </div>
    </div>
  );
}
