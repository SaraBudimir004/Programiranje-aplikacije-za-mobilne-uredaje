import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import { useTheme } from "../../context/ThemeContext";

type Props = {
    budget: number | null;
    budgetInput: string;
    setBudgetInput: (v: string) => void;
    loading: boolean;
    onSaveBudget: () => void;
};

export default function BalanceCard({ budget, budgetInput, setBudgetInput, loading, onSaveBudget }: Props) {
    const { colors } = useTheme();

    return (
        <View style={[styles.balanceCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.balanceLabel, { color: colors.textSecondary }]}>Trenutno stanje</Text>
            <Text style={[styles.balanceValue, { color: colors.text }]}>
                {budget !== null ? `€ ${Number(budget).toFixed(2)}` : "Nema budžeta"}
            </Text>
            {budget === null && (
                <View style={styles.setBudgetContainer}>
                    <TextInput
                        placeholder="Postavi početni budžet"
                        placeholderTextColor={colors.textMuted}
                        keyboardType="numeric"
                        value={budgetInput}
                        onChangeText={setBudgetInput}
                        style={[styles.bigInput, { backgroundColor: colors.input, color: colors.text }]}
                    />
                    <Pressable style={[styles.primaryBtn, { backgroundColor: colors.accent }]} onPress={onSaveBudget}>
                        <Text style={styles.primaryBtnText}>{loading ? "Spremanje..." : "Postavi budžet"}</Text>
                    </Pressable>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    balanceCard: { borderRadius: 26, padding: 22, marginBottom: 16, shadowColor: "#000", shadowOpacity: 0.08, shadowRadius: 16, elevation: 4 },
    balanceLabel: { fontSize: 14, fontWeight: "500" },
    balanceValue: { fontSize: 40, fontWeight: "900", marginTop: 6 },
    setBudgetContainer: { marginTop: 14, gap: 10 },
    bigInput: { borderRadius: 14, padding: 14, fontSize: 16 },
    primaryBtn: { borderRadius: 16, padding: 15, alignItems: "center" },
    primaryBtnText: { color: "#fff", fontWeight: "800", fontSize: 15 },
});
