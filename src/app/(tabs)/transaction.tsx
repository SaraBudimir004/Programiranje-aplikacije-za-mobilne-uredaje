import {
    View,
    Text,
    Pressable,
    StyleSheet,
    TextInput,
    ScrollView,
    Modal,
    TouchableWithoutFeedback,
} from "react-native";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { signOut } from "firebase/auth";
import { auth, firestore } from "../../../firebaseConfig";
import { Ionicons } from "@expo/vector-icons";
import { doc, getDoc } from "firebase/firestore";
import {
    setUserBudget,
    addExtraIncome,
    addExpense,
} from "../../services/firestore";
import LiveReport from "../../components/LiveReport";
import ScreenBackground from "../../components/ScreenBackground";

export default function TransactionsScreen() {
    const router = useRouter();

    const [budget, setBudget] = useState<number | null>(null);

    const [budgetInput, setBudgetInput] = useState("");
    const [incomeInput, setIncomeInput] = useState("");
    const [expenseInput, setExpenseInput] = useState("");

    const [selectedIncomeSource, setSelectedIncomeSource] =
        useState("Plaća");
    const [selectedExpenseCategory, setSelectedExpenseCategory] =
        useState("Hrana");

    const [customIncome, setCustomIncome] = useState("");
    const [customExpense, setCustomExpense] = useState("");

    const [loading, setLoading] = useState(false);

    const [incomeDropdownOpen, setIncomeDropdownOpen] = useState(false);
    const [expenseDropdownOpen, setExpenseDropdownOpen] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const incomeSources = [
        "Plaća",
        "Freelance",
        "Bonus",
        "Povrat novca",
        "Poklon",
        "Ostalo (Upiši sam)",
    ];

    const expenseCategories = [
        "Hrana",
        "Prijevoz",
        "Šoping",
        "Zabava",
        "Računi",
        "Ostalo (Upiši sam)",
    ];

    const handleLogout = async () => {
        await signOut(auth);
        router.replace("/login");
    };

    const fetchBudget = async () => {
        const user = auth.currentUser;
        if (!user) return;

        const ref = doc(firestore, "users", user.uid);
        const snap = await getDoc(ref);

        if (snap.exists()) {
            const data = snap.data();
            setBudget(data.totalBudget ?? data.monthlyBudget ?? null);
        }
    };

    useEffect(() => {
        fetchBudget();
    }, []);

    const showError = (message: string) => {
        setError(message);

        setTimeout(() => {
            setError("");
        }, 2500);
    };

    const showSuccess = (message: string) => {
        setSuccess(message);

        setTimeout(() => {
            setSuccess("");
        }, 2500);
    };

    const handleSaveBudget = async () => {
        const value = Number(budgetInput);
        if (isNaN(value) || value <= 0) {
            showError("Unesite ispravan budžet veći od 0");
            return;
        }

        setLoading(true);
        await setUserBudget(value);
        await fetchBudget();
        setBudgetInput("");
        setLoading(false);

        showSuccess("Trošak uspješno unesen");
    };

    const handleAddIncome = async () => {
        const value = Number(incomeInput);
        if (isNaN(value) || value <= 0) {
            showError("Unesite ispravan iznos prihoda");
            return;
        }

        const category =
            selectedIncomeSource === "Ostalo (Upiši sam)"
                ? customIncome
                : selectedIncomeSource;

        if (!category) return;

        await addExtraIncome(value, category);

        setIncomeInput("");
        setCustomIncome("");
        setIncomeDropdownOpen(false);
        await fetchBudget();

        showSuccess("Prihod uspješno unesen");
    };

    const handleAddExpense = async () => {
        const value = Number(expenseInput);
        if (isNaN(value) || value <= 0) {
            showError("Unesite ispravan iznos troška");
            return;
        }

        const category =
            selectedExpenseCategory === "Ostalo (Upiši sam)"
                ? customExpense
                : selectedExpenseCategory;

        if (!category) return;

        await addExpense(value, category);

        setExpenseInput("");
        setCustomExpense("");
        setExpenseDropdownOpen(false);
        await fetchBudget();

        showSuccess("Budžet uspješno spremljen");
    };

    const hasBudget = budget !== null;

    return (
        <ScreenBackground>
            {error !== "" && (
                <View style={styles.toast}>
                    <Ionicons name="warning" size={18} color="#fff" />
                    <Text style={styles.toastText}>{error}</Text>
                </View>
            )}
            {success !== "" && (
                <View style={[styles.toast, { backgroundColor: "#22c55e" }]}>
                    <Ionicons name="checkmark-circle" size={18} color="#fff" />
                    <Text style={styles.toastText}>{success}</Text>
                </View>
            )}
            <ScrollView contentContainerStyle={styles.container}>

                {/* HEADER */}
                <View style={styles.header}>
                    <View>
                        <Text style={styles.title}>Pametni Budžet 💰</Text>
                        <Text style={styles.subtitle}>
                            Prati svoj novac kao profesionalac
                        </Text>
                    </View>

                    <Pressable onPress={handleLogout} style={styles.logout}>
                        <Ionicons name="log-out-outline" size={22} color="#1f6feb" />
                    </Pressable>
                </View>

                {/* BUDGET CARD */}
                <View style={styles.card}>
                    <Text style={styles.label}>Ukupni proračun</Text>

                    <Text style={styles.balance}>
                        {hasBudget ? `€ ${budget}` : "Nema budžeta"}
                    </Text>

                    {!hasBudget && (
                        <>
                            <TextInput
                                placeholder="Unesite mjesečni budžet"
                                placeholderTextColor="#64748b"
                                keyboardType="numeric"
                                value={budgetInput}
                                onChangeText={setBudgetInput}
                                style={styles.bigInput}
                            />

                            <Pressable
                                style={styles.blueButton}
                                onPress={handleSaveBudget}
                            >
                                <Text style={styles.buttonText}>
                                    {loading ? "Spremanje..." : "Spremi budžet"}
                                </Text>
                            </Pressable>
                        </>
                    )}
                </View>

                {/* GRID */}
                <View style={styles.grid}>

                    {/* INCOME */}
                    <View style={styles.cardSmall}>
                        <Text style={styles.sectionTitle}>Dodaj prihod</Text>

                        <TextInput
                            placeholder="Iznos"
                            placeholderTextColor="#64748b"
                            keyboardType="numeric"
                            value={incomeInput}
                            onChangeText={setIncomeInput}
                            style={styles.input}
                        />

                        <Pressable
                            style={styles.dropdownTrigger}
                            onPress={() => {
                                setIncomeDropdownOpen(true);
                                setExpenseDropdownOpen(false);
                            }}
                        >
                            <Text style={styles.dropdownText}>
                                {selectedIncomeSource}
                            </Text>
                            <Ionicons name="chevron-down" size={18} />
                        </Pressable>

                        {selectedIncomeSource === "Ostalo (Upiši sam)" && (
                            <TextInput
                                placeholder="Opis prihoda"
                                placeholderTextColor="#64748b"
                                value={customIncome}
                                onChangeText={setCustomIncome}
                                style={styles.input}
                            />
                        )}

                        <Pressable
                            style={styles.blueButton}
                            onPress={handleAddIncome}
                        >
                            <Text style={styles.buttonText}>
                                Dodaj prihod
                            </Text>
                        </Pressable>
                    </View>

                    {/* EXPENSE */}
                    <View style={styles.cardSmall}>
                        <Text style={styles.sectionTitle}>Dodaj trošak</Text>

                        <TextInput
                            placeholder="Iznos"
                            placeholderTextColor="#64748b"
                            keyboardType="numeric"
                            value={expenseInput}
                            onChangeText={setExpenseInput}
                            style={styles.input}
                        />

                        <Pressable
                            style={styles.dropdownTrigger}
                            onPress={() => {
                                setExpenseDropdownOpen(true);
                                setIncomeDropdownOpen(false);
                            }}
                        >
                            <Text style={styles.dropdownText}>
                                {selectedExpenseCategory}
                            </Text>
                            <Ionicons name="chevron-down" size={18} />
                        </Pressable>

                        {selectedExpenseCategory === "Ostalo (Upiši sam)" && (
                            <TextInput
                                placeholder="Opis troška"
                                placeholderTextColor="#64748b"
                                value={customExpense}
                                onChangeText={setCustomExpense}
                                style={styles.input}
                            />
                        )}

                        <Pressable
                            style={styles.blueButton}
                            onPress={handleAddExpense}
                        >
                            <Text style={styles.buttonText}>
                                Dodaj trošak
                            </Text>
                        </Pressable>
                    </View>
                </View>

                <LiveReport />

            </ScrollView>

            {/* MODALS */}
            <Modal visible={incomeDropdownOpen} transparent animationType="slide">
                <TouchableWithoutFeedback onPress={() => setIncomeDropdownOpen(false)}>
                    <View style={styles.modalOverlay}>

                        <TouchableWithoutFeedback>
                            <View style={styles.modal}>

                                <View style={styles.modalHeader}>
                                    <Text style={styles.modalTitle}>Odaberi prihod</Text>

                                    <Pressable onPress={() => setIncomeDropdownOpen(false)}>
                                        <Ionicons
                                            name="close"
                                            size={24}
                                            color="#64748b"
                                        />
                                    </Pressable>
                                </View>

                                {incomeSources.map((item) => (
                                    <Pressable
                                        key={item}
                                        onPress={() => {
                                            setSelectedIncomeSource(item);
                                            setIncomeDropdownOpen(false);
                                        }}
                                        style={styles.modalItem}
                                        android_ripple={{ color: "#e0e7ff" }}
                                    >
                                        <Text style={styles.modalText}>
                                            {item}
                                        </Text>
                                    </Pressable>
                                ))}

                            </View>
                        </TouchableWithoutFeedback>

                    </View>
                </TouchableWithoutFeedback>
            </Modal>

            <Modal visible={expenseDropdownOpen} transparent animationType="slide">
                <TouchableWithoutFeedback onPress={() => setExpenseDropdownOpen(false)}>
                    <View style={styles.modalOverlay}>

                        <TouchableWithoutFeedback>
                            <View style={styles.modal}>

                                <View style={styles.modalHeader}>
                                    <Text style={styles.modalTitle}>Odaberi trošak</Text>

                                    <Pressable onPress={() => setExpenseDropdownOpen(false)}>
                                        <Ionicons
                                            name="close"
                                            size={24}
                                            color="#64748b"
                                        />
                                    </Pressable>
                                </View>

                                {expenseCategories.map((item) => (
                                    <Pressable
                                        key={item}
                                        onPress={() => {
                                            setSelectedExpenseCategory(item);
                                            setExpenseDropdownOpen(false);
                                        }}
                                        style={styles.modalItem}
                                        android_ripple={{ color: "#e0e7ff" }}
                                    >
                                        <Text style={styles.modalText}>
                                            {item}
                                        </Text>
                                    </Pressable>
                                ))}

                            </View>
                        </TouchableWithoutFeedback>

                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </ScreenBackground>
    );
}
const styles = StyleSheet.create({
    container: {
        padding: 20,
        paddingTop: 60,
        paddingBottom: 120,
    },

    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 20,
    },

    title: {
        fontSize: 26,
        fontWeight: "800",
        color: "#0f172a",
    },

    subtitle: {
        color: "#334155",
        marginTop: 4,
    },

    logout: {
        width: 42,
        height: 42,
        borderRadius: 12,
        backgroundColor: "rgba(255,255,255,0.7)",
        justifyContent: "center",
        alignItems: "center",
    },

    card: {
        backgroundColor: "rgba(255,255,255,0.78)",
        padding: 20,
        borderRadius: 22,
        marginBottom: 20,
    },

    cardSmall: {
        flex: 1,
        backgroundColor: "rgba(255,255,255,0.78)",
        padding: 16,
        borderRadius: 20,
    },

    grid: {
        flexDirection: "row",
        gap: 14,
        marginBottom: 20,
    },

    label: {
        color: "#64748b",
    },

    balance: {
        fontSize: 32,
        fontWeight: "800",
        marginTop: 10,
        color: "#0f172a",
    },

    sectionTitle: {
        fontSize: 16,
        fontWeight: "700",
        marginBottom: 10,
        color: "#0f172a",
    },

    input: {
        backgroundColor: "rgba(255,255,255,0.9)",
        padding: 12,
        borderRadius: 12,
        marginTop: 8,
        color: "#0f172a",
    },

    bigInput: {
        marginTop: 12,
        backgroundColor: "rgba(255,255,255,0.95)",
        padding: 16,
        borderRadius: 14,
        fontSize: 16,
        borderWidth: 1,
        borderColor: "#e2e8f0",
    },

    dropdownTrigger: {
        marginTop: 10,
        padding: 12,
        borderRadius: 12,
        backgroundColor: "rgba(255,255,255,0.9)",
        flexDirection: "row",
        justifyContent: "space-between",
    },

    dropdownText: {
        fontWeight: "600",
        color: "#0f172a",
    },

    blueButton: {
        marginTop: 10,
        padding: 14,
        backgroundColor: "#1f6feb",
        borderRadius: 14,
        alignItems: "center",
    },

    buttonText: {
        color: "white",
        fontWeight: "700",
    },

    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.4)",
        justifyContent: "center",
        alignItems: "center",
    },

    modal: {
        width: "85%",
        maxWidth: 340,
        backgroundColor: "rgba(184,213,246,0.93)",
        borderRadius: 24,
        paddingTop: 10,
        paddingBottom: 8,
        borderWidth: 1,
        borderColor: "#dbeafe",
        overflow: "hidden",
    },

    modalItem: {
        paddingVertical: 16,
        paddingHorizontal: 18,
        borderRadius: 12,
        marginHorizontal: 8,
    },

    modalHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 18,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#f1f5f9",
    },

    modalTitle: {
        fontSize: 16,
        fontWeight: "700",
        color: "#0f172a",
    },

    modalText: {
        fontSize: 16,
        fontWeight: "600",
        color: "#0f172a",
        textAlign: "left",
        width: "100%",
    },

    toast: {
        position: "absolute",
        top: 80,
        alignSelf: "center",

        width: "80%",
        maxWidth: 320,

        backgroundColor: "#ef4444",
        paddingVertical: 12,
        paddingHorizontal: 14,
        borderRadius: 14,

        flexDirection: "row",
        alignItems: "center",
        gap: 10,

        zIndex: 9999,
        elevation: 20,

        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
    },

    toastText: {
        color: "white",
        fontWeight: "700",
        flex: 1,
    },
});