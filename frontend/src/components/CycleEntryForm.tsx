import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { formatDateInput, parseDateInput, dateToNanoseconds } from '../lib/cycleUtils';
import type { CycleEntry } from '../backend';
import { nanosecondsToDate } from '../lib/cycleUtils';

interface CycleEntryFormProps {
  onSubmit: (startDate: bigint, endDate: bigint) => Promise<void>;
  onCancel?: () => void;
  initialEntry?: CycleEntry;
  isLoading?: boolean;
  submitLabel?: string;
}

export default function CycleEntryForm({
  onSubmit,
  onCancel,
  initialEntry,
  isLoading,
  submitLabel = 'Save Entry',
}: CycleEntryFormProps) {
  const today = new Date();
  const defaultEnd = new Date(today);
  defaultEnd.setDate(today.getDate() + 5);

  const [startDate, setStartDate] = useState(
    initialEntry ? formatDateInput(nanosecondsToDate(initialEntry.startDate)) : formatDateInput(today)
  );
  const [endDate, setEndDate] = useState(
    initialEntry ? formatDateInput(nanosecondsToDate(initialEntry.endDate)) : formatDateInput(defaultEnd)
  );
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialEntry) {
      setStartDate(formatDateInput(nanosecondsToDate(initialEntry.startDate)));
      setEndDate(formatDateInput(nanosecondsToDate(initialEntry.endDate)));
    }
  }, [initialEntry]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const start = parseDateInput(startDate);
    const end = parseDateInput(endDate);

    if (end <= start) {
      setError('End date must be after start date.');
      return;
    }

    const diffDays = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays > 10) {
      setError('Period duration seems too long (max 10 days). Please check your dates.');
      return;
    }

    try {
      await onSubmit(dateToNanoseconds(start), dateToNanoseconds(end));
    } catch {
      setError('Failed to save entry. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="startDate">Period Start Date</Label>
          <Input
            id="startDate"
            type="date"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
            max={formatDateInput(today)}
            required
            className="rounded-xl"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="endDate">Period End Date</Label>
          <Input
            id="endDate"
            type="date"
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
            required
            className="rounded-xl"
          />
        </div>
      </div>

      {error && (
        <p className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-lg">{error}</p>
      )}

      <div className="flex gap-2 pt-1">
        <Button type="submit" disabled={isLoading} className="flex-1 rounded-xl">
          {isLoading ? 'Saving…' : submitLabel}
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} className="rounded-xl">
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
