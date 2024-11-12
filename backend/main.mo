import Bool "mo:base/Bool";

import HashMap "mo:base/HashMap";
import Hash "mo:base/Hash";
import Iter "mo:base/Iter";
import Text "mo:base/Text";
import Option "mo:base/Option";
import Array "mo:base/Array";

actor {
    // Define TaxPayer record type
    public type TaxPayer = {
        tid: Text;
        firstName: Text;
        lastName: Text;
        address: Text;
    };

    // Create stable storage for upgrades
    private stable var taxpayerEntries : [(Text, TaxPayer)] = [];
    
    // Initialize HashMap with stable data
    private var taxpayers = HashMap.HashMap<Text, TaxPayer>(0, Text.equal, Text.hash);

    // System functions for upgrades
    system func preupgrade() {
        taxpayerEntries := Iter.toArray(taxpayers.entries());
    };

    system func postupgrade() {
        taxpayers := HashMap.fromIter<Text, TaxPayer>(taxpayerEntries.vals(), 0, Text.equal, Text.hash);
        taxpayerEntries := [];
    };

    // Add new taxpayer record
    public func addTaxPayer(tp: TaxPayer) : async Bool {
        taxpayers.put(tp.tid, tp);
        return true;
    };

    // Get taxpayer by TID
    public query func getTaxPayer(tid: Text) : async ?TaxPayer {
        taxpayers.get(tid)
    };

    // Get all taxpayers
    public query func getAllTaxPayers() : async [TaxPayer] {
        Iter.toArray(taxpayers.vals())
    };
}
