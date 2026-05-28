import { View, Text, Pressable, StyleSheet, TextInput, ScrollView } from 'react-native';
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { signOut } from 'firebase/auth';
import { auth, firestore } from '../../firebaseConfig';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { doc, getDoc } from 'firebase/firestore';
import { setUserBudget, addExtraIncome, addExpense } from '../services/firestore';
import LiveReport from "../components/LiveReport";

export default function HomeScreen() {
  const router = useRouter();

  const [budget, setBudget] = useState<number | null>(null);

  const [budgetInput, setBudgetInput] = useState("");
  const [incomeInput, setIncomeInput] = useState("");
  const [expenseInput, setExpenseInput] = useState("");

  // Početne selekcije na hrvatskom
  const [selectedIncomeSource, setSelectedIncomeSource] = useState("Plaća");
  const [selectedExpenseCategory, setSelectedExpenseCategory] = useState("Hrana");

  // Stanja za tekst kada korisnik odabere "Ostalo (Upiši sam)"
  const [customIncome, setCustomIncome] = useState("");
  const [customExpense, setCustomExpense] = useState("");

  const [loading, setLoading] = useState(false);

  // Kategorije prevedene na hrvatski jezik
  const incomeSources = ["Plaća", "Freelance", "Bonus", "Povrat novca", "Poklon", "Ostalo (Upiši sam)"];
  const expenseCategories = ["Hrana", "Prijevoz", "Šoping", "Zabava", "Računi", "Ostalo (Upiši sam)"];

  const handleLogout = async () => {
    await signOut(auth);
    router.replace('/login');
  };

  const fetchBudget = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const userRef = doc(firestore, "users", user.uid);
    const snap = await getDoc(userRef);

    if (snap.exists()) {
      const data = snap.data();
      setBudget(data.totalBudget ?? data.monthlyBudget ?? null);
    }
  };

  useEffect(() => {
    fetchBudget();
  }, []);

  const handleSaveBudget = async () => {
    const value = Number(budgetInput);
    if (isNaN(value)) return;

    setLoading(true);
    await setUserBudget(value);
    await fetchBudget();
    setBudgetInput("");
    setLoading(false);
  };

  // DODAVANJE PRIHODA
  const handleAddIncome = async () => {
    const value = Number(incomeInput);
    if (isNaN(value)) return;

    // Ako je odabrano "Ostalo (Upiši sam)", uzimamo ono što je korisnik uttipkao
    const category = selectedIncomeSource === "Ostalo (Upiši sam)" ? customIncome : selectedIncomeSource;
    if (!category) return;

    await addExtraIncome(value, category);

    setIncomeInput("");
    setCustomIncome("");
    await fetchBudget();
  };

  // DODAVANJE TROŠKA
  const handleAddExpense = async () => {
    const value = Number(expenseInput);
    if (isNaN(value)) return;

    // Ako je odabrano "Ostalo (Upiši sam)", uzimamo ono što je korisnik uttipkao
    const category = selectedExpenseCategory === "Ostalo (Upiši sam)" ? customExpense : selectedExpenseCategory;
    if (!category) return;

    await addExpense(value, category);

    setExpenseInput("");
    setCustomExpense("");
    await fetchBudget();
  };

  const hasBudget = budget !== null;

  return (
      <LinearGradient colors={['#0B0F1A', '#111827', '#0F172A']} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.container}>

          {/* TOP BAR */}
          <View style={styles.topBar}>
            <View>
              <Text style={styles.title}>Pametni Budžet</Text>
              <Text style={styles.subtitle}>Prati svoj novac kao profesionalac</Text>
            </View>

            <Pressable onPress={handleLogout} style={styles.logoutIcon}>
              <Ionicons name="log-out-outline" size={22} color="white" />
            </Pressable>
          </View>

          {/* BUDGET CARD */}
          <View style={styles.mainCard}>
            <Text style={styles.cardLabel}>Ukupni proračun</Text>
            <Text style={styles.balance}>
              {hasBudget ? `$ ${budget}` : "Nema postavljenog budžeta"}
            </Text>
          </View>

          {/* PRVO POSTAVLJANJE BUDŽETA */}
          {!hasBudget && (
              <>
                <TextInput
                    placeholder="Unesite mjesečni budžet"
                    placeholderTextColor="#888"
                    keyboardType="numeric"
                    value={budgetInput}
                    onChangeText={setBudgetInput}
                    style={styles.input}
                />

                <Pressable style={styles.saveButton} onPress={handleSaveBudget}>
                  <Text style={styles.saveText}>
                    {loading ? "Spremanje..." : "Spremi budžet"}
                  </Text>
                </Pressable>
              </>
          )}

          {/* PRIHODI */}
          <View style={styles.sourceCard}>
            <Text style={styles.sourceTitle}>Dodaj prihod</Text>

            <TextInput
                placeholder="Iznos"
                placeholderTextColor="#888"
                keyboardType="numeric"
                value={incomeInput}
                onChangeText={setIncomeInput}
                style={styles.input}
            />

            {incomeSources.map((item) => (
                <Pressable
                    key={item}
                    onPress={() => setSelectedIncomeSource(item)}
                    style={[styles.sourceItem, selectedIncomeSource === item && styles.sourceSelected]}
                >
                  <Text style={styles.sourceText}>{item}</Text>
                </Pressable>
            ))}

            {/* POLJE KOJE SE OTVARA KAD SE ODABERE "Ostalo (Upiši sam)" ZA PRIHODE */}
            {selectedIncomeSource === "Ostalo (Upiši sam)" && (
                <TextInput
                    placeholder="Odakle je stigao novac? (npr. Rođendan)"
                    placeholderTextColor="#888"
                    value={customIncome}
                    onChangeText={setCustomIncome}
                    style={styles.input}
                />
            )}

            <Pressable style={styles.saveButton} onPress={handleAddIncome}>
              <Text style={styles.saveText}>Dodaj prihod</Text>
            </Pressable>
          </View>

          {/* TROŠKOVI */}
          <View style={styles.sourceCard}>
            <Text style={styles.sourceTitle}>Dodaj trošak</Text>

            <TextInput
                placeholder="Iznos"
                placeholderTextColor="#888"
                keyboardType="numeric"
                value={expenseInput}
                onChangeText={setExpenseInput}
                style={styles.input}
            />

            {expenseCategories.map((item) => (
                <Pressable
                    key={item}
                    onPress={() => setSelectedExpenseCategory(item)}
                    style={[styles.sourceItem, selectedExpenseCategory === item && styles.sourceSelected]}
                >
                  <Text style={styles.sourceText}>{item}</Text>
                </Pressable>
            ))}

            {/* POLJE KOJE SE OTVARA KAD SE ODABERE "Ostalo (Upiši sam)" ZA TROŠKOVE */}
            {selectedExpenseCategory === "Ostalo (Upiši sam)" && (
                <TextInput
                    placeholder="Na što ste potrošili novac? (npr. Frizura)"
                    placeholderTextColor="#888"
                    value={customExpense}
                    onChangeText={setCustomExpense}
                    style={styles.input}
                />
            )}

            <Pressable style={styles.saveButton} onPress={handleAddExpense}>
              <Text style={styles.saveText}>Dodaj trošak</Text>
            </Pressable>
          </View>

          <LiveReport />

        </ScrollView>
      </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingTop: 60 },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 },
  title: { color: 'white', fontSize: 26, fontWeight: '800' },
  subtitle: { color: '#94A3B8', marginTop: 4 },
  logoutIcon: { width: 42, height: 42, borderRadius: 12, backgroundColor: '#1F2937', justifyContent: 'center', alignItems: 'center' },
  mainCard: { backgroundColor: '#111827', padding: 20, borderRadius: 20, marginBottom: 20 },
  balance: { color: 'white', fontSize: 34, fontWeight: '800', marginTop: 10 },
  cardLabel: { color: '#94A3B8', marginBottom: 8 },
  input: { marginTop: 10, backgroundColor: '#1F2937', padding: 12, borderRadius: 10, color: 'white' },
  saveButton: { marginTop: 10, padding: 14, backgroundColor: '#10B981', borderRadius: 12, alignItems: 'center' },
  saveText: { color: 'white', fontWeight: '700' },
  sourceCard: { marginTop: 20, padding: 15, backgroundColor: '#0B1220', borderRadius: 16, borderWidth: 1, borderColor: '#1F2937' },
  sourceTitle: { color: '#94A3B8', marginBottom: 10, fontWeight: '600' },
  sourceItem: { padding: 10, borderRadius: 10, backgroundColor: '#1F2937', marginTop: 8 },
  sourceSelected: { backgroundColor: '#10B981' },
  sourceText: { color: 'white' },
});