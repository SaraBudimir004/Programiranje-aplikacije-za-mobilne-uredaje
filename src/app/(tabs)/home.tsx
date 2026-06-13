import { useRouter } from "expo-router";
import { signOut } from "firebase/auth";
import { collection, doc, onSnapshot } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { Animated, ScrollView, StyleSheet } from "react-native";
import { auth, firestore } from "../../../firebaseConfig";
import BalanceCard from "../../components/home/BalanceCard";
import HomeHeader from "../../components/home/HomeHeader";
import QuickActions from "../../components/home/QuickActions";
import RecentTransactions from "../../components/home/RecentTransactions";
import SmartInsightCard from "../../components/home/SmartInsightCard";
import ScreenBackground from "../../components/ScreenBackground";
import { useTheme } from "../../context/ThemeContext";

export default function HomeScreen() {
    const router = useRouter();
    const { colors, isDark } = useTheme();

    const [name, setName] = useState("Korisnik");
    const [balance, setBalance] = useState<number>(0);
    const [monthlyBudget, setMonthlyBudget] = useState<number>(0);
    const [totalIncome, setTotalIncome] = useState<number>(0);
    const [totalExpense, setTotalExpense] = useState<number>(0);
    const [recentTransactions, setRecentTransactions] = useState<any[]>([]);

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const translateAnim = useRef(new Animated.Value(40)).current;
    const scaleAnim = useRef(new Animated.Value(0.95)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 700,
                useNativeDriver: true,
            }),
            Animated.timing(translateAnim, {
                toValue: 0,
                duration: 700,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                useNativeDriver: true,
                tension: 80,
                friction: 8,
            }),
        ]).start();
    }, []);

    useEffect(() => {
        const user = auth.currentUser;
        if (!user) return;

        const userRef = doc(firestore, "users", user.uid);
        const unsubUser = onSnapshot(userRef, (snap) => {
            if (snap.exists()) {
                const data = snap.data();
                setName(data.ime || "Korisnik");
                setBalance(data.totalBudget || 0);
                setMonthlyBudget(data.monthlyBudget || 0);
            }
        });

        const transRef = collection(firestore, "users", user.uid, "transactions");
        const unsubTrans = onSnapshot(transRef, (snap) => {
            let inc = 0,
                exp = 0;
            const all: any[] = [];
            snap.docs.forEach((d) => {
                const t = { id: d.id, ...d.data() } as any;
                all.push(t);
                if (t.type === "income") inc += Number(t.amount);
                else exp += Number(t.amount);
            });
            setTotalIncome(inc);
            setTotalExpense(exp);
            const sorted = all.sort((a, b) => {
                const ta = a.date?.seconds ? a.date.seconds : 0;
                const tb = b.date?.seconds ? b.date.seconds : 0;
                return tb - ta;
            });
            setRecentTransactions(sorted.slice(0, 3));
        });

        return () => {
            unsubUser();
            unsubTrans();
        };
    }, []);

    const handleLogout = async () => {
        await signOut(auth);
        router.replace("/login");
    };

    const spentPercent =
        monthlyBudget > 0 ? Math.min((totalExpense / monthlyBudget) * 100, 100) : 0;
    const budgetColor =
        spentPercent > 80
            ? colors.danger
            : spentPercent > 50
                ? colors.warning
                : colors.success;

    return (
        <ScreenBackground>
            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={styles.container}
                showsVerticalScrollIndicator={false}
            >
                <Animated.View
                    style={{
                        opacity: fadeAnim,
                        transform: [{ translateY: translateAnim }],
                    }}
                >
                    <HomeHeader
                        name={name}
                        colors={colors}
                        onProfilePress={() => router.push("/(tabs)/profile")}
                        onLogoutPress={handleLogout}
                    />

                    <BalanceCard
                        colors={colors}
                        scaleAnim={scaleAnim}
                        balance={balance}
                        monthlyBudget={monthlyBudget}
                        spentPercent={spentPercent}
                        budgetColor={budgetColor}
                        totalIncome={totalIncome}
                        totalExpense={totalExpense}
                    />

                    <QuickActions
                        colors={colors}
                        onAddIncome={() => router.push("/(tabs)/transaction")}
                        onAddExpense={() => router.push("/(tabs)/transaction")}
                        onAnalytics={() => router.push("/(tabs)/analytics")}
                    />

                    <RecentTransactions
                        colors={colors}
                        recentTransactions={recentTransactions}
                        onSeeAll={() => router.push("/(tabs)/transaction")}
                    />

                    <SmartInsightCard colors={colors} spentPercent={spentPercent} />
                </Animated.View>
            </ScrollView>
        </ScreenBackground>
    );
}

const styles = StyleSheet.create({
    container: { padding: 24, paddingTop: 20, paddingBottom: 120 },
});
