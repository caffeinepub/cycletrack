import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { buildCalendarDays, type CalendarDay, type DayPhase } from '../lib/cycleUtils';
import type { CycleEntry, UserPreferences } from '../backend';

interface CycleCalendarProps {
  entries: CycleEntry[];
  preferences: UserPreferences | null;
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const phaseStyles: Record<DayPhase, string> = {
  menstrual: 'bg-rose-500/20 text-rose-700 border border-rose-500/30',
  follicular: 'bg-amber-400/15 text-amber-700 border border-amber-400/25',
  ovulation: 'bg-emerald-500/20 text-emerald-700 border border-emerald-500/30 font-semibold',
  luteal: 'bg-violet-400/15 text-violet-700 border border-violet-400/25',
  none: '',
};

const phaseDotStyles: Record<DayPhase, string> = {
  menstrual: 'bg-rose-500',
  follicular: 'bg-amber-400',
  ovulation: 'bg-emerald-500',
  luteal: 'bg-violet-400',
  none: 'hidden',
};

function DayCell({ day }: { day: CalendarDay }) {
  const isSpecial = day.phase !== 'none';
  const baseClass = `relative flex flex-col items-center justify-center w-9 h-9 rounded-full text-sm transition-all cursor-default select-none`;

  let className = baseClass;
  if (!day.isCurrentMonth) {
    className += ' opacity-30';
  }
  if (day.isToday) {
    className += ' ring-2 ring-primary ring-offset-1';
  }
  if (isSpecial) {
    className += ` ${phaseStyles[day.phase]}`;
  } else {
    className += ' hover:bg-secondary';
  }
  if (day.isOvulation) {
    className += ' font-bold';
  }

  return (
    <div className="flex items-center justify-center p-0.5">
      <div className={className}>
        <span>{day.dayOfMonth}</span>
        {day.isFertile && !day.isOvulation && (
          <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-emerald-500" />
        )}
        {day.isOvulation && (
          <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-emerald-600" />
        )}
      </div>
    </div>
  );
}

export default function CycleCalendar({ entries, preferences }: CycleCalendarProps) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const days = buildCalendarDays(viewYear, viewMonth, entries, preferences);

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  const monthName = new Date(viewYear, viewMonth).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className="bg-card rounded-2xl border border-border shadow-soft p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <Button variant="ghost" size="icon" onClick={prevMonth} className="rounded-full h-8 w-8">
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <h3 className="font-serif font-semibold text-base">{monthName}</h3>
        <Button variant="ghost" size="icon" onClick={nextMonth} className="rounded-full h-8 w-8">
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 mb-1">
        {WEEKDAYS.map(d => (
          <div key={d} className="text-center text-xs font-medium text-muted-foreground py-1">{d}</div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7">
        {days.map((day, i) => (
          <DayCell key={i} day={day} />
        ))}
      </div>

      {/* Legend */}
      <div className="mt-4 pt-3 border-t border-border flex flex-wrap gap-x-4 gap-y-1.5">
        {[
          { phase: 'menstrual' as DayPhase, label: 'Menstrual' },
          { phase: 'follicular' as DayPhase, label: 'Follicular' },
          { phase: 'ovulation' as DayPhase, label: 'Ovulation' },
          { phase: 'luteal' as DayPhase, label: 'Luteal' },
        ].map(({ phase, label }) => (
          <div key={phase} className="flex items-center gap-1.5">
            <span className={`w-2.5 h-2.5 rounded-full ${phaseDotStyles[phase]}`} />
            <span className="text-xs text-muted-foreground">{label}</span>
          </div>
        ))}
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-1 ring-emerald-600" />
          <span className="text-xs text-muted-foreground">Fertile</span>
        </div>
      </div>
    </div>
  );
}
