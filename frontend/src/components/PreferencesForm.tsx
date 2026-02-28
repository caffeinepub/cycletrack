import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { UserPreferences } from '../backend';

interface PreferencesFormProps {
  preferences: UserPreferences | null;
  onSave: (prefs: UserPreferences) => Promise<void>;
  isLoading?: boolean;
}

export default function PreferencesForm({ preferences, onSave, isLoading }: PreferencesFormProps) {
  const [cycleLength, setCycleLength] = useState(28);
  const [lutealLength, setLutealLength] = useState(14);
  const [reminderDays, setReminderDays] = useState(3);
  const [error, setError] = useState('');

  useEffect(() => {
    if (preferences) {
      setCycleLength(Number(preferences.preferredCycleLength));
      setLutealLength(Number(preferences.lutealPhaseLength));
      setReminderDays(Number(preferences.reminderDaysBefore));
    }
  }, [preferences]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (cycleLength < 21 || cycleLength > 45) {
      setError('Cycle length must be between 21 and 45 days.');
      return;
    }
    if (lutealLength < 10 || lutealLength > 16) {
      setError('Luteal phase length must be between 10 and 16 days.');
      return;
    }
    if (lutealLength >= cycleLength) {
      setError('Luteal phase length must be less than cycle length.');
      return;
    }
    if (reminderDays < 0 || reminderDays > 14) {
      setError('Reminder days must be between 0 and 14.');
      return;
    }

    try {
      await onSave({
        preferredCycleLength: BigInt(cycleLength),
        lutealPhaseLength: BigInt(lutealLength),
        reminderDaysBefore: BigInt(reminderDays),
      });
    } catch {
      setError('Failed to save preferences. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="cycleLength">Average Cycle Length (days)</Label>
          <Input
            id="cycleLength"
            type="number"
            min={21}
            max={45}
            value={cycleLength}
            onChange={e => setCycleLength(Number(e.target.value))}
            className="rounded-xl"
          />
          <p className="text-xs text-muted-foreground">Typical range: 21–35 days. Default: 28</p>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="lutealLength">Luteal Phase Length (days)</Label>
          <Input
            id="lutealLength"
            type="number"
            min={10}
            max={16}
            value={lutealLength}
            onChange={e => setLutealLength(Number(e.target.value))}
            className="rounded-xl"
          />
          <p className="text-xs text-muted-foreground">Typical range: 10–16 days. Default: 14</p>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="reminderDays">Reminder Days in Advance</Label>
        <Input
          id="reminderDays"
          type="number"
          min={0}
          max={14}
          value={reminderDays}
          onChange={e => setReminderDays(Number(e.target.value))}
          className="rounded-xl max-w-xs"
        />
        <p className="text-xs text-muted-foreground">
          How many days before an event to show reminders. Set to 0 to only show on the day.
        </p>
      </div>

      {/* Cycle preview */}
      <div className="rounded-xl bg-secondary/60 p-4 space-y-2">
        <p className="text-sm font-medium text-foreground">Cycle Preview</p>
        <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
          <div>Follicular phase: <span className="text-foreground font-medium">Days 1–{cycleLength - lutealLength - 1}</span></div>
          <div>Ovulation day: <span className="text-foreground font-medium">Day {cycleLength - lutealLength}</span></div>
          <div>Fertile window: <span className="text-foreground font-medium">Days {cycleLength - lutealLength - 5}–{cycleLength - lutealLength}</span></div>
          <div>Luteal phase: <span className="text-foreground font-medium">Days {cycleLength - lutealLength + 1}–{cycleLength}</span></div>
        </div>
      </div>

      {error && (
        <p className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-lg">{error}</p>
      )}

      <Button type="submit" disabled={isLoading} className="rounded-xl">
        {isLoading ? 'Saving…' : 'Save Preferences'}
      </Button>
    </form>
  );
}
