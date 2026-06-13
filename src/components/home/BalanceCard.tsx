import { Ionicons } from "@expo/vector-icons";
import { Animated, StyleSheet, Text, View } from "react-native";

interface BalanceCardProps {
    colors: any;
    scaleAnim: Animated.Value;
    balance: number;
    monthlyBudget: number;
    spentPercent: number;
    budgetColor: string;
    totalIncome: number;
    totalExpense: number;
}

export default function BalanceCard({
                                        colors,
                                        scaleAnim,
                                        balance,
                                        monthlyBudget,
                                        spentPercent,
                                        budgetColor,
                                        totalIncome,
                                        totalExpense,
                                    }: BalanceCardProps) {
    return (
        <Animated.View
            style={[
                styles.balanceCard,
                {
                    backgroundColor: colors.card,
                    transform: [{ scale: scaleAnim }],
                },
            ]}
        >
            <View style={styles.balanceCardHeader}>
                <Text style={[styles.balanceLabel, { color: colors.textSecondary }]}>
                    Ukupno stanje
                </Text>
                <View style={[styles.liveBadge, { backgroundColor: colors.accentLight }]}>
                    <View style={[styles.liveDot, { backgroundColor: colors.accent }]} />
                    <Text style={[styles.liveText, { color: colors.accent }]}>LIVE</Text>
                </View>
            </View>
            <Text style={[styles.balance, { color: colors.text }]}>
                € {balance.toFixed(2)}
            </Text>

            {monthlyBudget > 0 && (
                <View style={styles.budgetBar}>
                    <View style={styles.budgetBarBg}>
                        <View
                            style={[
                                styles.budgetBarFill,
                                {
                                    width: `${spentPercent}%`,
                                    backgroundColor: budgetColor,
                                },
                            ]}
                        />
                    </View>
                    <Text style={[styles.budgetBarText, { color: colors.textMuted }]}>
                        {spentPercent.toFixed(0)}% budžeta iskorišteno
                    </Text>
                </View>
            )}

            <View style={styles.balanceRow}>
                <View style={[styles.miniCard, { backgroundColor: colors.cardStrong }]}>
                    <Ionicons
                        name="arrow-down-circle"
                        size={20}
                        color={colors.incomeGreen}
                    />
                    <View style={styles.miniCardText}>
                        <Text style={[styles.miniLabel, { color: colors.textMuted }]}>
                            Prihodi
                        </Text>
                        <Text style={[styles.miniAmount, { color: colors.incomeGreen }]}>
                            +€{totalIncome.toFixed(2)}
                        </Text>
                    </View>
                </View>
                <View style={[styles.miniCard, { backgroundColor: colors.cardStrong }]}>
                    <Ionicons
                        name="arrow-up-circle"
                        size={20}
                        color={colors.expenseRed}
                    />
                    <View style={styles.miniCardText}>
                        <Text style={[styles.miniLabel, { color: colors.textMuted }]}>
                            Troškovi
                        </Text>
                        <Text style={[styles.miniAmount, { color: colors.expenseRed }]}>
                            -€{totalExpense.toFixed(2)}
                        </Text>
                    </View>
                </View>
            </View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    balanceCard: {
        marginTop: 24,
        borderRadius: 28,
        padding: 22,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 20,
        shadowOffset: { width: 0, height: 8 },
        elevation: 6,
    },
    balanceCardHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    balanceLabel: { fontSize: 14, fontWeight: "500" },
    liveBadge: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 20,
        gap: 5,
    },
    liveDot: { width: 7, height: 7, borderRadius: 4 },
    liveText: { fontSize: 11, fontWeight: "800", letterSpacing: 1 },
    balance: { fontSize: 48, fontWeight: "900", marginTop: 8, letterSpacing: -1 },
    budgetBar: { marginTop: 16 },
    budgetBarBg: {
        height: 6,
        backgroundColor: "rgba(0,0,0,0.08)",
        borderRadius: 3,
        overflow: "hidden",
    },
    budgetBarFill: { height: 6, borderRadius: 3 },
    budgetBarText: { marginTop: 5, fontSize: 12, fontWeight: "500" },
    balanceRow: { flexDirection: "row", marginTop: 16, gap: 10 },
    miniCard: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        padding: 12,
        borderRadius: 16,
        gap: 8,
    },
    miniCardText: {},
    miniLabel: { fontSize: 11, fontWeight: "500" },
    miniAmount: { fontSize: 14, fontWeight: "800", marginTop: 2 },
});
