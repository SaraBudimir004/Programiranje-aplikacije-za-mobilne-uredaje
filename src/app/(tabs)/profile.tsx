import {
    View, Text, StyleSheet, ScrollView, Pressable, Switch, Alert, TextInput, Modal,
    TouchableWithoutFeedback, Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ScreenBackground from "../../components/ScreenBackground";
import { auth, firestore } from "../../../firebaseConfig";
import { doc, updateDoc, onSnapshot, collection } from "firebase/firestore";
import { signOut, updateProfile } from "firebase/auth";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { useTheme } from "../../context/ThemeContext";

export default function ProfileScreen() {
    const router = useRouter();
    const { colors, isDark, toggleTheme } = useTheme();

    const [userData, setUserData] = useState<any>(null);
    const [emailNotif, setEmailNotif] = useState(false);
    const [spendingLimit, setSpendingLimit] = useState<number | null>(null);

    // Trenutno stanje računa (totalBudget iz Firestore)
    const [accountBalance, setAccountBalance] = useState<number>(0);

    const [editModal, setEditModal] = useState(false);
    const [balanceModal, setBalanceModal] = useState(false); // ← NOVA: zamjena za budgetModal
    const [limitModal, setLimitModal] = useState(false);

    const [editName, setEditName] = useState("");
    const [editLimit, setEditLimit] = useState("");

    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const user = auth.currentUser;
        if (!user) return;

        // Slušamo korisničke podatke (ime, budžet, limit, totalBudget)
        const userRef = doc(firestore, "users", user.uid);
        const unsubUser = onSnapshot(userRef, (snap) => {
            if (snap.exists()) {
                const d = snap.data();
                setUserData(d);
                setEmailNotif(d.emailNotifications || false);
                setSpendingLimit(d.spendingLimit || null);
                setEditName(d.ime || "");
                setEditLimit(String(d.spendingLimit || ""));
                // totalBudget je stvarno trenutno stanje računa
                setAccountBalance(d.totalBudget ?? 0);
            }
        });

        return () => unsubUser();
    }, []);


    const handleLogout = async () => {
        const performLogout = async () => {
            try {
                await signOut(auth);
            } catch (e) {
                console.error("Logout error:", e);
            } finally {
                router.replace("/login");
            }
        };

        if (Platform.OS === "web") {
            // Na webu Alert ne radi koristim window.confirm
            const confirmed = window.confirm("Jesi li siguran da se želiš odjaviti?");
            if (confirmed) {
                await performLogout();
            }
        } else {
            // Na mobilnoj verziji Alert radi noormalno
            Alert.alert("Odjava", "Jesi li siguran da se želiš odjaviti?", [
                { text: "Odustani", style: "cancel" },
                {
                    text: "Odjavi se",
                    style: "destructive",
                    onPress: performLogout,
                },
            ]);
        }
    };

    const toggleEmailNotif = async (val: boolean) => {
        setEmailNotif(val);
        const user = auth.currentUser;
        if (!user) return;
        const userRef = doc(firestore, "users", user.uid);
        await updateDoc(userRef, { emailNotifications: val });
    };

    const handleSaveName = async () => {
        if (!editName.trim()) return;
        setSaving(true);
        const user = auth.currentUser;
        if (!user) return;
        const userRef = doc(firestore, "users", user.uid);
        await updateDoc(userRef, { ime: editName.trim() });
        setSaving(false);
        setEditModal(false);
    };

    const handleSaveLimit = async () => {
        const val = Number(editLimit);
        if (isNaN(val) || val <= 0) {
            if (Platform.OS === "web") {
                window.alert("Unesite ispravan iznos");
            } else {
                Alert.alert("Greška", "Unesite ispravan iznos");
            }
            return;
        }
        setSaving(true);
        const user = auth.currentUser;
        if (!user) return;
        const userRef = doc(firestore, "users", user.uid);
        await updateDoc(userRef, { spendingLimit: val });
        setSpendingLimit(val);
        setSaving(false);
        setLimitModal(false);
    };

    const user = auth.currentUser;
    const initials = (userData?.ime || "K").charAt(0).toUpperCase();
    const regDate = user?.metadata?.creationTime
        ? new Date(user.metadata.creationTime).toLocaleDateString("hr-HR")
        : "N/A";

    // Određujemo boju stanja računa ovisno o tome je li pozitivno ili negativno
    const balanceColor = accountBalance >= 0 ? colors.success : colors.danger;

    const SettingRow = ({ icon, label, value, onPress, danger, toggle, toggleVal, onToggle }: any) => (
        <Pressable
            style={[styles.settingRow, { backgroundColor: colors.card }, !onPress && !toggle && { opacity: 1 }]}
            onPress={onPress}
            disabled={toggle}
        >
            <View style={[styles.settingIcon, { backgroundColor: danger ? "rgba(239,68,68,0.12)" : colors.accentLight }]}>
                <Ionicons name={icon} size={18} color={danger ? colors.danger : colors.accent} />
            </View>
            <View style={styles.settingInfo}>
                <Text style={[styles.settingLabel, { color: danger ? colors.danger : colors.text }]}>{label}</Text>
                {value ? <Text style={[styles.settingValue, { color: colors.textMuted }]}>{value}</Text> : null}
            </View>
            {toggle ? (
                <Switch value={toggleVal} onValueChange={onToggle} trackColor={{ false: "#767577", true: colors.accent }} thumbColor="#fff" />
            ) : onPress ? (
                <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
            ) : null}
        </Pressable>
    );

    return (
        <ScreenBackground>
            <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>

                {/* PROFILE HEADER */}
                <View style={[styles.profileHeader, { backgroundColor: colors.card }]}>
                    <View style={[styles.avatar, { backgroundColor: colors.accent }]}>
                        <Text style={styles.avatarText}>{initials}</Text>
                    </View>
                    <Text style={[styles.profileName, { color: colors.text }]}>{userData?.ime || "Korisnik"}</Text>
                    <Text style={[styles.profileEmail, { color: colors.textSecondary }]}>{user?.email || ""}</Text>

                    <View style={styles.profileStats}>
                        <View style={styles.profileStat}>
                            <Text style={[styles.profileStatValue, { color: colors.accent }]}>
                                €{(userData?.monthlyBudget || 0).toFixed(2)}
                            </Text>
                            <Text style={[styles.profileStatLabel, { color: colors.textMuted }]}>Budžet</Text>
                        </View>
                        <View style={[styles.profileStatDivider, { backgroundColor: colors.border }]} />
                        <View style={styles.profileStat}>
                            <Text style={[styles.profileStatValue, { color: colors.text }]}>{regDate}</Text>
                            <Text style={[styles.profileStatLabel, { color: colors.textMuted }]}>Registracija</Text>
                        </View>
                        <View style={[styles.profileStatDivider, { backgroundColor: colors.border }]} />

                    </View>
                </View>

                {/* ACCOUNT SETTINGS */}
                <Text style={[styles.section, { color: colors.textSecondary }]}>KORISNIČKI RAČUN</Text>
                <SettingRow icon="person-outline" label="Promijeni ime" value={userData?.ime} onPress={() => setEditModal(true)} />

                {/*← Trenutno stanje računa */ }
                <SettingRow
                    icon="bar-chart-outline"
                    label="Trenutno stanje računa"
                    value={`€${accountBalance.toFixed(2)}`}
                    onPress={() => setBalanceModal(true)}
                />



                {/* APP SETTINGS */}
                <Text style={[styles.section, { color: colors.textSecondary }]}>POSTAVKE APLIKACIJE</Text>
                <SettingRow
                    icon={isDark ? "moon" : "sunny-outline"}
                    label="Dark Mode"
                    value={isDark ? "Uključen" : "Isključen"}
                    toggle
                    toggleVal={isDark}
                    onToggle={toggleTheme}
                />
                <SettingRow
                    icon="mail-outline"
                    label="Email obavijesti"
                    value={emailNotif ? "Uključene" : "Isključene"}
                    toggle
                    toggleVal={emailNotif}
                    onToggle={toggleEmailNotif}
                />

                {/* LOGOUT */}
                <Text style={[styles.section, { color: colors.textSecondary }]}>RAČUN</Text>
                <SettingRow icon="log-out-outline" label="Odjavi se" onPress={handleLogout} danger />

                <Text style={[styles.version, { color: colors.textMuted }]}>SmartExpense v2.0.0</Text>
            </ScrollView>

            {/* EDIT NAME MODAL */}
            <Modal visible={editModal} transparent animationType="slide">
                <TouchableWithoutFeedback onPress={() => setEditModal(false)}>
                    <View style={[styles.modalOverlay, { backgroundColor: colors.overlay }]}>
                        <TouchableWithoutFeedback>
                            <View style={[styles.modal, { backgroundColor: colors.cardStrong }]}>
                                <Text style={[styles.modalTitle, { color: colors.text }]}>Promijeni ime</Text>
                                <TextInput
                                    value={editName}
                                    onChangeText={setEditName}
                                    style={[styles.modalInput, { backgroundColor: colors.input, color: colors.text }]}
                                    placeholder="Unesite ime"
                                    placeholderTextColor={colors.textMuted}
                                />
                                <View style={styles.modalButtons}>
                                    <Pressable style={[styles.modalBtn, { backgroundColor: colors.card }]} onPress={() => setEditModal(false)}>
                                        <Text style={[styles.modalBtnText, { color: colors.textSecondary }]}>Odustani</Text>
                                    </Pressable>
                                    <Pressable style={[styles.modalBtn, { backgroundColor: colors.accent }]} onPress={handleSaveName}>
                                        <Text style={[styles.modalBtnText, { color: "#fff" }]}>{saving ? "..." : "Spremi"}</Text>
                                    </Pressable>
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>


            <Modal visible={balanceModal} transparent animationType="fade">
                <TouchableWithoutFeedback onPress={() => setBalanceModal(false)}>
                    <View style={[styles.modalOverlay, { backgroundColor: colors.overlay }]}>
                        <TouchableWithoutFeedback>
                            <View style={[styles.modal, styles.balanceModal, { backgroundColor: colors.cardStrong }]}>

                                {/* Ikona */}
                                <View style={[styles.balanceIconWrap, { backgroundColor: colors.accentLight }]}>
                                    <Ionicons name="wallet" size={32} color={colors.accent} />
                                </View>

                                <Text style={[styles.modalTitle, { color: colors.text, textAlign: "center" }]}>
                                    Stanje računa
                                </Text>
                                <Text style={[styles.balanceSubtitle, { color: colors.textMuted }]}>
                                    Pregled trenutnih sredstava
                                </Text>


                                <View style={[styles.balanceAmountBox, { backgroundColor: colors.card }]}>
                                    <Text style={[styles.balanceAmount, { color: balanceColor }]}>
                                        {accountBalance >= 0 ? "+" : ""}€{accountBalance.toFixed(2)}
                                    </Text>
                                    <Text style={[styles.balanceAmountLabel, { color: colors.textMuted }]}>
                                        Trenutno stanje
                                    </Text>
                                </View>

                                {/* Detalji: budžet i limit */}
                                <View style={styles.balanceDetails}>
                                    <View style={[styles.balanceDetailRow, { borderBottomColor: colors.border }]}>
                                        <View style={styles.balanceDetailLeft}>
                                            <Ionicons name="calendar-outline" size={16} color={colors.accent} />
                                            <Text style={[styles.balanceDetailLabel, { color: colors.textSecondary }]}>
                                                Mjesečni budžet
                                            </Text>
                                        </View>
                                        <Text style={[styles.balanceDetailValue, { color: colors.text }]}>
                                            €{(userData?.monthlyBudget || 0).toFixed(2)}
                                        </Text>
                                    </View>

                                </View>

                                <Pressable
                                    style={[styles.balanceCloseBtn, { backgroundColor: colors.accent }]}
                                    onPress={() => setBalanceModal(false)}
                                >
                                    <Text style={styles.balanceCloseBtnText}>Zatvori</Text>
                                </Pressable>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>

            {/* LIMIT MODAL */}
            <Modal visible={limitModal} transparent animationType="slide">
                <TouchableWithoutFeedback onPress={() => setLimitModal(false)}>
                    <View style={[styles.modalOverlay, { backgroundColor: colors.overlay }]}>
                        <TouchableWithoutFeedback>
                            <View style={[styles.modal, { backgroundColor: colors.cardStrong }]}>
                                <Text style={[styles.modalTitle, { color: colors.text }]}>Postavi limit potrošnje</Text>
                                <TextInput
                                    value={editLimit}
                                    onChangeText={setEditLimit}
                                    style={[styles.modalInput, { backgroundColor: colors.input, color: colors.text }]}
                                    placeholder="Maksimalni iznos u €"
                                    placeholderTextColor={colors.textMuted}
                                    keyboardType="numeric"
                                />
                                <View style={styles.modalButtons}>
                                    <Pressable style={[styles.modalBtn, { backgroundColor: colors.card }]} onPress={() => setLimitModal(false)}>
                                        <Text style={[styles.modalBtnText, { color: colors.textSecondary }]}>Odustani</Text>
                                    </Pressable>
                                    <Pressable style={[styles.modalBtn, { backgroundColor: colors.accent }]} onPress={handleSaveLimit}>
                                        <Text style={[styles.modalBtnText, { color: "#fff" }]}>{saving ? "..." : "Spremi"}</Text>
                                    </Pressable>
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </ScreenBackground>
    );
}

