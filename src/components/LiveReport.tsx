import { useEffect, useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { auth, firestore } from "../../firebaseConfig";
import { collection, doc, onSnapshot } from "firebase/firestore";

interface Transaction {
    id: string;
    type: "income" | "expense";
    amount: string | number;
    category?: string;
    historicalBalance?: number;
    date?: any;
}

type Filter = "all" | "income" | "expense";

export default function LiveReport() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [currentBudget, setCurrentBudget] = useState(0);

    const [filter, setFilter] = useState<Filter>("all");

    useEffect(() => {
        const user = auth.currentUser;
        if (!user) return;

        const userRef = doc(firestore, "users", user.uid);

        const unsubUser = onSnapshot(userRef, (snap) => {
            if (snap.exists()) {
                const data = snap.data();
                const budgetValue =
                    data.totalBudget ?? data.monthlyBudget ?? 0;
                setCurrentBudget(Number(budgetValue));
            }
        });

        const transRef = collection(
            firestore,
            "users",
            user.uid,
            "transactions"
        );

        const unsubTrans = onSnapshot(transRef, (snap) => {
            const data: Transaction[] = snap.docs.map((d) => ({
                id: d.id,
                ...d.data(),
            })) as Transaction[];

            const sorted = data.sort((a, b) => {
                const timeA = a.date?.seconds
                    ? a.date.seconds * 1000
                    : Date.now();
                const timeB = b.date?.seconds
                    ? b.date.seconds * 1000
                    : Date.now();

                if (timeA !== timeB) return timeA - timeB;
                return a.id.localeCompare(b.id);
            });

            setTransactions(sorted);
        });

        return () => {
            unsubUser();
            unsubTrans();
        };
    }, []);

    let runningBalance = currentBudget;

    const filtered = transactions.filter((t) => {
        if (filter === "all") return true;
        return t.type === filter;
    });

    const transactionsWithHistory = [...filtered]
        .reverse()
        .map((t) => {
            const item = { ...t, historicalBalance: runningBalance };

            if (t.type === "expense") {
                runningBalance += Number(t.amount);
            } else {
                runningBalance -= Number(t.amount);
            }

            return item;
        });

    return (
        <View style={styles.container}>
            {/* HEADER */}
            <Text style={styles.balance}>
                Live Balance: € {currentBudget}
            </Text>

            <Text style={styles.title}>Transakcije</Text>

            {/* FILTER BUTTONS */}
            <View style={styles.tabs}>
                <Pressable
                    onPress={() => setFilter("all")}
                    style={[
                        styles.tab,
                        filter === "all" && styles.tabActive,
                    ]}
                >
                    <Text style={styles.tabText}>Sve</Text>
                </Pressable>

                <Pressable
                    onPress={() => setFilter("income")}
                    style={[
                        styles.tab,
                        filter === "income" && styles.tabIncome,
                    ]}
                >
                    <Text style={styles.tabText}>Prihodi</Text>
                </Pressable>

                <Pressable
                    onPress={() => setFilter("expense")}
                    style={[
                        styles.tab,
                        filter === "expense" && styles.tabExpense,
                    ]}
                >
                    <Text style={styles.tabText}>Rashodi</Text>
                </Pressable>
            </View>

            {/* LIST */}
            {transactionsWithHistory.length === 0 && (
                <Text style={styles.empty}>
                    Nema transakcija
                </Text>
            )}

            {transactionsWithHistory.map((t) => (
                <View key={t.id} style={styles.item}>
                    <View>
                        <Text style={styles.category}>
                            {t.category || "Uncategorized"}
                        </Text>

                        <Text style={styles.sub}>
                            {t.type === "income" ? "Prihod" : "Rashod"}
                        </Text>
                    </View>

                    <View style={{ alignItems: "flex-end" }}>
                        <Text
                            style={[
                                styles.amount,
                                t.type === "expense"
                                    ? styles.red
                                    : styles.green,
                            ]}
                        >
                            {t.type === "expense" ? "-" : "+"}
                            {Number(t.amount)} €
                        </Text>

                        <Text style={styles.historical}>
                            Ukupno: {t.historicalBalance} €
                        </Text>
                    </View>
                </View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 20,
        padding: 16,
        //backgroundColor: "rgba(219, 234, 254, 0.45)",
        backgroundColor: "rgba(147, 197, 253, 0.35)",
        borderRadius: 18,
    },

    balance: {
        color: "#0f172a",
        fontSize: 20,
        fontWeight: "800",
    },

    title: {
        marginTop: 6,
        color: "#334155",
        fontWeight: "600",
    },

    tabs: {
        flexDirection: "row",
        marginTop: 12,
        marginBottom: 12,
        gap: 10,
    },

    tab: {
        flex: 1,
        padding: 10,
        borderRadius: 12,
        backgroundColor: "rgba(255,255,255,0.9)",
        alignItems: "center",
    },

    tabActive: {
        backgroundColor: "#1f6feb",
    },

    tabIncome: {
        backgroundColor: "#10B981",
    },

    tabExpense: {
        backgroundColor: "#EF4444",
    },

    tabText: {
        color: "#0f172a",
        fontWeight: "700",
        fontSize: 13,
    },

    item: {
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 12,
        marginTop: 10,
        borderRadius: 14,

        backgroundColor: "rgba(255,255,255,0.9)",
    },

    category: {
        color: "#0f172a",
        fontSize: 15,
        fontWeight: "700",
    },

    sub: {
        color: "#64748b",
        fontSize: 12,
    },

    amount: {
        fontWeight: "800",
        fontSize: 15,
    },

    green: { color: "#10B981" },
    red: { color: "#EF4444" },

    historical: {
        color: "#64748b",
        fontSize: 11,
        marginTop: 2,
    },

    empty: {
        marginTop: 10,
        color: "#64748b",
    },
});