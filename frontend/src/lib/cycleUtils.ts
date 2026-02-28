import type { CycleEntry, UserPreferences } from '../backend';

export const NS_PER_DAY = BigInt(24 * 60 * 60 * 1_000_000_000);

export function dateToNanoseconds(date: Date): bigint {
  return BigInt(date.getTime()) * BigInt(1_000_000);
}

export function nanosecondsToDate(ns: bigint): Date {
  return new Date(Number(ns / BigInt(1_000_000)));
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function formatDateShort(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function formatDateInput(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function parseDateInput(value: string): Date {
  const [y, m, d] = value.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export interface UpcomingEvent {
  type: 'period' | 'fertile-window' | 'ovulation' | 'safe-period';
  label: string;
  date: Date;
  daysUntil: number;
  isSafe: boolean | null;
  description: string;
}

export function calculateUpcomingEvents(
  entries: CycleEntry[],
  preferences: UserPreferences | null
): UpcomingEvent[] {
  if (entries.length === 0) return [];

  const cycleLength = preferences ? Number(preferences.preferredCycleLength) : 28;
  const lutealLength = preferences ? Number(preferences.lutealPhaseLength) : 14;

  // Sort entries by startDate descending
  const sorted = [...entries].sort((a, b) => Number(b.startDate - a.startDate));
  const latest = sorted[0];
  const lastPeriodStart = nanosecondsToDate(latest.startDate);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const events: UpcomingEvent[] = [];

  // Calculate next period
  const nextPeriodDate = new Date(lastPeriodStart);
  nextPeriodDate.setDate(nextPeriodDate.getDate() + cycleLength);

  // If next period is in the past, add another cycle
  while (nextPeriodDate < today) {
    nextPeriodDate.setDate(nextPeriodDate.getDate() + cycleLength);
  }

  const daysUntilPeriod = Math.round((nextPeriodDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  events.push({
    type: 'period',
    label: 'Next Period',
    date: nextPeriodDate,
    daysUntil: daysUntilPeriod,
    isSafe: null,
    description: `Your next period is expected to start in ${daysUntilPeriod} day${daysUntilPeriod !== 1 ? 's' : ''}.`,
  });

  // Calculate ovulation (cycleLength - lutealLength days after period start)
  const ovulationDay = cycleLength - lutealLength;
  const nextOvulationDate = new Date(nextPeriodDate);
  nextOvulationDate.setDate(nextPeriodDate.getDate() - lutealLength);

  const daysUntilOvulation = Math.round((nextOvulationDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (daysUntilOvulation >= 0) {
    events.push({
      type: 'ovulation',
      label: 'Ovulation Day',
      date: nextOvulationDate,
      daysUntil: daysUntilOvulation,
      isSafe: false,
      description: `Ovulation is expected in ${daysUntilOvulation} day${daysUntilOvulation !== 1 ? 's' : ''}. This is your most fertile day.`,
    });
  }

  // Fertile window: 5 days before ovulation
  const fertileWindowStart = new Date(nextOvulationDate);
  fertileWindowStart.setDate(nextOvulationDate.getDate() - 5);

  const daysUntilFertile = Math.round((fertileWindowStart.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (daysUntilFertile >= 0) {
    events.push({
      type: 'fertile-window',
      label: 'Fertile Window Starts',
      date: fertileWindowStart,
      daysUntil: daysUntilFertile,
      isSafe: false,
      description: `Your fertile window begins in ${daysUntilFertile} day${daysUntilFertile !== 1 ? 's' : ''}. Pregnancy is possible during this time.`,
    });
  }

  // Safe period after ovulation (luteal phase)
  const safePeriodStart = new Date(nextOvulationDate);
  safePeriodStart.setDate(nextOvulationDate.getDate() + 2);

  const daysUntilSafe = Math.round((safePeriodStart.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (daysUntilSafe >= 0 && daysUntilSafe < cycleLength) {
    events.push({
      type: 'safe-period',
      label: 'Safe Period Begins',
      date: safePeriodStart,
      daysUntil: daysUntilSafe,
      isSafe: true,
      description: `The safer period begins in ${daysUntilSafe} day${daysUntilSafe !== 1 ? 's' : ''}. Lower pregnancy risk during this phase.`,
    });
  }

  return events.sort((a, b) => a.daysUntil - b.daysUntil);
}

export type DayPhase = 'menstrual' | 'follicular' | 'ovulation' | 'luteal' | 'none';

export interface CalendarDay {
  date: Date;
  dayOfMonth: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  phase: DayPhase;
  cycleDay: number | null;
  isFertile: boolean;
  isOvulation: boolean;
  isSafe: boolean;
}

export function buildCalendarDays(
  year: number,
  month: number,
  entries: CycleEntry[],
  preferences: UserPreferences | null
): CalendarDay[] {
  const cycleLength = preferences ? Number(preferences.preferredCycleLength) : 28;
  const lutealLength = preferences ? Number(preferences.lutealPhaseLength) : 14;
  const ovulationDay = cycleLength - lutealLength;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  // Pad start
  const startPad = firstDay.getDay(); // 0=Sun
  const days: CalendarDay[] = [];

  // Previous month days
  for (let i = startPad - 1; i >= 0; i--) {
    const d = new Date(year, month, -i);
    days.push(makeCalendarDay(d, false, today, entries, cycleLength, lutealLength, ovulationDay));
  }

  // Current month days
  for (let d = 1; d <= lastDay.getDate(); d++) {
    const date = new Date(year, month, d);
    days.push(makeCalendarDay(date, true, today, entries, cycleLength, lutealLength, ovulationDay));
  }

  // Next month days to fill grid
  const remaining = 42 - days.length;
  for (let d = 1; d <= remaining; d++) {
    const date = new Date(year, month + 1, d);
    days.push(makeCalendarDay(date, false, today, entries, cycleLength, lutealLength, ovulationDay));
  }

  return days;
}

function makeCalendarDay(
  date: Date,
  isCurrentMonth: boolean,
  today: Date,
  entries: CycleEntry[],
  cycleLength: number,
  lutealLength: number,
  ovulationDay: number
): CalendarDay {
  const isToday = date.getTime() === today.getTime();

  // Find the most recent cycle entry that started on or before this date
  const sorted = [...entries].sort((a, b) => Number(b.startDate - a.startDate));
  let cycleDay: number | null = null;
  let phase: DayPhase = 'none';
  let isFertile = false;
  let isOvulation = false;
  let isSafe = false;

  for (const entry of sorted) {
    const startDate = nanosecondsToDate(entry.startDate);
    startDate.setHours(0, 0, 0, 0);
    const diff = Math.round((date.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

    if (diff >= 0 && diff < cycleLength) {
      cycleDay = diff + 1;
      const d = cycleDay;

      if (d <= 5) {
        phase = 'menstrual';
      } else if (d < ovulationDay) {
        phase = 'follicular';
      } else if (d === ovulationDay) {
        phase = 'ovulation';
        isOvulation = true;
      } else {
        phase = 'luteal';
      }

      // Fertile window: 5 days before ovulation + ovulation day
      if (d >= ovulationDay - 5 && d <= ovulationDay) {
        isFertile = true;
      }

      // Safe: after ovulation + 2 days until end of cycle
      if (d > ovulationDay + 1) {
        isSafe = true;
      }

      break;
    }
  }

  return {
    date,
    dayOfMonth: date.getDate(),
    isCurrentMonth,
    isToday,
    phase,
    cycleDay,
    isFertile,
    isOvulation,
    isSafe,
  };
}
