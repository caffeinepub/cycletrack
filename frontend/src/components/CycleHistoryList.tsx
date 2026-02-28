import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Pencil, Trash2, CalendarDays } from 'lucide-react';
import { formatDate, nanosecondsToDate } from '../lib/cycleUtils';
import type { CycleEntry } from '../backend';
import CycleEntryForm from './CycleEntryForm';

interface CycleHistoryListProps {
  entries: CycleEntry[];
  onUpdate: (index: number, startDate: bigint, endDate: bigint) => Promise<void>;
  onDelete: (index: number) => Promise<void>;
  isUpdating?: boolean;
  isDeleting?: boolean;
}

export default function CycleHistoryList({
  entries,
  onUpdate,
  onDelete,
  isUpdating,
  isDeleting,
}: CycleHistoryListProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  // Sort entries by startDate descending (most recent first)
  const sortedEntries = [...entries]
    .map((e, originalIndex) => ({ entry: e, originalIndex }))
    .sort((a, b) => Number(b.entry.startDate - a.entry.startDate));

  if (entries.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <CalendarDays className="w-12 h-12 mx-auto mb-3 opacity-30" />
        <p className="font-medium">No cycles logged yet</p>
        <p className="text-sm mt-1">Add your first period entry above to get started.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {sortedEntries.map(({ entry, originalIndex }) => {
        const startDate = nanosecondsToDate(entry.startDate);
        const endDate = nanosecondsToDate(entry.endDate);
        const duration = Number(entry.cycleLength);
        const isEditing = editingIndex === originalIndex;

        return (
          <Card key={originalIndex} className="rounded-2xl border-border shadow-xs overflow-hidden">
            <CardContent className="p-4">
              {isEditing ? (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-3">Edit Entry</p>
                  <CycleEntryForm
                    initialEntry={entry}
                    onSubmit={async (start, end) => {
                      await onUpdate(originalIndex, start, end);
                      setEditingIndex(null);
                    }}
                    onCancel={() => setEditingIndex(null)}
                    isLoading={isUpdating}
                    submitLabel="Update Entry"
                  />
                </div>
              ) : (
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <CalendarDays className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">
                        {formatDate(startDate)} — {formatDate(endDate)}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {duration} day{duration !== 1 ? 's' : ''} period
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-lg"
                      onClick={() => setEditingIndex(originalIndex)}
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-lg text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="rounded-2xl">
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete this entry?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently remove the cycle entry for {formatDate(startDate)}. This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            className="rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            onClick={() => onDelete(originalIndex)}
                            disabled={isDeleting}
                          >
                            {isDeleting ? 'Deleting…' : 'Delete'}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
