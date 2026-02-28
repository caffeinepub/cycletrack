import { SafePeriodStatus } from '../backend';
import { ShieldCheck, ShieldAlert, ShieldX, Loader2 } from 'lucide-react';

interface SafeSexStatusIndicatorProps {
  status: SafePeriodStatus | undefined;
  isLoading?: boolean;
}

const statusConfig = {
  [SafePeriodStatus.safe]: {
    label: 'Safe Period',
    description:
      'You are likely in your menstrual or late luteal phase. This is considered a lower-risk period for unprotected sex, though no method is 100% certain.',
    icon: ShieldCheck,
    containerClass: 'bg-emerald-50 border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-800',
    iconClass: 'text-emerald-600 dark:text-emerald-400',
    labelClass: 'text-emerald-700 dark:text-emerald-300',
    descClass: 'text-emerald-700/80 dark:text-emerald-400/80',
    badgeClass: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300',
  },
  [SafePeriodStatus.caution]: {
    label: 'Caution Period',
    description:
      'You are approaching or leaving your fertile window. Pregnancy risk is moderate. Use protection if you wish to avoid pregnancy.',
    icon: ShieldAlert,
    containerClass: 'bg-amber-50 border-amber-200 dark:bg-amber-950/30 dark:border-amber-800',
    iconClass: 'text-amber-600 dark:text-amber-400',
    labelClass: 'text-amber-700 dark:text-amber-300',
    descClass: 'text-amber-700/80 dark:text-amber-400/80',
    badgeClass: 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300',
  },
  [SafePeriodStatus.unsafe]: {
    label: 'Fertile Window',
    description:
      'You are near or at ovulation — your most fertile time. Pregnancy risk is highest. Always use protection if you wish to avoid pregnancy.',
    icon: ShieldX,
    containerClass: 'bg-rose-50 border-rose-200 dark:bg-rose-950/30 dark:border-rose-800',
    iconClass: 'text-rose-600 dark:text-rose-400',
    labelClass: 'text-rose-700 dark:text-rose-300',
    descClass: 'text-rose-700/80 dark:text-rose-400/80',
    badgeClass: 'bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300',
  },
};

export default function SafeSexStatusIndicator({ status, isLoading }: SafeSexStatusIndicatorProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center gap-3 p-6 rounded-2xl border border-border bg-card">
        <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Calculating your cycle status…</span>
      </div>
    );
  }

  if (!status) {
    return (
      <div className="p-6 rounded-2xl border border-border bg-card text-center">
        <ShieldCheck className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
        <p className="text-sm font-medium text-foreground">No cycle data yet</p>
        <p className="text-xs text-muted-foreground mt-1">
          Log your period in Cycle Log to get personalized safe period guidance.
        </p>
      </div>
    );
  }

  const config = statusConfig[status as SafePeriodStatus];
  const Icon = config.icon;

  return (
    <div className={`p-5 rounded-2xl border-2 ${config.containerClass}`}>
      <div className="flex items-start gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${config.badgeClass}`}>
          <Icon className={`w-6 h-6 ${config.iconClass}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-base font-semibold ${config.labelClass}`}>{config.label}</span>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${config.badgeClass}`}>Today</span>
          </div>
          <p className={`text-sm leading-relaxed ${config.descClass}`}>{config.description}</p>
        </div>
      </div>
      <p className="text-xs text-muted-foreground mt-3 pt-3 border-t border-current/10">
        ⚠️ This is an estimate based on your logged cycle data. Always consult a healthcare provider for medical advice.
      </p>
    </div>
  );
}
