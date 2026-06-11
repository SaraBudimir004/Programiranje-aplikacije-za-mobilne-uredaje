import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../context/ThemeContext";
import { INCOME_ICONS } from "../../hooks/useTransactions";

type Props = {
    incomeInput: string;
    setIncomeInput: (v: string) => void;
    selectedSource: string;
    customIncome: string;
    setCustomIncome: (v: string) => void;
    onOpenDropdown: () => void;
    onAdd: () => void;
};

export default function IncomeForm({ incomeInput, setIncomeInput, selectedSource, customIncome, setCustomIncome, onOpenDropdown, onAdd }: Props) {
    const { colors } = useTheme();

    return (
        <View style={[styles.inputCard, { backgroundColor: colors.card }]}>
            <View style={styles.inputCardHeader}>
                <View style={[styles.inputCardIcon, { backgroundColor: "rgba(16,185,129,0.15)" }]}>
                    <Ionicons name="arrow-down-circle" size={22} color={colors.success} />
                </View>
                <Text style={[styles.inputCardTitle, { color: colors.text }]}>Dodaj prihod</Text>
            </View>

            <TextInput
                placeholder="Iznos u €"
                placeholderTextColor={colors.textMuted}
                keyboardType="numeric"
                value={incomeInput}
                onChangeText={setIncomeInput}
                style={[styles.input, { backgroundColor: colors.input, color: colors.text }]}
            />

            <Pressable style={[styles.dropdownTrigger, { backgroundColor: colors.input }]} onPress={onOpenDropdown}>
                <View style={styles.dropdownLeft}>
                    <Ionicons name={(INCOME_ICONS[selectedSource] || "cash") as any} size={16} color={colors.accent} />
                    <Text style={[styles.dropdownText, { color: colors.text }]}>{selectedSource}</Text>
                </View>
                <Ionicons name="chevron-down" size={18} color={colors.textMuted} />
            </Pressable>

            {selectedSource === "Ostalo (Upiši sam)" && (
                <TextInput
                    placeholder="Opis prihoda"
                    placeholderTextColor={colors.textMuted}
                    value={customIncome}
                    onChangeText={setCustomIncome}
                    style={[styles.input, { backgroundColor: colors.input, color: colors.text }]}
                />
            )}

            <Pressable style={[styles.primaryBtn, { backgroundColor: colors.success }]} onPress={onAdd}>
                <Ionicons name="add-circle" size={18} color="#fff" />
                <Text style={styles.primaryBtnText}>Dodaj prihod</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    inputCard: { borderRadius: 26, padding: 20, marginBottom: 16, shadowColor: "#000", shadowOpacity: 0.07, shadowRadius: 14, elevation: 3 },
    inputCardHeader: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 16 },
    inputCardIcon: { width: 42, height: 42, borderRadius: 13, justifyContent: "center", alignItems: "center" },
    inputCardTitle: { fontSize: 18, fontWeight: "800" },
    input: { borderRadius: 14, padding: 14, fontSize: 15, marginBottom: 10 },
    dropdownTrigger: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderRadius: 14, padding: 14, marginBottom: 10 },
    dropdownLeft: { flexDirection: "row", alignItems: "center", gap: 8 },
    dropdownText: { fontWeight: "600", fontSize: 15 },
    primaryBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", borderRadius: 16, padding: 15, gap: 8, marginTop: 4 },
    primaryBtnText: { color: "#fff", fontWeight: "800", fontSize: 15 },
});
