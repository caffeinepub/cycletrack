import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface UserPreferences {
    lutealPhaseLength: bigint;
    reminderDaysBefore: bigint;
    preferredCycleLength: bigint;
}
export interface SexualActivityEntry {
    date: bigint;
    protected: boolean;
    notes?: string;
}
export interface CycleEntry {
    endDate: bigint;
    cycleLength: bigint;
    startDate: bigint;
}
export interface FertilityPhaseResult {
    phase: FertilityPhase;
    dayInCycle: bigint;
}
export interface UserProfile {
    name: string;
}
export enum FertilityPhase {
    follicular = "follicular",
    ovulation = "ovulation",
    menstrual = "menstrual",
    luteal = "luteal"
}
export enum SafePeriodStatus {
    safe = "safe",
    unsafe = "unsafe",
    caution = "caution"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addCycleEntry(startDate: bigint, endDate: bigint): Promise<void>;
    addSexualActivityEntry(date: bigint, protected: boolean, notes: string | null): Promise<bigint>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteCycleEntry(index: bigint): Promise<void>;
    deleteSexualActivityEntry(index: bigint): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCurrentCycleDay(): Promise<bigint>;
    getCycleEntries(): Promise<Array<CycleEntry>>;
    getFertilityPhases(currentDay: bigint): Promise<Array<FertilityPhaseResult>>;
    getPreferences(): Promise<UserPreferences | null>;
    getSafePeriodStatus(date: bigint): Promise<SafePeriodStatus>;
    getSexualActivityEntries(): Promise<Array<SexualActivityEntry>>;
    getSexualActivityEntry(index: bigint): Promise<SexualActivityEntry | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateCycleEntry(index: bigint, startDate: bigint, endDate: bigint): Promise<void>;
    updatePreferences(preferences: UserPreferences): Promise<void>;
    updateSexualActivityEntry(index: bigint, date: bigint, protected: boolean, notes: string | null): Promise<void>;
}
