import { addDoc, collection, doc, getDoc, getDocs, orderBy, query, serverTimestamp, updateDoc } from "firebase/firestore";
import { auth, firestore } from "../../firebaseConfig";

// Provjera i slanje upozorenja o budžetu
const checkBudgetNotifications = async (uid: string) => {
    const userRef = doc(firestore, "users", uid);
    const snap = await getDoc(userRef);
    if (!snap.exists()) return;

    const data = snap.data();
    const totalBudget = data.totalBudget ?? 0;
    const monthlyBudget = data.monthlyBudget ?? 0;
    const spendingLimit = data.spendingLimit ?? 0;

    if (monthlyBudget <= 0) return;

    const spent = monthlyBudget - totalBudget;
    const spentPct = (spent / monthlyBudget) * 100;

    const notifRef = collection(userRef, "notifications");

    if (spentPct >= 100) {
        await addDoc(notifRef, {
            type: "budget_exceeded",
            message: "Prekoračio si planirani budžet!",
            date: serverTimestamp(),
            read: false,
        });
    } else if (spentPct >= 80) {
        await addDoc(notifRef, {
            type: "budget_warning",
            message: `Potrošeno ${spentPct.toFixed(0)}% budžeta`,
            date: serverTimestamp(),
            read: false,
        });
    }

    if (spendingLimit > 0 && spent >= spendingLimit * 0.9) {
        await addDoc(notifRef, {
            type: "limit_warning",
            message: `Blizu si limita potrošnje (€${spendingLimit})`,
            date: serverTimestamp(),
            read: false,
        });
    }
};

// Postavlja osnovni mjesečni budžet
export const setUserBudget = async (amount: number) => {
    const user = auth.currentUser;
    if (!user) return [];
    const userRef = doc(firestore, "users", user.uid);
    await updateDoc(userRef, {
        monthlyBudget: amount,
        totalBudget: amount
    });
};

// Dodavanje prihoda
export const addExtraIncome = async (amount: number, category: string) => {
    const user = auth.currentUser;
    if (!user) return [];
    const userRef = doc(firestore, "users", user.uid);
    const snap = await getDoc(userRef);
    if (!snap.exists()) throw new Error("Korisnik ne postoji");
    const data = snap.data();
    const currentTotal = data.totalBudget ?? 0;
    const transactionsRef = collection(userRef, "transactions");
    await addDoc(transactionsRef, {
        amount,
        category,
        type: "income",
        date: serverTimestamp()
    });
    await updateDoc(userRef, { totalBudget: currentTotal + amount });
};

// Dodavanje troška (osnovno - bez računa)
export const addExpense = async (amount: number, category: string) => {
    const user = auth.currentUser;
    if (!user) return [];
    const userRef = doc(firestore, "users", user.uid);
    const snap = await getDoc(userRef);
    if (!snap.exists()) throw new Error("Korisnik ne postoji");
    const data = snap.data();
    const currentTotal = data.totalBudget ?? 0;
    if (amount > currentTotal) throw new Error("Nema dovoljno budžeta");
    const newTotal = currentTotal - amount;
    const transactionsRef = collection(userRef, "transactions");
    await addDoc(transactionsRef, {
        amount,
        category,
        type: "expense",
        date: serverTimestamp()
    });
    await updateDoc(userRef, { totalBudget: newTotal });
    await checkBudgetNotifications(user.uid);
};

// ─── NOVI: Dodavanje troška s računom (OCR + lokacija + slika) ───────────────

export interface ReceiptExpenseData {
    amount: number;
    category: string;
    receiptImageUrl?: string;
    storeName?: string;
    address?: string;
    latitude?: number;
    longitude?: number;
    note?: string;
}

export const addExpenseWithReceipt = async (data: ReceiptExpenseData) => {
    const user = auth.currentUser;
    if (!user) return [];
    const userRef = doc(firestore, "users", user.uid);
    const snap = await getDoc(userRef);
    if (!snap.exists()) throw new Error("Korisnik ne postoji");
    const userData = snap.data();
    const currentTotal = userData.totalBudget ?? 0;
    if (data.amount > currentTotal) throw new Error("Nema dovoljno budžeta");
    const newTotal = currentTotal - data.amount;

    const now = new Date();

    // Spremi u transactions (za LiveReport kompatibilnost)
    const transactionsRef = collection(userRef, "transactions");
    await addDoc(transactionsRef, {
        amount: data.amount,
        category: data.category,
        type: "expense",
        date: serverTimestamp(),
        hasReceipt: true,
        receiptImageUrl: data.receiptImageUrl ?? null,
        storeName: data.storeName ?? null,
        address: data.address ?? null,
        latitude: data.latitude ?? null,
        longitude: data.longitude ?? null,
        note: data.note ?? null,
    });

    // Spremi i u receipts kolekciju za Mapu troškova
    const receiptsRef = collection(userRef, "receipts");
    await addDoc(receiptsRef, {
        amount: data.amount,
        category: data.category,
        receiptImageUrl: data.receiptImageUrl ?? null,
        storeName: data.storeName ?? null,
        address: data.address ?? null,
        latitude: data.latitude ?? null,
        longitude: data.longitude ?? null,
        note: data.note ?? null,
        date: serverTimestamp(),
        purchaseDate: now.toLocaleDateString("hr-HR"),
        purchaseTime: now.toLocaleTimeString("hr-HR", { hour: "2-digit", minute: "2-digit" }),
        userId: user.uid,
    });

    await updateDoc(userRef, { totalBudget: newTotal });
    await checkBudgetNotifications(user.uid);
};

// Dohvat svih računa s lokacijom (za Mapu troškova)
export const fetchReceiptsWithLocation = async () => {
    const user = auth.currentUser;
    if (!user) return [];
    const userRef = doc(firestore, "users", user.uid);
    const receiptsRef = collection(userRef, "receipts");
    const q = query(receiptsRef, orderBy("date", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};
