import { doc, updateDoc, getDoc, addDoc, collection, serverTimestamp } from "firebase/firestore";
import { firestore, auth } from "../../firebaseConfig";

// Postavlja osnovni mjesečni budžet
export const setUserBudget = async (amount: number) => {
    const user = auth.currentUser;
    if (!user) throw new Error("Korisnik nije prijavljen");

    const userRef = doc(firestore, "users", user.uid);

    await updateDoc(userRef, {
        monthlyBudget: amount,
        totalBudget: amount
    });
};

// Dodavanje prihoda (POPRAVLJENO: Sada prihvaća i sprema točnu kategoriju!)
export const addExtraIncome = async (amount: number, category: string) => {
    const user = auth.currentUser;
    if (!user) throw new Error("Korisnik nije prijavljen");

    const userRef = doc(firestore, "users", user.uid);
    const snap = await getDoc(userRef);

    if (!snap.exists()) throw new Error("Korisnik ne postoji");

    const data = snap.data();
    const currentTotal = data.totalBudget ?? 0;

    // 1. SPREMI TRANSAKCIJU ZA PRIHOD s odabranom kategorijom
    const transactionsRef = collection(userRef, "transactions");
    await addDoc(transactionsRef, {
        amount,
        category, // <-- Ovdje sada spremamo "Salary", "Freelance" itd. umjesto "Income"
        type: "income",
        date: serverTimestamp()
    });

    // 2. Ažuriraj budget
    await updateDoc(userRef, {
        totalBudget: currentTotal + amount
    });
};

// Dodavanje troška (SAFE verzija)
export const addExpense = async (amount: number, category: string) => {
    const user = auth.currentUser;
    if (!user) throw new Error("Korisnik nije prijavljen");

    const userRef = doc(firestore, "users", user.uid);

    const snap = await getDoc(userRef);
    if (!snap.exists()) throw new Error("Korisnik ne postoji");

    const data = snap.data();
    const currentTotal = data.totalBudget ?? 0;

    // Zaštita od minusa
    if (amount > currentTotal) {
        throw new Error("Nema dovoljno budžeta");
    }

    const newTotal = currentTotal - amount;

    // 1. Spremi transakciju za trošak
    const transactionsRef = collection(userRef, "transactions");
    await addDoc(transactionsRef, {
        amount,
        category,
        type: "expense",
        date: serverTimestamp()
    });

    // 2. Ažuriraj budget
    await updateDoc(userRef, {
        totalBudget: newTotal
    });
};