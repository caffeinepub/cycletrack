import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import {
  useGetSexActivityEntries,
  useCreateSexActivityEntry,
  useUpdateSexActivityEntry,
  useDeleteSexActivityEntry,
  useGetSafeSexStatus,
} from '../hooks/useQueries';
import SafeSexStatusIndicator from '../components/SafeSexStatusIndicator';
import SexActivityEntryForm from '../components/SexActivityEntryForm';
import SexActivityCard from '../components/SexActivityCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Heart, HeartHandshake } from 'lucide-react';
import { toast } from 'sonner';

// Convert today's date to nanoseconds (start of day UTC)
function todayNanoseconds(): bigint {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return BigInt(startOfDay.getTime()) * BigInt(1_000_000);
}

export default function Intimacy() {
  const { identity } = useInternetIdentity();
  const navigate = useNavigate();
  const isAuthenticated = !!identity;

  const todayNs = todayNanoseconds();

  const { data: entries = [], isLoading: entriesLoading } = useGetSexActivityEntries();
  const { data: safeSexStatus, isLoading: statusLoading } = useGetSafeSexStatus(todayNs);

  const createEntry = useCreateSexActivityEntry();
  const updateEntry = useUpdateSexActivityEntry();
  const deleteEntry = useDeleteSexActivityEntry();

  if (!isAuthenticated) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <HeartHandshake className="w-8 h-8 text-primary" />
        </div>
        <h2 className="font-serif text-2xl font-bold mb-2">Sign in to track your intimacy</h2>
        <p className="text-muted-foreground mb-6">
          Your data is private and only accessible by you.
        </p>
        <Button onClick={() => navigate({ to: '/' })} className="rounded-xl">
          Go to Home
        </Button>
      </div>
    );
  }

  const handleCreate = async (data: { date: bigint; protected: boolean; notes: string | null }) => {
    await createEntry.mutateAsync(data);
    toast.success('Entry logged 💕');
  };

  const handleUpdate = async (
    index: number,
    data: { date: bigint; protected: boolean; notes: string | null }
  ) => {
    await updateEntry.mutateAsync({ index: BigInt(index), ...data });
    toast.success('Entry updated.');
  };

  const handleDelete = async (index: number) => {
    await deleteEntry.mutateAsync(BigInt(index));
    toast.success('Entry deleted.');
  };

  // Sort entries in reverse chronological order
  const sortedEntries = [...entries].sort((a, b) => Number(b.date - a.date));

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 animate-fade-in">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2.5 mb-1">
          <Heart className="w-6 h-6 text-primary fill-primary/20" />
          <h1 className="font-serif text-3xl font-bold text-foreground">Intimacy</h1>
        </div>
        <p className="text-muted-foreground">
          Track your sexual activity and understand your safe and fertile windows.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left Column: Status + Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Safe Period Status */}
          <div className="bg-card rounded-2xl border border-border p-5 shadow-xs">
            <h2 className="font-semibold text-sm text-muted-foreground mb-3 uppercase tracking-wide">
              Today's Status
            </h2>
            <SafeSexStatusIndicator status={safeSexStatus} isLoading={statusLoading} />
          </div>

          {/* Log New Entry */}
          <div className="bg-card rounded-2xl border border-border p-5 shadow-xs sticky top-24">
            <h2 className="font-semibold text-base text-foreground mb-4 flex items-center gap-2">
              <Heart className="w-4 h-4 text-primary" />
              Log Activity
            </h2>
            <SexActivityEntryForm
              onSubmit={handleCreate}
              isLoading={createEntry.isPending}
              submitLabel="Add Entry"
            />
          </div>
        </div>

        {/* Right Column: History */}
        <div className="lg:col-span-3">
          <h2 className="font-semibold text-base text-foreground mb-4">
            Activity History
            {sortedEntries.length > 0 && (
              <span className="ml-2 text-sm font-normal text-muted-foreground">
                ({sortedEntries.length} {sortedEntries.length === 1 ? 'entry' : 'entries'})
              </span>
            )}
          </h2>

          {entriesLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <Skeleton key={i} className="h-20 w-full rounded-2xl" />
              ))}
            </div>
          ) : sortedEntries.length === 0 ? (
            <div className="text-center py-16 bg-card rounded-2xl border border-border">
              <HeartHandshake className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm font-medium text-foreground">No entries yet</p>
              <p className="text-xs text-muted-foreground mt-1">
                Use the form to log your first activity.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {sortedEntries.map((entry, displayIndex) => {
                // Find the original index in the unsorted array
                const originalIndex = entries.findIndex(
                  e => e.date === entry.date && e.protected === entry.protected && e.notes === entry.notes
                );
                return (
                  <SexActivityCard
                    key={`${entry.date}-${displayIndex}`}
                    entry={entry}
                    index={originalIndex >= 0 ? originalIndex : displayIndex}
                    onUpdate={handleUpdate}
                    onDelete={handleDelete}
                    isUpdating={updateEntry.isPending}
                    isDeleting={deleteEntry.isPending}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