const styles = StyleSheet.create({
    container: { padding: 22, paddingTop: 65, paddingBottom: 120 },
    profileHeader: { borderRadius: 28, padding: 24, alignItems: "center", marginBottom: 24, shadowColor: "#000", shadowOpacity: 0.08, shadowRadius: 16, elevation: 5 },
    avatar: { width: 80, height: 80, borderRadius: 40, justifyContent: "center", alignItems: "center", marginBottom: 12 },
    avatarText: { fontSize: 32, fontWeight: "900", color: "#fff" },
    profileName: { fontSize: 24, fontWeight: "800" },
    profileEmail: { fontSize: 14, marginTop: 4, marginBottom: 16 },
    profileStats: { flexDirection: "row", alignItems: "center", width: "100%" },
    profileStat: { flex: 1, alignItems: "center" },
    profileStatValue: { fontSize: 16, fontWeight: "800" },
    profileStatLabel: { fontSize: 11, marginTop: 3 },
    profileStatDivider: { width: 1, height: 30 },
    section: { fontSize: 11, fontWeight: "700", letterSpacing: 1.5, marginTop: 22, marginBottom: 8, marginLeft: 4 },
    settingRow: { flexDirection: "row", alignItems: "center", padding: 14, borderRadius: 18, marginBottom: 8, gap: 12, shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 6, elevation: 1 },
    settingIcon: { width: 40, height: 40, borderRadius: 12, justifyContent: "center", alignItems: "center" },
    settingInfo: { flex: 1 },
    settingLabel: { fontSize: 15, fontWeight: "600" },
    settingValue: { fontSize: 12, marginTop: 2 },
    version: { textAlign: "center", marginTop: 30, fontSize: 12 },
    modalOverlay: { flex: 1, justifyContent: "center", alignItems: "center" },
    modal: { width: "86%", borderRadius: 26, padding: 24, shadowColor: "#000", shadowOpacity: 0.2, shadowRadius: 20, elevation: 10 },
    modalTitle: { fontSize: 20, fontWeight: "800", marginBottom: 16 },
    modalInput: { borderRadius: 14, padding: 14, fontSize: 16, marginBottom: 16 },
    modalButtons: { flexDirection: "row", gap: 10 },
    modalBtn: { flex: 1, padding: 14, borderRadius: 14, alignItems: "center" },
    modalBtnText: { fontWeight: "700", fontSize: 15 },


    balanceModal: { alignItems: "center", gap: 0 },
    balanceIconWrap: { width: 64, height: 64, borderRadius: 20, justifyContent: "center", alignItems: "center", marginBottom: 16 },
    balanceSubtitle: { fontSize: 13, marginTop: -10, marginBottom: 20, textAlign: "center" },
    balanceAmountBox: { width: "100%", borderRadius: 18, padding: 20, alignItems: "center", marginBottom: 16 },
    balanceAmount: { fontSize: 36, fontWeight: "900", letterSpacing: -1 },
    balanceAmountLabel: { fontSize: 12, marginTop: 4 },
    balanceDetails: { width: "100%", marginBottom: 20 },
    balanceDetailRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 12, borderBottomWidth: 1 },
    balanceDetailLeft: { flexDirection: "row", alignItems: "center", gap: 8 },
    balanceDetailLabel: { fontSize: 14 },
    balanceDetailValue: { fontSize: 14, fontWeight: "700" },
    balanceCloseBtn: { width: "100%", padding: 15, borderRadius: 16, alignItems: "center" },
    balanceCloseBtnText: { color: "#fff", fontWeight: "700", fontSize: 15 },
});
