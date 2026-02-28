import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import {
  useGetCycleEntries,
  useAddCycleEntry,
  useUpdateCycleEntry,
  useDeleteCycleEntry,
} from '../hooks/useQueries';
import CycleEntryForm from '../components/CycleEntryForm';
import CycleHistoryList from '../components/CycleHistoryList';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { CalendarDays } from 'lucide-react';
import { toast } from 'sonner';

export default function CycleLog() {
  const { identity } = useInternetIdentity();
  const navigate = useNavigate();
  const isAuthenticated = !!identity;

  const { data: cycleEntries = [], isLoading } = useGetCycleEntries();
  const addEntry = useAddCycleEntry();
  const updateEntry = useUpdateCycleEntry();
  const deleteEntry = useDeleteCycleEntry();

  if (!isAuthenticated) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <CalendarDays className="w-8 h-8 text-primary" />
        </div>
        <h2 className="font-serif text-2xl font-bold mb-2">Sign in to log your cycle</h2>
        <p className="text-muted-foreground mb-6">Your cycle data is private and only accessible by you.</p>
        <Button onClick={() => navigate({ to: '/' })} className="rounded-xl">
          Go to Home
        </Button>
      </div>
    );
  }

  const handleAdd = async (startDate: bigint, endDate: bigint) => {
    await addEntry.mutateAsync({ startDate, endDate });
    toast.success('Period entry added! 🌸');
  };

  const handleUpdate = async (index: number, startDate: bigint, endDate: bigint) => {
    await updateEntry.mutateAsync({ index: BigInt(index), startDate, endDate });
    toast.success('Entry updated successfully.');
  };

  const handleDelete = async (index: number) => {
    await deleteEntry.mutateAsync(BigInt(index));
    toast.success('Entry deleted.');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-foreground">Cycle Log</h1>
        <p className="text-muted-foreground mt-1">Track your periods and view your cycle history.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Form */}
        <div className="lg:col-span-2">
          <div className="bg-card rounded-2xl border border-border p-5 shadow-xs sticky top-24">
            <h2 className="font-semibold text-base text-foreground mb-4 flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-primary" />
              Log New Period
            </h2>
            <CycleEntryForm
              onSubmit={handleAdd}
              isLoading={addEntry.isPending}
              submitLabel="Add Entry"
            />
          </div>
        </div>

        {/* History */}
        <div className="lg:col-span-3">
          <h2 className="font-semibold text-base text-foreground mb-4">
            Cycle History
            {cycleEntries.length > 0 && (
              <span className="ml-2 text-sm font-normal text-muted-foreground">
                ({cycleEntries.length} {cycleEntries.length === 1 ? 'entry' : 'entries'})
              </span>
            )}
          </h2>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <Skeleton key={i} className="h-20 w-full rounded-2xl" />
              ))}
            </div>
          ) : (
            <CycleHistoryList
              entries={cycleEntries}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
              isUpdating={updateEntry.isPending}
              isDeleting={deleteEntry.isPending}
            />
          )}
        </div>
      </div>
    </div>
  );
}
