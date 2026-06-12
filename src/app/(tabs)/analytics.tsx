import {
    View, Text, StyleSheet, ScrollView, Pressable, Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ScreenBackground from "../../components/ScreenBackground";
import { auth, firestore } from "../../../firebaseConfig";
import { collection, doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useTheme } from "../../context/ThemeContext";

const { width: W } = Dimensions.get("window");

const CATEGORY_ICONS: Record<string, string> = {
    "Hrana": "restaurant",
    "Prijevoz": "car",
    "Šoping": "bag-handle",
    "Zabava": "game-controller",
    "Računi": "receipt",
    "Plaća": "cash",
    "Freelance": "laptop",
    "Bonus": "gift",
    "Ostalo": "ellipsis-horizontal-circle",
};

const CATEGORY_COLORS = ["#3b82f6","#10b981","#f59e0b","#ef4444","#a78bfa","#ec4899","#06b6d4","#84cc16"];

type MonthData = { month: string; income: number; expense: number };

function getMonthLabel(dateStr: string): string {
    const months = ["Sij","Velj","Ožu","Tra","Svi","Lip","Srp","Kol","Ruj","Lis","Stu","Pro"];
    const d = new Date(dateStr);
    return `${months[d.getMonth()]} ${d.getFullYear().toString().slice(2)}`;
}

export default function Analytics() {
    const { colors } = useTheme();
    const [transactions, setTransactions] = useState<any[]>([]);
    const [monthlyBudget, setMonthlyBudget] = useState(0);
    const [totalBudget, setTotalBudget] = useState(0);
    const [activeTab, setActiveTab] = useState<"overview"|"categories"|"months">("overview");

    useEffect(() => {
        const user = auth.currentUser;
        if (!user) return;
        const userRef = doc(firestore, "users", user.uid);
        const unsubUser = onSnapshot(userRef, (snap) => {
            if (snap.exists()) {
                const d = snap.data();
                setMonthlyBudget(d.monthlyBudget || 0);
                setTotalBudget(d.totalBudget || 0);
            }
        });
        const transRef = collection(firestore, "users", user.uid, "transactions");
        const unsubTrans = onSnapshot(transRef, (snap) => {
            const data = snap.docs.map((d) => ({ id: d.id, ...d.data() })) as any[];
            setTransactions(data);
        });
        return () => { unsubUser(); unsubTrans(); };
    }, []);

    const expenses = transactions.filter((t) => t.type === "expense");
    const incomes = transactions.filter((t) => t.type === "income");
    const totalExpense = expenses.reduce((s, t) => s + Number(t.amount), 0);
    const totalIncome = incomes.reduce((s, t) => s + Number(t.amount), 0);
    const savings = totalIncome - totalExpense;
    const spentPct = monthlyBudget > 0 ? Math.min((totalExpense / monthlyBudget) * 100, 100) : 0;

    // Category breakdown
    const catMap: Record<string, number> = {};
    expenses.forEach((t) => {
        const cat = t.category || "Ostalo";
        catMap[cat] = (catMap[cat] || 0) + Number(t.amount);
    });
    const catEntries = Object.entries(catMap).sort((a, b) => b[1] - a[1]);

    // Top 3 expenses
    const top3 = [...expenses].sort((a, b) => Number(b.amount) - Number(a.amount)).slice(0, 3);

    // Monthly breakdown
    const monthMap: Record<string, MonthData> = {};
    transactions.forEach((t) => {
        const key = t.date?.seconds
            ? new Date(t.date.seconds * 1000).toISOString().slice(0, 7)
            : new Date().toISOString().slice(0, 7);
        if (!monthMap[key]) monthMap[key] = { month: key, income: 0, expense: 0 };
        if (t.type === "income") monthMap[key].income += Number(t.amount);
        else monthMap[key].expense += Number(t.amount);
    });
    const months = Object.values(monthMap).sort((a, b) => a.month.localeCompare(b.month)).slice(-6);
    const maxMonthVal = Math.max(...months.flatMap(m => [m.income, m.expense]), 1);

    return (
        <ScreenBackground>
            <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
                <Text style={[styles.pageTitle, { color: colors.text }]}>Analitika 📊</Text>
                <Text style={[styles.pageSubtitle, { color: colors.textSecondary }]}>Pregled tvojih financija</Text>

                {/* SUMMARY CARDS */}
                <View style={styles.summaryRow}>
                    <View style={[styles.summaryCard, { backgroundColor: "rgba(16,185,129,0.18)" }]}>
                        <Ionicons name="arrow-down-circle" size={22} color={colors.success} />
                        <Text style={[styles.summaryAmount, { color: colors.success }]}>€{totalIncome.toFixed(2)}</Text>
                        <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Prihodi</Text>
                    </View>
                    <View style={[styles.summaryCard, { backgroundColor: "rgba(239,68,68,0.18)" }]}>
                        <Ionicons name="arrow-up-circle" size={22} color={colors.danger} />
                        <Text style={[styles.summaryAmount, { color: colors.danger }]}>€{totalExpense.toFixed(2)}</Text>
                        <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Troškovi</Text>
                    </View>
                    <View style={[styles.summaryCard, { backgroundColor: savings >= 0 ? "rgba(37,99,235,0.18)" : "rgba(239,68,68,0.18)" }]}>
                        <Ionicons name="wallet" size={22} color={savings >= 0 ? colors.accent : colors.danger} />
                        <Text style={[styles.summaryAmount, { color: savings >= 0 ? colors.accent : colors.danger }]}>€{savings.toFixed(2)}</Text>
                        <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Ušteda</Text>
                    </View>
                </View>

                {/* BUDGET PROGRESS */}
                {monthlyBudget > 0 && (
                    <View style={[styles.budgetCard, { backgroundColor: colors.card }]}>
                        <View style={styles.budgetHeader}>
                            <Text style={[styles.cardTitle, { color: colors.text }]}>Preostali budžet</Text>
                            <Text style={[styles.budgetPct, { color: spentPct > 80 ? colors.danger : colors.accent }]}>{spentPct.toFixed(0)}%</Text>
                        </View>
                        <View style={styles.budgetBarBg}>
                            <View style={[styles.budgetBarFill, {
                                width: `${spentPct}%`,
                                backgroundColor: spentPct > 80 ? colors.danger : spentPct > 50 ? colors.warning : colors.success
                            }]} />
                        </View>
                        <View style={styles.budgetNumbers}>
                            <Text style={[styles.budgetNum, { color: colors.textSecondary }]}>Potrošeno: €{totalExpense.toFixed(2)}</Text>
                            <Text style={[styles.budgetNum, { color: colors.textSecondary }]}>Budžet: €{monthlyBudget.toFixed(2)}</Text>
                        </View>
                    </View>
                )}

                {/* TABS */}
                <View style={[styles.tabs, { backgroundColor: colors.card }]}>
                    {(["overview","categories","months"] as const).map((tab) => (
                        <Pressable
                            key={tab}
                            style={[styles.tab, activeTab === tab && { backgroundColor: colors.accent }]}
                            onPress={() => setActiveTab(tab)}
                        >
                            <Text style={[styles.tabText, { color: activeTab === tab ? "#fff" : colors.textSecondary }]}>
                                {tab === "overview" ? "Pregled" : tab === "categories" ? "Kategorije" : "Mjeseci"}
                            </Text>
                        </Pressable>
                    ))}
                </View>

                {/* OVERVIEW TAB */}
                {activeTab === "overview" && (
                    <View>
                        <Text style={[styles.cardTitle, { color: colors.text, marginBottom: 12 }]}>Top 3 troška</Text>
                        {top3.length === 0 && <Text style={[styles.empty, { color: colors.textMuted }]}>Nema troškova</Text>}
                        {top3.map((t, i) => (
                            <View key={t.id} style={[styles.topItem, { backgroundColor: colors.card }]}>
                                <View style={[styles.topRank, { backgroundColor: i === 0 ? "#f59e0b" : i === 1 ? "#94a3b8" : "#b45309" }]}>
                                    <Text style={styles.topRankText}>#{i + 1}</Text>
                                </View>
                                <View style={styles.topInfo}>
                                    <Text style={[styles.topCategory, { color: colors.text }]}>{t.category || "Ostalo"}</Text>
                                </View>
                                <Text style={[styles.topAmount, { color: colors.danger }]}>-€{Number(t.amount).toFixed(2)}</Text>
                            </View>
                        ))}

                        {/* Income vs Expense visual */}
                        <Text style={[styles.cardTitle, { color: colors.text, marginTop: 20, marginBottom: 12 }]}>Prihodi vs Rashodi</Text>
                        <View style={[styles.vsCard, { backgroundColor: colors.card }]}>
                            {totalIncome + totalExpense > 0 ? (
                                <>
                                    <View style={styles.vsBarContainer}>
                                        <View style={[styles.vsBarIncome, { flex: totalIncome || 0.001, backgroundColor: colors.success }]} />
                                        <View style={[styles.vsBarExpense, { flex: totalExpense || 0.001, backgroundColor: colors.danger }]} />
                                    </View>
                                    <View style={styles.vsLegend}>
                                        <View style={styles.vsLegendItem}>
                                            <View style={[styles.vsLegendDot, { backgroundColor: colors.success }]} />
                                            <Text style={[styles.vsLegendText, { color: colors.textSecondary }]}>Prihodi {totalIncome > 0 ? ((totalIncome/(totalIncome+totalExpense))*100).toFixed(0) : 0}%</Text>
                                        </View>
                                        <View style={styles.vsLegendItem}>
                                            <View style={[styles.vsLegendDot, { backgroundColor: colors.danger }]} />
                                            <Text style={[styles.vsLegendText, { color: colors.textSecondary }]}>Rashodi {totalExpense > 0 ? ((totalExpense/(totalIncome+totalExpense))*100).toFixed(0) : 0}%</Text>
                                        </View>
                                    </View>
                                </>
                            ) : (
                                <Text style={[styles.empty, { color: colors.textMuted }]}>Nema podataka</Text>
                            )}
                        </View>
                    </View>
                )}

                {/* CATEGORIES TAB */}
                {activeTab === "categories" && (
                    <View>
                        <Text style={[styles.cardTitle, { color: colors.text, marginBottom: 12 }]}>Potrošnja po kategorijama</Text>
                        {catEntries.length === 0 && <Text style={[styles.empty, { color: colors.textMuted }]}>Nema troškova</Text>}
                        {catEntries.map(([cat, amount], i) => {
                            const pct = totalExpense > 0 ? (amount / totalExpense) * 100 : 0;
                            const col = CATEGORY_COLORS[i % CATEGORY_COLORS.length];
                            return (
                                <View key={cat} style={[styles.catItem, { backgroundColor: colors.card }]}>
                                    <View style={[styles.catIcon, { backgroundColor: col + "22" }]}>
                                        <Ionicons name={(CATEGORY_ICONS[cat] || "ellipsis-horizontal-circle") as any} size={18} color={col} />
                                    </View>
                                    <View style={styles.catInfo}>
                                        <View style={styles.catHeader}>
                                            <Text style={[styles.catName, { color: colors.text }]}>{cat}</Text>
                                            <Text style={[styles.catAmount, { color: colors.danger }]}>€{amount.toFixed(2)}</Text>
                                        </View>
                                        <View style={styles.catBarBg}>
                                            <View style={[styles.catBarFill, { width: `${pct}%`, backgroundColor: col }]} />
                                        </View>
                                        <Text style={[styles.catPct, { color: colors.textMuted }]}>{pct.toFixed(1)}% ukupnih troškova</Text>
                                    </View>
                                </View>
                            );
                        })}
                    </View>
                )}

                {/* MONTHS TAB */}
                {activeTab === "months" && (
                    <View>
                        <Text style={[styles.cardTitle, { color: colors.text, marginBottom: 12 }]}>Posljednjih 6 mjeseci</Text>
                        {months.length === 0 && <Text style={[styles.empty, { color: colors.textMuted }]}>Nema podataka</Text>}
                        {months.map((m, i) => (
                            <View key={m.month} style={[styles.monthItem, { backgroundColor: colors.card }]}>
                                <Text style={[styles.monthLabel, { color: colors.text }]}>{getMonthLabel(m.month + "-01")}</Text>
                                <View style={styles.monthBars}>
                                    <View style={styles.monthBarRow}>
                                        <Text style={[styles.monthBarLabel, { color: colors.textMuted }]}>Prihodi</Text>
                                        <View style={styles.monthBarBg}>
                                            <View style={[styles.monthBarFill, { width: `${(m.income / maxMonthVal) * 100}%`, backgroundColor: colors.success }]} />
                                        </View>
                                        <Text style={[styles.monthBarAmt, { color: colors.success }]}>€{m.income.toFixed(0)}</Text>
                                    </View>
                                    <View style={styles.monthBarRow}>
                                        <Text style={[styles.monthBarLabel, { color: colors.textMuted }]}>Rashodi</Text>
                                        <View style={styles.monthBarBg}>
                                            <View style={[styles.monthBarFill, { width: `${(m.expense / maxMonthVal) * 100}%`, backgroundColor: colors.danger }]} />
                                        </View>
                                        <Text style={[styles.monthBarAmt, { color: colors.danger }]}>€{m.expense.toFixed(0)}</Text>
                                    </View>
                                </View>
                            </View>
                        ))}
                    </View>
                )}

            </ScrollView>
        </ScreenBackground>
    );
}

const styles = StyleSheet.create({
    container: { padding: 22, paddingTop: 65, paddingBottom: 120 },
    pageTitle: { fontSize: 30, fontWeight: "900" },
    pageSubtitle: { fontSize: 15, marginTop: 4, marginBottom: 20 },
    summaryRow: { flexDirection: "row", gap: 10, marginBottom: 16 },
    summaryCard: { flex: 1, borderRadius: 20, padding: 14, alignItems: "center", gap: 4 },
    summaryAmount: { fontSize: 16, fontWeight: "800" },
    summaryLabel: { fontSize: 11, fontWeight: "500" },
    budgetCard: { borderRadius: 22, padding: 18, marginBottom: 16, shadowColor: "#000", shadowOpacity: 0.07, shadowRadius: 12, elevation: 3 },
    budgetHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 10 },
    budgetPct: { fontSize: 18, fontWeight: "800" },
    budgetBarBg: { height: 8, backgroundColor: "rgba(0,0,0,0.08)", borderRadius: 4, overflow: "hidden" },
    budgetBarFill: { height: 8, borderRadius: 4 },
    budgetNumbers: { flexDirection: "row", justifyContent: "space-between", marginTop: 8 },
    budgetNum: { fontSize: 12 },
    tabs: { flexDirection: "row", borderRadius: 16, padding: 4, marginBottom: 16 },
    tab: { flex: 1, paddingVertical: 10, borderRadius: 12, alignItems: "center" },
    tabText: { fontSize: 13, fontWeight: "700" },
    cardTitle: { fontSize: 18, fontWeight: "800" },
    empty: { fontSize: 14, textAlign: "center", marginTop: 20 },
    topItem: { flexDirection: "row", alignItems: "center", padding: 14, borderRadius: 16, marginBottom: 8, gap: 12 },
    topRank: { width: 32, height: 32, borderRadius: 10, justifyContent: "center", alignItems: "center" },
    topRankText: { color: "#fff", fontWeight: "800", fontSize: 12 },
    topInfo: { flex: 1 },
    topCategory: { fontSize: 15, fontWeight: "700" },
    topAmount: { fontSize: 16, fontWeight: "800" },
    vsCard: { borderRadius: 22, padding: 18, marginBottom: 8 },
    vsBarContainer: { flexDirection: "row", height: 16, borderRadius: 8, overflow: "hidden" },
    vsBarIncome: { borderTopLeftRadius: 8, borderBottomLeftRadius: 8 },
    vsBarExpense: { borderTopRightRadius: 8, borderBottomRightRadius: 8 },
    vsLegend: { flexDirection: "row", justifyContent: "center", gap: 24, marginTop: 12 },
    vsLegendItem: { flexDirection: "row", alignItems: "center", gap: 6 },
    vsLegendDot: { width: 10, height: 10, borderRadius: 5 },
    vsLegendText: { fontSize: 13, fontWeight: "600" },
    catItem: { flexDirection: "row", alignItems: "center", padding: 14, borderRadius: 16, marginBottom: 8, gap: 12 },
    catIcon: { width: 40, height: 40, borderRadius: 12, justifyContent: "center", alignItems: "center" },
    catInfo: { flex: 1 },
    catHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 6 },
    catName: { fontSize: 15, fontWeight: "700" },
    catAmount: { fontSize: 15, fontWeight: "800" },
    catBarBg: { height: 5, backgroundColor: "rgba(0,0,0,0.08)", borderRadius: 3, overflow: "hidden" },
    catBarFill: { height: 5, borderRadius: 3 },
    catPct: { fontSize: 11, marginTop: 4 },
    monthItem: { borderRadius: 18, padding: 14, marginBottom: 10 },
    monthLabel: { fontSize: 16, fontWeight: "700", marginBottom: 10 },
    monthBars: { gap: 8 },
    monthBarRow: { flexDirection: "row", alignItems: "center", gap: 8 },
    monthBarLabel: { width: 55, fontSize: 11, fontWeight: "500" },
    monthBarBg: { flex: 1, height: 6, backgroundColor: "rgba(0,0,0,0.08)", borderRadius: 3, overflow: "hidden" },
    monthBarFill: { height: 6, borderRadius: 3 },
    monthBarAmt: { width: 60, fontSize: 12, fontWeight: "700", textAlign: "right" },
});
