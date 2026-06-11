import { useEffect, useState } from "react";
import { auth, firestore } from "../../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { setUserBudget, addExtraIncome, addExpense } from "../services/firestore";

export type ToastState = { msg: string; type: "success" | "error" } | null;

export const INCOME_SOURCES = ["Plaća", "Freelance", "Bonus", "Povrat novca", "Poklon", "Ostalo (Upiši sam)"];
export const EXPENSE_CATEGORIES = ["Hrana", "Prijevoz", "Šoping", "Zabava", "Računi", "Ostalo (Upiši sam)"];

export const INCOME_ICONS: Record<string, string> = {
    "Plaća": "cash", "Freelance": "laptop", "Bonus": "gift",
    "Povrat novca": "refresh-circle", "Poklon": "heart", "Ostalo (Upiši sam)": "add-circle",
};
export const EXPENSE_ICONS: Record<string, string> = {
    "Hrana": "restaurant", "Prijevoz": "car", "Šoping": "bag-handle",
    "Zabava": "game-controller", "Računi": "receipt", "Ostalo (Upiši sam)": "add-circle",
};

export function useTransactions() {
    const [budget, setBudget] = useState<number | null>(null);
    const [budgetInput, setBudgetInput] = useState("");
    const [incomeInput, setIncomeInput] = useState("");
    const [expenseInput, setExpenseInput] = useState("");
    const [selectedIncomeSource, setSelectedIncomeSource] = useState("Plaća");
    const [selectedExpenseCategory, setSelectedExpenseCategory] = useState("Hrana");
    const [customIncome, setCustomIncome] = useState("");
    const [customExpense, setCustomExpense] = useState("");
    const [loading, setLoading] = useState(false);
    const [incomeDropdownOpen, setIncomeDropdownOpen] = useState(false);
    const [expenseDropdownOpen, setExpenseDropdownOpen] = useState(false);
    const [toast, setToast] = useState<ToastState>(null);
    const [activeSection, setActiveSection] = useState<"income" | "expense">("income");

    const showToast = (msg: string, type: "success" | "error") => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 2500);
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

    useEffect(() => { fetchBudget(); }, []);

    const handleSaveBudget = async () => {
        const value = Number(budgetInput);
        if (isNaN(value) || value <= 0) { showToast("Unesite ispravan budžet", "error"); return; }
        setLoading(true);
        await setUserBudget(value);
        await fetchBudget();
        setBudgetInput("");
        setLoading(false);
        showToast("Budžet uspješno postavljen ✓", "success");
    };

    const handleAddIncome = async () => {
        const value = Number(incomeInput);
        if (isNaN(value) || value <= 0) { showToast("Unesite ispravan iznos prihoda", "error"); return; }
        const category = selectedIncomeSource === "Ostalo (Upiši sam)" ? customIncome : selectedIncomeSource;
        if (!category) { showToast("Odaberi kategoriju", "error"); return; }
        await addExtraIncome(value, category);
        setIncomeInput(""); setCustomIncome(""); setIncomeDropdownOpen(false);
        await fetchBudget();
        showToast("Prihod uspješno unesen ✓", "success");
    };

    const handleAddExpense = async () => {
        const value = Number(expenseInput);
        if (isNaN(value) || value <= 0) { showToast("Unesite ispravan iznos troška", "error"); return; }
        const category = selectedExpenseCategory === "Ostalo (Upiši sam)" ? customExpense : selectedExpenseCategory;
        if (!category) { showToast("Odaberi kategoriju", "error"); return; }
        try {
            await addExpense(value, category);
            setExpenseInput(""); setCustomExpense(""); setExpenseDropdownOpen(false);
            await fetchBudget();
            showToast("Trošak uspješno unesen ✓", "success");
        } catch (e: any) {
            showToast(e.message || "Greška pri unosu", "error");
        }
    };

    return {
        // State
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
        // Actions
        handleSaveBudget, handleAddIncome, handleAddExpense,
    };
}
