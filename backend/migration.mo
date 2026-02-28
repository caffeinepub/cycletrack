import Map "mo:core/Map";
import List "mo:core/List";
import Principal "mo:core/Principal";

module {
  type OldUserData = {
    cycles : List.List<{
      startDate : Int;
      endDate : Int;
      cycleLength : Nat;
    }>;
    preferences : {
      preferredCycleLength : Nat;
      lutealPhaseLength : Nat;
      reminderDaysBefore : Int;
    };
  };

  type NewUserData = {
    cycles : List.List<{
      startDate : Int;
      endDate : Int;
      cycleLength : Nat;
    }>;
    preferences : {
      preferredCycleLength : Nat;
      lutealPhaseLength : Nat;
      reminderDaysBefore : Int;
    };
    sexualActivity : List.List<{
      date : Int;
      protected : Bool;
      notes : ?Text;
    }>;
  };

  type OldActor = {
    users : Map.Map<Principal, OldUserData>;
  };

  type NewActor = {
    users : Map.Map<Principal, NewUserData>;
  };

  public func run(old : OldActor) : NewActor {
    let newUsers = old.users.map<Principal, OldUserData, NewUserData>(
      func(_p, oldUser) {
        {
          oldUser with
          sexualActivity = List.empty<{ date : Int; protected : Bool; notes : ?Text }>();
        };
      }
    );
    { users = newUsers };
  };
};
