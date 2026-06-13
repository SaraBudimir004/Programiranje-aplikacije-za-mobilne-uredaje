import { useEffect, useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { auth, firestore } from "../../firebaseConfig";
import { collection, doc, onSnapshot } from "firebase/firestore";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";

interface Transaction {
    id: string;
    type: "income" | "expense";
    amount: string | number;
    category?: string;
    date?: any;
}

type Filter = "all" | "income" | "expense";

export default function LiveReport() {
    const { colors } = useTheme();
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
                setCurrentBudget(Number(data.totalBudget ?? data.monthlyBudget ?? 0));
            }
        });
        const transRef = collection(firestore, "users", user.uid, "transactions");
        const unsubTrans = onSnapshot(transRef, (snap) => {
            const data: Transaction[] = snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Transaction[];
            const sorted = data.sort((a, b) => {
                const ta = a.date?.seconds ? a.date.seconds * 1000 : Date.now();
                const tb = b.date?.seconds ? b.date.seconds * 1000 : Date.now();
                return tb - ta;
            });
            setTransactions(sorted);
        });
        return () => { unsubUser(); unsubTrans(); };
    }, []);

    const filtered = transactions.filter((t) => filter === "all" || t.type === filter);

    const CATEGORY_ICONS: Record<string, string> = {
        "Hrana": "restaurant", "Prijevoz": "car", "Šoping": "bag-handle",
        "Zabava": "game-controller", "Računi": "receipt", "Plaća": "cash",
        "Freelance": "laptop", "Bonus": "gift",
    };

    const formatDate = (dateField: any) => {
        if (!dateField?.seconds) return "";
        const d = new Date(dateField.seconds * 1000);
        return d.toLocaleDateString("hr-HR", { day: "2-digit", month: "2-digit" });
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.card }]}>
            <View style={styles.header}>
                <View>
                    <Text style={[styles.title, { color: colors.text }]}>Transakcije</Text>
                    <Text style={[styles.count, { color: colors.textMuted }]}>{filtered.length} zapisa</Text>
                </View>
                <View style={[styles.liveChip, { backgroundColor: colors.accentLight }]}>
                    <View style={[styles.liveDot, { backgroundColor: colors.accent }]} />
                    <Text style={[styles.liveLabel, { color: colors.accent }]}>LIVE</Text>
                </View>
            </View>

            {/* FILTER */}
            <View style={styles.tabs}>
                {(["all", "income", "expense"] as Filter[]).map((f) => {
                    const labels = { all: "Sve", income: "Prihodi", expense: "Rashodi" };
                    const activeColors = { all: colors.accent, income: colors.success, expense: colors.danger };
                    const isActive = filter === f;
                    return (
                        <Pressable
                            key={f}
                            onPress={() => setFilter(f)}
                            style={[styles.tab, isActive && { backgroundColor: activeColors[f] }]}
                        >
                            <Text style={[styles.tabText, { color: isActive ? "#fff" : colors.textSecondary }]}>{labels[f]}</Text>
                        </Pressable>
                    );
                })}
            </View>

            {filtered.length === 0 && (
                <Text style={[styles.empty, { color: colors.textMuted }]}>Nema transakcija</Text>
            )}

            {filtered.map((t) => (
                <View key={t.id} style={[styles.item, { backgroundColor: colors.cardStrong }]}>
                    <View style={[styles.itemIcon, {
                        backgroundColor: t.type === "income" ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.15)"
                    }]}>
                        <Ionicons
                            name={(CATEGORY_ICONS[t.category || ""] || (t.type === "income" ? "arrow-down" : "arrow-up")) as any}
                            size={16}
                            color={t.type === "income" ? colors.incomeGreen : colors.expenseRed}
                        />
                    </View>
                    <View style={styles.itemInfo}>
                        <Text style={[styles.category, { color: colors.text }]}>{t.category || "Ostalo"}</Text>
                        <Text style={[styles.sub, { color: colors.textMuted }]}>
                            {t.type === "income" ? "Prihod" : "Rashod"}{t.date ? " · " + formatDate(t.date) : ""}
                        </Text>
                    </View>
                    <Text style={[styles.amount, { color: t.type === "income" ? colors.incomeGreen : colors.expenseRed }]}>
                        {t.type === "income" ? "+" : "-"}€{Number(t.amount).toFixed(2)}
                    </Text>
                </View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { marginTop: 16, borderRadius: 22, padding: 16, shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 12, elevation: 3 },
    header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
    title: { fontSize: 18, fontWeight: "800" },
    count: { fontSize: 12, marginTop: 2 },
    liveChip: { flexDirection: "row", alignItems: "center", paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20, gap: 5 },
    liveDot: { width: 7, height: 7, borderRadius: 4 },
    liveLabel: { fontSize: 11, fontWeight: "800", letterSpacing: 1 },
    tabs: { flexDirection: "row", gap: 8, marginBottom: 12 },
    tab: { flex: 1, padding: 10, borderRadius: 12, alignItems: "center", backgroundColor: "rgba(0,0,0,0.05)" },
    tabText: { fontWeight: "700", fontSize: 12 },
    item: { flexDirection: "row", alignItems: "center", padding: 12, marginTop: 8, borderRadius: 16, gap: 10 },
    itemIcon: { width: 38, height: 38, borderRadius: 12, justifyContent: "center", alignItems: "center" },
    itemInfo: { flex: 1 },
    category: { fontSize: 14, fontWeight: "700" },
    sub: { fontSize: 11, marginTop: 2 },
    amount: { fontSize: 15, fontWeight: "800" },
    empty: { marginTop: 10, textAlign: "center", fontSize: 14 },
});
