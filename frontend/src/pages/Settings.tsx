import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetPreferences, useUpdatePreferences } from '../hooks/useQueries';
import PreferencesForm from '../components/PreferencesForm';
import PrivacyNotice from '../components/PrivacyNotice';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Settings as SettingsIcon } from 'lucide-react';
import { toast } from 'sonner';
import type { UserPreferences } from '../backend';

export default function Settings() {
  const { identity } = useInternetIdentity();
  const navigate = useNavigate();
  const isAuthenticated = !!identity;

  const { data: preferences, isLoading } = useGetPreferences();
  const updatePreferences = useUpdatePreferences();

  if (!isAuthenticated) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <SettingsIcon className="w-8 h-8 text-primary" />
        </div>
        <h2 className="font-serif text-2xl font-bold mb-2">Sign in to access settings</h2>
        <p className="text-muted-foreground mb-6">Customize your cycle tracking preferences.</p>
        <Button onClick={() => navigate({ to: '/' })} className="rounded-xl">
          Go to Home
        </Button>
      </div>
    );
  }

  const handleSave = async (prefs: UserPreferences) => {
    await updatePreferences.mutateAsync(prefs);
    toast.success('Preferences saved! ✓');
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">Customize your cycle tracking preferences.</p>
      </div>

      <div className="space-y-6">
        {/* Cycle Preferences */}
        <section className="bg-card rounded-2xl border border-border p-5 shadow-xs">
          <h2 className="font-semibold text-base text-foreground mb-1">Cycle Preferences</h2>
          <p className="text-sm text-muted-foreground mb-5">
            Adjust these settings to match your personal cycle for more accurate predictions.
          </p>
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-10 w-full rounded-xl" />
              <Skeleton className="h-10 w-full rounded-xl" />
              <Skeleton className="h-10 w-48 rounded-xl" />
            </div>
          ) : (
            <PreferencesForm
              preferences={preferences ?? null}
              onSave={handleSave}
              isLoading={updatePreferences.isPending}
            />
          )}
        </section>

        {/* Privacy Section */}
        <section className="bg-card rounded-2xl border border-border p-5 shadow-xs">
          <h2 className="font-semibold text-base text-foreground mb-1">Privacy & Data</h2>
          <p className="text-sm text-muted-foreground mb-5">
            Learn how your health data is stored and protected.
          </p>
          <PrivacyNotice />
        </section>

        {/* About Section */}
        <section className="bg-card rounded-2xl border border-border p-5 shadow-xs">
          <h2 className="font-semibold text-base text-foreground mb-1">About CycleTrack</h2>
          <p className="text-sm text-muted-foreground mb-4">
            CycleTrack is a privacy-first menstrual cycle tracking application built on the Internet Computer blockchain.
          </p>
          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center justify-between py-2 border-b border-border">
              <span>Version</span>
              <span className="text-foreground font-medium">1.0.0</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-border">
              <span>Platform</span>
              <span className="text-foreground font-medium">Internet Computer</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span>Data Storage</span>
              <span className="text-foreground font-medium">On-chain (private)</span>
            </div>
          </div>
        </section>

        {/* Disclaimer */}
        <div className="rounded-xl bg-secondary/60 p-4">
          <p className="text-xs text-muted-foreground leading-relaxed">
            <strong className="text-foreground">Medical Disclaimer:</strong> CycleTrack is intended for informational and tracking purposes only. It is not a substitute for professional medical advice, diagnosis, or treatment. Cycle predictions are estimates based on averages and may not reflect your individual biology. Always consult a qualified healthcare provider for medical guidance.
          </p>
        </div>
      </div>
    </div>
  );
}
