import Map "mo:core/Map";
import List "mo:core/List";
import Array "mo:core/Array";
import Time "mo:core/Time";
import Order "mo:core/Order";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Int "mo:core/Int";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import Migration "migration";

(with migration = Migration.run)
actor {
  // Cycle Data Types
  public type CycleEntry = {
    startDate : Int;
    endDate : Int;
    cycleLength : Nat;
  };

  // Preference Types
  public type UserPreferences = {
    preferredCycleLength : Nat;
    lutealPhaseLength : Nat;
    reminderDaysBefore : Int;
  };

  // Fertility Phase Types
  public type FertilityPhase = {
    #menstrual;
    #follicular;
    #ovulation;
    #luteal;
  };

  public type FertilityPhaseResult = {
    dayInCycle : Nat;
    phase : FertilityPhase;
  };

  // Sexual Activity Entry Type
  public type SexualActivityEntry = {
    date : Int;
    protected : Bool;
    notes : ?Text;
  };

  // Safe Period Assessment Type
  public type SafePeriodStatus = {
    #safe;
    #unsafe;
    #caution;
  };

  // User Data Model
  public type UserData = {
    cycles : List.List<CycleEntry>;
    preferences : UserPreferences;
    sexualActivity : List.List<SexualActivityEntry>;
  };

  public type UserProfile = {
    name : Text;
  };

  // State Management
  let users = Map.empty<Principal, UserData>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  // Authorization
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Helper Functions
  func getUser(userId : Principal) : ?UserData {
    users.get(userId);
  };

  func getOrCreateUser(userId : Principal) : UserData {
    switch (users.get(userId)) {
      case (null) {
        let newUser = {
          cycles = List.empty<CycleEntry>();
          preferences = {
            preferredCycleLength = 28;
            lutealPhaseLength = 14;
            reminderDaysBefore = 3;
          };
          sexualActivity = List.empty<SexualActivityEntry>();
        };
        users.add(userId, newUser);
        newUser;
      };
      case (?user) { user };
    };
  };

  func calculatePhase(dayInCycle : Nat, totalCycleLength : Nat, lutealPhaseLength : Nat) : FertilityPhase {
    let follicularLength : Int = totalCycleLength - lutealPhaseLength;
    if (dayInCycle <= 5) {
      #menstrual;
    } else if (dayInCycle <= Int.abs(follicularLength)) {
      #follicular;
    } else if (dayInCycle <= Int.abs(follicularLength) + 1) {
      #ovulation;
    } else {
      #luteal;
    };
  };

  func calculateDayInCycle(referenceDate : Int, user : UserData) : Nat {
    switch (user.cycles.last()) {
      case (null) { 1 };
      case (?latestEntry) {
        let diffNs = referenceDate - latestEntry.startDate;
        let daysSinceStart : Nat = if (diffNs > 0) { Int.abs(diffNs / (24 * 60 * 60 * 1000000000)) } else { 0 };
        if (daysSinceStart > latestEntry.cycleLength) {
          1;
        } else {
          daysSinceStart;
        };
      };
    };
  };

  func assessSafePeriod(dayInCycle : Nat) : SafePeriodStatus {
    if (dayInCycle <= 5) {
      #safe;
    } else if (dayInCycle <= 13) {
      #caution;
    } else if (dayInCycle <= 15) {
      #unsafe;
    } else if (dayInCycle <= 22) {
      #caution;
    } else { #safe };
  };

  // User Profile Functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Only users can get profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Cycle Entry CRUD Functions
  public shared ({ caller }) func addCycleEntry(startDate : Int, endDate : Int) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Only users can add cycle entries");
    };
    let cycleLengthInt = (endDate - startDate) / (24 * 60 * 60 * 1000000000);
    let cycleLength : Nat = if (cycleLengthInt > 0) { Int.abs(cycleLengthInt) } else { 0 };
    let newEntry : CycleEntry = {
      startDate;
      endDate;
      cycleLength;
    };

    let user = getOrCreateUser(caller);
    user.cycles.add(newEntry);
    users.add(caller, user);
  };

  public query ({ caller }) func getCycleEntries() : async [CycleEntry] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Only users can get cycle entries");
    };
    let user = getOrCreateUser(caller);
    let arr = user.cycles.toArray().sort(
      func(a, b) {
        Int.compare(a.startDate, b.startDate);
      }
    );
    arr;
  };

  public shared ({ caller }) func updateCycleEntry(index : Nat, startDate : Int, endDate : Int) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Only users can update cycle entries");
    };
    let user = getOrCreateUser(caller);
    let cycleLengthInt = (endDate - startDate) / (24 * 60 * 60 * 1000000000);
    let cycleLength : Nat = if (cycleLengthInt > 0) { Int.abs(cycleLengthInt) } else { 0 };
    let updatedEntry : CycleEntry = {
      startDate;
      endDate;
      cycleLength;
    };

    let cyclesArray = user.cycles.toArray();
    if (cyclesArray.size() <= index) {
      Runtime.trap("Index out of bounds");
    };
    let newCyclesArray = Array.tabulate(
      cyclesArray.size(),
      func(i) { if (i == index) { updatedEntry } else { cyclesArray[i] } },
    );
    user.cycles.clear();
    user.cycles.addAll(newCyclesArray.values());
    users.add(caller, user);
  };

  public shared ({ caller }) func deleteCycleEntry(index : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Only users can delete cycle entries");
    };
    let user = getOrCreateUser(caller);
    let cyclesArray = user.cycles.toArray();
    if (cyclesArray.size() <= index) {
      Runtime.trap("Cycle entry at index " # index.toText() # " does not exist.");
    };
    let newCyclesArray = Array.tabulate(
      cyclesArray.size() - 1 : Nat,
      func(i) { cyclesArray[if (i < index) { i } else { i + 1 }] },
    );
    user.cycles.clear();
    user.cycles.addAll(newCyclesArray.values());
    users.add(caller, user);
  };

  // Preferences Management
  public shared ({ caller }) func updatePreferences(preferences : UserPreferences) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Only users can update preferences");
    };
    let user = getOrCreateUser(caller);
    users.add(
      caller, {
        cycles = user.cycles;
        preferences;
        sexualActivity = user.sexualActivity;
      },
    );
  };

  public query ({ caller }) func getPreferences() : async ?UserPreferences {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Only users can get preferences");
    };
    switch (getUser(caller)) {
      case (null) { null };
      case (?u) { ?u.preferences };
    };
  };

  // Fertility Phase Calculations
  public query ({ caller }) func getFertilityPhases(currentDay : Nat) : async [FertilityPhaseResult] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Only users can get fertility phases");
    };
    let user = getOrCreateUser(caller);
    let phases = List.empty<FertilityPhaseResult>();
    let startDay : Nat = if (currentDay > 5) { currentDay - 5 : Nat } else { 0 };
    if (startDay <= (currentDay + 5 : Nat)) {
      var day = startDay;
      while (day <= (currentDay + 5 : Nat)) {
        let phase = calculatePhase(day, user.preferences.preferredCycleLength, user.preferences.lutealPhaseLength);
        phases.add({ dayInCycle = day; phase });
        day += 1;
      };
    };
    phases.toArray();
  };

  public query ({ caller }) func getCurrentCycleDay() : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Only users can get current cycle day");
    };
    let user = getOrCreateUser(caller);
    calculateDayInCycle(Time.now(), user);
  };

  // Sexual Activity Logging
  public shared ({ caller }) func addSexualActivityEntry(date : Int, protected : Bool, notes : ?Text) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Only users can add sexual activity entries");
    };
    let user = getOrCreateUser(caller);
    let newEntry : SexualActivityEntry = {
      date;
      protected;
      notes;
    };
    user.sexualActivity.add(newEntry);
    users.add(caller, user);
    user.sexualActivity.size() - 1 : Nat;
  };

  public query ({ caller }) func getSexualActivityEntries() : async [SexualActivityEntry] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Only users can get sexual activity entries");
    };
    let user = getOrCreateUser(caller);
    let array = user.sexualActivity.toArray().sort(
      func(a, b) {
        Int.compare(a.date, b.date);
      }
    );
    array;
  };

  public query ({ caller }) func getSexualActivityEntry(index : Nat) : async ?SexualActivityEntry {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Only users can get sexual activity entries");
    };
    let user = getOrCreateUser(caller);
    let array = user.sexualActivity.toArray();
    if (array.size() <= index) {
      return null;
    };
    ?array[index];
  };

  public shared ({ caller }) func updateSexualActivityEntry(index : Nat, date : Int, protected : Bool, notes : ?Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Only users can update sexual activity entries");
    };
    let user = getOrCreateUser(caller);
    let updatedEntry : SexualActivityEntry = {
      date;
      protected;
      notes;
    };

    let entriesArray = user.sexualActivity.toArray();
    if (entriesArray.size() <= index) {
      Runtime.trap("Sexual activity entry at index " # index.toText() # " does not exist.");
    };
    let newEntriesArray = Array.tabulate(
      entriesArray.size(),
      func(i) { if (i == index) { updatedEntry } else { entriesArray[i] } },
    );
    user.sexualActivity.clear();
    user.sexualActivity.addAll(newEntriesArray.values());
    users.add(caller, user);
  };

  public shared ({ caller }) func deleteSexualActivityEntry(index : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Only users can delete sexual activity entries");
    };
    let user = getOrCreateUser(caller);
    let entriesArray = user.sexualActivity.toArray();
    if (entriesArray.size() <= index) {
      Runtime.trap("Sexual activity entry at index " # index.toText() # " does not exist.");
    };
    let newEntriesArray = Array.tabulate(
      entriesArray.size() - 1 : Nat,
      func(i) { entriesArray[if (i < index) { i } else { i + 1 }] },
    );
    user.sexualActivity.clear();
    user.sexualActivity.addAll(newEntriesArray.values());
    users.add(caller, user);
  };

  public query ({ caller }) func getSafePeriodStatus(date : Int) : async SafePeriodStatus {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Only users can query safe periods");
    };
    let user = getOrCreateUser(caller);
    let cycleDay = calculateDayInCycle(date, user);
    assessSafePeriod(cycleDay);
  };
};
