import { View, Text, Pressable, StyleSheet, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../context/ThemeContext";
import { useTransactions, INCOME_SOURCES, EXPENSE_CATEGORIES, INCOME_ICONS, EXPENSE_ICONS } from "../../hooks/useTransactions";
import ScreenBackground from "../../components/ScreenBackground";
import LiveReport from "../../components/LiveReport";
import BalanceCard from "../../components/transactions/BalanceCard";
import SectionToggle from "../../components/transactions/SectionToggle";
import IncomeForm from "../../components/transactions/IncomeForm";
import ExpenseForm from "../../components/transactions/ExpenseForm";
import CategoryModal from "../../components/transactions/CategoryModal";

export default function TransactionsScreen() {
    const router = useRouter();
    const { colors } = useTheme();
    const {
        budget, budgetInput, setBudgetInput,
        incomeInput, setIncomeInput,
        expenseInput, setExpenseInput,
        selectedIncomeSource, setSelectedIncomeSource,
        selectedExpenseCategory, setSelectedExpenseCategory,
        customIncome, setCustomIncome,
        customExpense, setCustomExpense,
        loading, toast,
        incomeDropdownOpen, setIncomeDropdownOpen,
        expenseDropdownOpen, setExpenseDropdownOpen,
        activeSection, setActiveSection,
        handleSaveBudget, handleAddIncome, handleAddExpense,
    } = useTransactions();

    return (
        <ScreenBackground>
            {/* TOAST */}
            {toast && (
                <View style={[styles.toast, { backgroundColor: toast.type === "success" ? "#22c55e" : "#ef4444" }]}>
                    <Ionicons name={toast.type === "success" ? "checkmark-circle" : "warning"} size={18} color="#fff" />
                    <Text style={styles.toastText}>{toast.msg}</Text>
                </View>
            )}

            <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>

                <View>
                    <Text style={[styles.pageTitle, { color: colors.text }]}>Transakcije </Text>
                    <View style={{ height: 40 }} />
                </View>

                {/* SCAN RECEIPT */}
                <Pressable
                    style={[styles.scanReceiptBtn, { backgroundColor: "rgba(251,146,60,0.15)", borderColor: "#FB923C", borderWidth: 1.5 }]}
                    onPress={() => router.push("/receipts")}
                >
                    <Ionicons name="scan" size={20} color="#FB923C" />
                    <Text style={[styles.scanReceiptText, { color: "#FB923C" }]}>Skeniraj račun s kamerom / galerije</Text>
                    <Ionicons name="chevron-forward" size={16} color="#FB923C" />
                </Pressable>

                <BalanceCard
                    budget={budget}
                    budgetInput={budgetInput}
                    setBudgetInput={setBudgetInput}
                    loading={loading}
                    onSaveBudget={handleSaveBudget}
                />

                <SectionToggle activeSection={activeSection} onSelect={setActiveSection} />

                {activeSection === "income" && (
                    <IncomeForm
                        incomeInput={incomeInput}
                        setIncomeInput={setIncomeInput}
                        selectedSource={selectedIncomeSource}
                        customIncome={customIncome}
                        setCustomIncome={setCustomIncome}
                        onOpenDropdown={() => setIncomeDropdownOpen(true)}
                        onAdd={handleAddIncome}
                    />
                )}

                {activeSection === "expense" && (
                    <ExpenseForm
                        expenseInput={expenseInput}
                        setExpenseInput={setExpenseInput}
                        selectedCategory={selectedExpenseCategory}
                        customExpense={customExpense}
                        setCustomExpense={setCustomExpense}
                        onOpenDropdown={() => setExpenseDropdownOpen(true)}
                        onAdd={handleAddExpense}
                    />
                )}

                <LiveReport />
            </ScrollView>

            {/* MODALI */}
            <CategoryModal
                visible={incomeDropdownOpen}
                onClose={() => setIncomeDropdownOpen(false)}
                title="Odaberi vrstu prihoda"
                items={INCOME_SOURCES}
                icons={INCOME_ICONS}
                selected={selectedIncomeSource}
                onSelect={setSelectedIncomeSource}
                accentColor={colors.accent}
                accentLightColor={colors.accentLight}
            />

            <CategoryModal
                visible={expenseDropdownOpen}
                onClose={() => setExpenseDropdownOpen(false)}
                title="Odaberi kategoriju troška"
                items={EXPENSE_CATEGORIES}
                icons={EXPENSE_ICONS}
                selected={selectedExpenseCategory}
                onSelect={setSelectedExpenseCategory}
                accentColor={colors.danger}
                accentLightColor="rgba(239,68,68,0.1)"
            />
        </ScreenBackground>
    );
}

const styles = StyleSheet.create({
    container: { padding: 20, paddingTop: 65, paddingBottom: 120 },
    pageTitle: { fontSize: 30, fontWeight: "900" },
    pageSubtitle: { fontSize: 15, marginTop: 4, marginBottom: 12 },
    scanReceiptBtn: { flexDirection: "row", alignItems: "center", gap: 10, borderRadius: 16, paddingVertical: 14, paddingHorizontal: 16, marginBottom: 16 },
    scanReceiptText: { flex: 1, fontWeight: "700", fontSize: 14 },
    toast: { position: "absolute", top: 60, alignSelf: "center", width: "86%", paddingVertical: 12, paddingHorizontal: 16, borderRadius: 16, flexDirection: "row", alignItems: "center", gap: 10, zIndex: 9999, elevation: 20, shadowColor: "#000", shadowOpacity: 0.2, shadowRadius: 10, shadowOffset: { width: 0, height: 4 } },
    toastText: { color: "#fff", fontWeight: "700", flex: 1 },
});
