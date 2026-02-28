import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { CycleEntry, UserPreferences, UserProfile, SexualActivityEntry, SafePeriodStatus } from '../backend';

// ─── User Profile ────────────────────────────────────────────────────────────

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

// ─── Cycle Entries ────────────────────────────────────────────────────────────

export function useGetCycleEntries() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<CycleEntry[]>({
    queryKey: ['cycleEntries'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCycleEntries();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useAddCycleEntry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ startDate, endDate }: { startDate: bigint; endDate: bigint }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addCycleEntry(startDate, endDate);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cycleEntries'] });
      queryClient.invalidateQueries({ queryKey: ['currentCycleDay'] });
      queryClient.invalidateQueries({ queryKey: ['fertilityPhases'] });
    },
  });
}

export function useUpdateCycleEntry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ index, startDate, endDate }: { index: bigint; startDate: bigint; endDate: bigint }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateCycleEntry(index, startDate, endDate);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cycleEntries'] });
      queryClient.invalidateQueries({ queryKey: ['currentCycleDay'] });
      queryClient.invalidateQueries({ queryKey: ['fertilityPhases'] });
    },
  });
}

export function useDeleteCycleEntry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (index: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteCycleEntry(index);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cycleEntries'] });
      queryClient.invalidateQueries({ queryKey: ['currentCycleDay'] });
      queryClient.invalidateQueries({ queryKey: ['fertilityPhases'] });
    },
  });
}

// ─── Current Cycle Day ────────────────────────────────────────────────────────

export function useGetCurrentCycleDay() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<bigint>({
    queryKey: ['currentCycleDay'],
    queryFn: async () => {
      if (!actor) return BigInt(1);
      return actor.getCurrentCycleDay();
    },
    enabled: !!actor && !actorFetching,
  });
}

// ─── Fertility Phases ─────────────────────────────────────────────────────────

export function useGetFertilityPhases(currentDay: bigint) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery({
    queryKey: ['fertilityPhases', currentDay.toString()],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getFertilityPhases(currentDay);
    },
    enabled: !!actor && !actorFetching,
  });
}

// ─── Preferences ─────────────────────────────────────────────────────────────

export function useGetPreferences() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<UserPreferences | null>({
    queryKey: ['preferences'],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getPreferences();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useUpdatePreferences() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (preferences: UserPreferences) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updatePreferences(preferences);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['preferences'] });
      queryClient.invalidateQueries({ queryKey: ['fertilityPhases'] });
    },
  });
}

// ─── Sexual Activity Entries ──────────────────────────────────────────────────

export function useGetSexActivityEntries() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<SexualActivityEntry[]>({
    queryKey: ['sexActivityEntries'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getSexualActivityEntries();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useCreateSexActivityEntry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      date,
      protected: isProtected,
      notes,
    }: {
      date: bigint;
      protected: boolean;
      notes: string | null;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addSexualActivityEntry(date, isProtected, notes);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sexActivityEntries'] });
    },
  });
}

export function useUpdateSexActivityEntry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      index,
      date,
      protected: isProtected,
      notes,
    }: {
      index: bigint;
      date: bigint;
      protected: boolean;
      notes: string | null;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateSexualActivityEntry(index, date, isProtected, notes);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sexActivityEntries'] });
    },
  });
}

export function useDeleteSexActivityEntry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (index: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteSexualActivityEntry(index);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sexActivityEntries'] });
    },
  });
}

// ─── Safe Period Status ───────────────────────────────────────────────────────

export function useGetSafeSexStatus(date: bigint) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<SafePeriodStatus>({
    queryKey: ['safeSexStatus', date.toString()],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getSafePeriodStatus(date);
    },
    enabled: !!actor && !actorFetching,
  });
}
