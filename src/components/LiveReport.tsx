import { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
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

export default function LiveReport() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [currentBudget, setCurrentBudget] = useState(0);

    useEffect(() => {
        const user = auth.currentUser;
        if (!user) return;

        const userRef = doc(firestore, "users", user.uid);
        const unsubscribeUser = onSnapshot(userRef, (userSnap) => {
            if (userSnap.exists()) {
                const data = userSnap.data();
                const budgetValue = data.totalBudget ?? data.monthlyBudget ?? 0;
                setCurrentBudget(Number(budgetValue));
            }
        });

        const transRef = collection(firestore, "users", user.uid, "transactions");
        const unsubscribeTrans = onSnapshot(transRef, (snap) => {
            const data: Transaction[] = snap.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            } as Transaction));

            // 🔥 SESTRENSKO SORTIRANJE (Sa zaštitom od privremenog null timestampa)
            const sorted = data.sort((a, b) => {
                // Ako serverTimestamp još nije stigao, stavljamo trenutno vrijeme u milisekundama
                const timeA = a.date?.seconds ? a.date.seconds * 1000 : Date.now();
                const timeB = b.date?.seconds ? b.date.seconds * 1000 : Date.now();

                if (timeA !== timeB) {
                    return timeA - timeB;
                }
                return a.id.localeCompare(b.id);
            });

            setTransactions(sorted);
        });

        return () => {
            unsubscribeUser();
            unsubscribeTrans();
        };
    }, []);

    let runningBalance = currentBudget;

    // Okrećemo listu tako da najnovija stavka odmah leti na vrh ljestvice!
    const transactionsWithHistory = [...transactions]
        .reverse()
        .map((t) => {
            const itemWithBalance = { ...t, historicalBalance: runningBalance };

            if (t.type === "expense") {
                runningBalance += Number(t.amount);
            } else if (t.type === "income") {
                runningBalance -= Number(t.amount);
            }

            return itemWithBalance;
        });

    return (
        <View style={styles.container}>
            <Text style={styles.balance}>
                Live Balance: $ {currentBudget}
            </Text>

            <Text style={styles.title}>Recent activity</Text>

            {transactions.length === 0 && (
                <Text style={styles.empty}>No transactions yet</Text>
            )}

            {/* TRANSACTIONS LIST */}
            {transactionsWithHistory.map((t) => (
                <View key={t.id} style={styles.item}>
                    <Text style={styles.category}>
                        {t.category || "Uncategorized"}
                    </Text>

                    <View style={styles.rightContainer}>
                        <Text
                            style={[
                                styles.amount,
                                { color: t.type === "expense" ? "#EF4444" : "#10B981" },
                            ]}
                        >
                            {t.type === "expense" ? "-" : "+"}
                            {Number(t.amount)} $
                        </Text>

                        <Text style={styles.historicalBalanceText}>
                            Ukupno: {t.historicalBalance} $
                        </Text>
                    </View>
                </View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { marginTop: 20, padding: 15, backgroundColor: "#0B1220", borderRadius: 16, borderWidth: 1, borderColor: "#1F2937" },
    balance: { color: "#10B981", fontSize: 20, fontWeight: "800", marginBottom: 15 },
    title: { color: "#94A3B8", fontWeight: "600", marginBottom: 10 },
    empty: { color: "#64748B" },
    item: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 10,
        marginTop: 8,
        backgroundColor: "#1F2937",
        borderRadius: 10
    },
    category: { color: "white", fontSize: 16 },
    rightContainer: { alignItems: "flex-end" },
    amount: { fontWeight: "700", fontSize: 16 },
    historicalBalanceText: { color: "#94A3B8", fontSize: 12, marginTop: 2 },
});