import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Loader2, ShieldCheck } from 'lucide-react';

interface SexActivityFormData {
  date: string;
  protected: boolean;
  notes: string;
}

interface SexActivityEntryFormProps {
  onSubmit: (data: { date: bigint; protected: boolean; notes: string | null }) => Promise<void>;
  isLoading?: boolean;
  submitLabel?: string;
  initialData?: {
    date: bigint;
    protected: boolean;
    notes?: string;
  };
  onCancel?: () => void;
}

function bigintToDateString(ns: bigint): string {
  const ms = Number(ns) / 1_000_000;
  const d = new Date(ms);
  return d.toISOString().split('T')[0];
}

function dateStringToBigint(dateStr: string): bigint {
  const ms = new Date(dateStr).getTime();
  return BigInt(ms) * BigInt(1_000_000);
}

export default function SexActivityEntryForm({
  onSubmit,
  isLoading = false,
  submitLabel = 'Save Entry',
  initialData,
  onCancel,
}: SexActivityEntryFormProps) {
  const today = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState<SexActivityFormData>({
    date: initialData ? bigintToDateString(initialData.date) : today,
    protected: initialData ? initialData.protected : true,
    notes: initialData?.notes ?? '',
  });

  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.date) {
      setError('Please select a date.');
      return;
    }

    try {
      await onSubmit({
        date: dateStringToBigint(formData.date),
        protected: formData.protected,
        notes: formData.notes.trim() || null,
      });
      if (!initialData) {
        setFormData({ date: today, protected: true, notes: '' });
      }
    } catch {
      setError('Failed to save entry. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Date */}
      <div className="space-y-1.5">
        <Label htmlFor="activity-date" className="text-sm font-medium">
          Date
        </Label>
        <input
          id="activity-date"
          type="date"
          value={formData.date}
          max={today}
          onChange={e => setFormData(prev => ({ ...prev, date: e.target.value }))}
          className="w-full h-9 rounded-lg border border-input bg-background px-3 py-1 text-sm shadow-xs focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 transition-colors"
          required
        />
      </div>

      {/* Protection Toggle */}
      <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/40 border border-border">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-4 h-4 text-primary" />
          <div>
            <p className="text-sm font-medium text-foreground">Protection used</p>
            <p className="text-xs text-muted-foreground">Condom or other barrier method</p>
          </div>
        </div>
        <Switch
          checked={formData.protected}
          onCheckedChange={val => setFormData(prev => ({ ...prev, protected: val }))}
        />
      </div>

      {/* Notes */}
      <div className="space-y-1.5">
        <Label htmlFor="activity-notes" className="text-sm font-medium">
          Notes <span className="text-muted-foreground font-normal">(optional)</span>
        </Label>
        <Textarea
          id="activity-notes"
          value={formData.notes}
          onChange={e => setFormData(prev => ({ ...prev, notes: e.target.value }))}
          placeholder="Any notes you'd like to remember…"
          className="resize-none text-sm rounded-xl min-h-[72px]"
          maxLength={500}
        />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex gap-2">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 rounded-xl"
          >
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          disabled={isLoading || !formData.date}
          className="flex-1 rounded-xl"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving…
            </>
          ) : (
            submitLabel
          )}
        </Button>
      </div>
    </form>
  );
}
