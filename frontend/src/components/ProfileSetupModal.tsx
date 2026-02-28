import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSaveCallerUserProfile } from '../hooks/useQueries';
import { toast } from 'sonner';
import { Flower2 } from 'lucide-react';

interface ProfileSetupModalProps {
  open: boolean;
}

export default function ProfileSetupModal({ open }: ProfileSetupModalProps) {
  const [name, setName] = useState('');
  const saveProfile = useSaveCallerUserProfile();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      await saveProfile.mutateAsync({ name: name.trim() });
      toast.success('Welcome to CycleTrack! 🌸');
    } catch {
      toast.error('Failed to save profile. Please try again.');
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-md bg-card border-border" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader className="text-center items-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-2">
            <Flower2 className="w-8 h-8 text-primary" />
          </div>
          <DialogTitle className="font-serif text-2xl">Welcome to CycleTrack</DialogTitle>
          <DialogDescription className="text-center">
            Let's personalize your experience. What should we call you?
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-2">
            <Label htmlFor="name">Your Name</Label>
            <Input
              id="name"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-xl"
              autoFocus
            />
          </div>
          <Button
            type="submit"
            className="w-full rounded-xl"
            disabled={!name.trim() || saveProfile.isPending}
          >
            {saveProfile.isPending ? 'Saving…' : 'Get Started 🌸'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
