import { useState } from 'react';
import { SexualActivityEntry } from '../backend';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import SexActivityEntryForm from './SexActivityEntryForm';
import { ShieldCheck, ShieldX, Pencil, Trash2, Loader2 } from 'lucide-react';

interface SexActivityCardProps {
  entry: SexualActivityEntry;
  index: number;
  onUpdate: (index: number, data: { date: bigint; protected: boolean; notes: string | null }) => Promise<void>;
  onDelete: (index: number) => Promise<void>;
  isUpdating?: boolean;
  isDeleting?: boolean;
}

function nanosecondsToLocalDate(ns: bigint): string {
  const ms = Number(ns) / 1_000_000;
  return new Date(ms).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function SexActivityCard({
  entry,
  index,
  onUpdate,
  onDelete,
  isUpdating = false,
  isDeleting = false,
}: SexActivityCardProps) {
  const [editOpen, setEditOpen] = useState(false);

  const handleUpdate = async (data: { date: bigint; protected: boolean; notes: string | null }) => {
    await onUpdate(index, data);
    setEditOpen(false);
  };

  return (
    <>
      <Card className="rounded-2xl border border-border shadow-xs hover:shadow-sm transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-3">
            {/* Left: icon + info */}
            <div className="flex items-start gap-3 min-w-0">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                  entry.protected
                    ? 'bg-emerald-100 dark:bg-emerald-900/40'
                    : 'bg-rose-100 dark:bg-rose-900/40'
                }`}
              >
                {entry.protected ? (
                  <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <ShieldX className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                )}
              </div>

              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground">
                  {nanosecondsToLocalDate(entry.date)}
                </p>
                <Badge
                  variant="secondary"
                  className={`mt-1 text-xs font-medium ${
                    entry.protected
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                      : 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300'
                  }`}
                >
                  {entry.protected ? 'Protected' : 'Unprotected'}
                </Badge>
                {entry.notes && (
                  <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed line-clamp-2">
                    {entry.notes}
                  </p>
                )}
              </div>
            </div>

            {/* Right: actions */}
            <div className="flex items-center gap-1 shrink-0">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground"
                onClick={() => setEditOpen(true)}
                disabled={isUpdating || isDeleting}
              >
                <Pencil className="w-3.5 h-3.5" />
              </Button>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-lg text-muted-foreground hover:text-destructive"
                    disabled={isUpdating || isDeleting}
                  >
                    {isDeleting ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="w-3.5 h-3.5" />
                    )}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="rounded-2xl">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete this entry?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently remove the entry from{' '}
                      <strong>{nanosecondsToLocalDate(entry.date)}</strong>. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      className="rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      onClick={() => onDelete(index)}
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="rounded-2xl max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif">Edit Entry</DialogTitle>
          </DialogHeader>
          <SexActivityEntryForm
            onSubmit={handleUpdate}
            isLoading={isUpdating}
            submitLabel="Update Entry"
            initialData={{
              date: entry.date,
              protected: entry.protected,
              notes: entry.notes,
            }}
            onCancel={() => setEditOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
