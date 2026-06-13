import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface RecentTransactionsProps {
    colors: any;
    recentTransactions: any[];
    onSeeAll: () => void;
}

export default function RecentTransactions({
                                               colors,
                                               recentTransactions,
                                               onSeeAll,
                                           }: RecentTransactionsProps) {
    if (recentTransactions.length === 0) return null;

    return (
        <>
            <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 0 }]}>
                    Nedavne transakcije
                </Text>
                <Pressable onPress={onSeeAll}>
                    <Text style={[styles.seeAll, { color: colors.accent }]}>Vidi sve</Text>
                </Pressable>
            </View>
            {recentTransactions.map((t) => (
                <View
                    key={t.id}
                    style={[styles.transactionItem, { backgroundColor: colors.card }]}
                >
                    <View
                        style={[
                            styles.transIcon,
                            {
                                backgroundColor:
                                    t.type === "income"
                                        ? "rgba(16,185,129,0.15)"
                                        : "rgba(239,68,68,0.15)",
                            },
                        ]}
                    >
                        <Ionicons
                            name={t.type === "income" ? "arrow-down" : "arrow-up"}
                            size={16}
                            color={t.type === "income" ? colors.incomeGreen : colors.expenseRed}
                        />
                    </View>
                    <View style={styles.transInfo}>
                        <Text style={[styles.transCategory, { color: colors.text }]}>
                            {t.category || "Ostalo"}
                        </Text>
                        <Text style={[styles.transType, { color: colors.textMuted }]}>
                            {t.type === "income" ? "Prihod" : "Rashod"}
                        </Text>
                    </View>
                    <Text
                        style={[
                            styles.transAmount,
                            {
                                color: t.type === "income" ? colors.incomeGreen : colors.expenseRed,
                            },
                        ]}
                    >
                        {t.type === "income" ? "+" : "-"}€{Number(t.amount).toFixed(2)}
                    </Text>
                </View>
            ))}
        </>
    );
}

const styles = StyleSheet.create({
    sectionTitle: {
        marginTop: 28,
        marginBottom: 14,
        fontSize: 20,
        fontWeight: "800",
    },
    sectionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 28,
        marginBottom: 14,
    },
    seeAll: { fontSize: 14, fontWeight: "600" },
    transactionItem: {
        flexDirection: "row",
        alignItems: "center",
        padding: 14,
        borderRadius: 16,
        marginBottom: 8,
        shadowColor: "#000",
        shadowOpacity: 0.04,
        shadowRadius: 8,
        elevation: 2,
    },
    transIcon: {
        width: 38,
        height: 38,
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
    },
    transInfo: { flex: 1, marginLeft: 12 },
    transCategory: { fontSize: 15, fontWeight: "700" },
    transType: { fontSize: 12, marginTop: 2 },
    transAmount: { fontSize: 16, fontWeight: "800" },
});
