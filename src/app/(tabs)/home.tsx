import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Pressable,
    Animated,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import ScreenBackground from "../../components/ScreenBackground";

import { auth, firestore } from "../../../firebaseConfig";

import { doc, getDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "expo-router";

export default function HomeScreen() {
    const router = useRouter();

    const [name, setName] = useState("Korisnik");
    const [balance, setBalance] = useState<number>(0);

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const translateAnim = useRef(new Animated.Value(40)).current;

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
        ]).start();
    }, []);

    useEffect(() => {
        const fetchUser = async () => {
            const user = auth.currentUser;

            if (!user) return;

            const ref = doc(firestore, "users", user.uid);
            const snap = await getDoc(ref);

            if (snap.exists()) {
                const data = snap.data();

                setName(data.ime || "Korisnik");
                setBalance(data.totalBudget || 0);
            }
        };

        fetchUser();
    }, []);

    const handleLogout = async () => {
        await signOut(auth);

        router.replace("/login");
    };

    return (
        <ScreenBackground>
            <ScrollView
                contentContainerStyle={styles.container}
                showsVerticalScrollIndicator={false}
            >
                <Animated.View
                    style={{
                        opacity: fadeAnim,
                        transform: [{ translateY: translateAnim }],
                    }}
                >

                    {/* HEADER */}
                    <View style={styles.header}>
                        <View style={styles.headerText}>
                            <Text style={styles.welcome}>
                                Dobrodošao,
                            </Text>

                            <Text style={styles.name}>
                                {name} 👋
                            </Text>
                        </View>

                        <Pressable
                            style={({ pressed }) => [
                                styles.logoutButton,
                                pressed && styles.pressed,
                            ]}
                            onPress={handleLogout}
                        >
                            <Ionicons
                                name="log-out-outline"
                                size={22}
                                color="#2563eb"
                            />
                        </Pressable>
                    </View>

                    {/* MAIN BALANCE CARD */}
                    <View style={styles.balanceCard}>
                        <Text style={styles.balanceLabel}>
                            Ukupno stanje
                        </Text>

                        <Text style={styles.balance}>
                            € {balance}
                        </Text>

                        <Text style={styles.balanceSub}>
                            Smart pregled tvojih financija
                        </Text>

                        <View style={styles.balanceRow}>
                            <View style={styles.miniCard}>
                                <Ionicons
                                    name="arrow-down-circle"
                                    size={18}
                                    color="#10b981"
                                />

                                <Text style={styles.miniText}>
                                    Prihodi
                                </Text>
                            </View>

                            <View style={styles.miniCard}>
                                <Ionicons
                                    name="arrow-up-circle"
                                    size={18}
                                    color="#ef4444"
                                />

                                <Text style={styles.miniText}>
                                    Troškovi
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* QUICK ACTIONS */}
                    <Text style={styles.sectionTitle}>
                        Brze radnje
                    </Text>

                    <View style={styles.actionsRow}>
                        <Pressable
                            style={({ pressed }) => [
                                styles.actionCard,
                                pressed && styles.pressed,
                            ]}
                            onPress={() =>
                                router.push("/(tabs)/transaction")
                            }
                        >
                            <Ionicons
                                name="add-circle"
                                size={34}
                                color="#10b981"
                            />

                            <Text style={styles.actionText}>
                                Dodaj prihod
                            </Text>
                        </Pressable>

                        <Pressable
                            style={({ pressed }) => [
                                styles.actionCard,
                                pressed && styles.pressed,
                            ]}
                            onPress={() =>
                                router.push("/(tabs)/transaction")
                            }
                        >
                            <Ionicons
                                name="remove-circle"
                                size={34}
                                color="#ef4444"
                            />

                            <Text style={styles.actionText}>
                                Dodaj trošak
                            </Text>
                        </Pressable>
                    </View>

                    {/* ANALIZA */}
                    <Pressable
                        style={({ pressed }) => [
                            styles.analyticsCard,
                            pressed && styles.pressed,
                        ]}
                        onPress={() =>
                            router.push("/(tabs)/analytics")
                        }
                    >
                        <View>
                            <Text style={styles.analyticsTitle}>
                                Analitika troškova
                            </Text>

                            <Text style={styles.analyticsSub}>
                                Pregledaj svoje financijske navike,
                                grafove i mjesečne analize.
                            </Text>
                        </View>

                        <Ionicons
                            name="stats-chart"
                            size={34}
                            color="#2563eb"
                        />
                    </Pressable>

                    {/* AI CARD */}
                    <View style={styles.aiCard}>
                        <Ionicons
                            name="sparkles"
                            size={20}
                            color="#7c3aed"
                        />

                        <Text style={styles.aiText}>
                            Smart insight: Ovaj mjesec trošiš manje
                            nego prošli mjesec. Odličan posao 🚀
                        </Text>
                    </View>
                </Animated.View>
            </ScrollView>
        </ScreenBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 24,
        paddingTop: 70,
        paddingBottom: 120,
    },

    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    headerText: {
        flexDirection: "row",
        alignItems: "center",
        flexWrap: "wrap",
    },

    welcome: {
        fontSize: 30,
        fontWeight: "300",
        color: "#0f172a",
    },

    name: {
        fontSize: 32,
        fontWeight: "800",
        color: "#0f172a",
        marginLeft: 8,
    },

    logoutButton: {
        width: 50,
        height: 50,
        borderRadius: 18,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(255,255,255,0.65)",

        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 10,
        shadowOffset: {
            width: 0,
            height: 4,
        },

        elevation: 5,
    },

    balanceCard: {
        marginTop: 34,

        backgroundColor: "rgba(255,255,255,0.72)",

        borderRadius: 30,

        padding: 24,

        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 18,

        shadowOffset: {
            width: 0,
            height: 6,
        },

        elevation: 5,
    },

    balanceLabel: {
        color: "#64748b",
        fontSize: 15,
        fontWeight: "500",
    },

    balance: {
        fontSize: 52,
        fontWeight: "900",
        color: "#0f172a",
        marginTop: 10,
    },

    balanceSub: {
        marginTop: 6,
        color: "#475569",
        fontSize: 15,
    },

    balanceRow: {
        flexDirection: "row",
        marginTop: 22,
    },

    miniCard: {
        flexDirection: "row",
        alignItems: "center",

        backgroundColor: "rgba(255,255,255,0.9)",

        paddingVertical: 10,
        paddingHorizontal: 14,

        borderRadius: 14,

        marginRight: 10,
    },

    miniText: {
        marginLeft: 6,
        color: "#0f172a",
        fontWeight: "600",
    },

    sectionTitle: {
        marginTop: 34,
        marginBottom: 14,

        fontSize: 22,
        fontWeight: "800",

        color: "#0f172a",
    },

    actionsRow: {
        flexDirection: "row",
        justifyContent: "space-between",
    },

    actionCard: {
        width: "48%",

        backgroundColor: "rgba(255,255,255,0.72)",

        paddingVertical: 26,

        borderRadius: 24,

        alignItems: "center",

        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowRadius: 14,

        shadowOffset: {
            width: 0,
            height: 4,
        },

        elevation: 4,
    },

    actionText: {
        marginTop: 10,

        fontSize: 15,
        fontWeight: "700",

        color: "#0f172a",
    },

    analyticsCard: {
        marginTop: 20,

        backgroundColor: "rgba(255,255,255,0.72)",

        borderRadius: 26,

        padding: 22,

        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",

        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowRadius: 14,

        shadowOffset: {
            width: 0,
            height: 4,
        },

        elevation: 4,
    },

    analyticsTitle: {
        fontSize: 20,
        fontWeight: "800",
        color: "#0f172a",
    },

    analyticsSub: {
        marginTop: 6,

        color: "#475569",

        width: 230,

        lineHeight: 20,
    },

    aiCard: {
        marginTop: 24,

        backgroundColor: "rgba(255,255,255,0.72)",

        borderRadius: 20,

        padding: 18,

        flexDirection: "row",
        alignItems: "center",

        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 10,

        shadowOffset: {
            width: 0,
            height: 3,
        },

        elevation: 3,
    },

    aiText: {
        marginLeft: 10,

        flex: 1,

        color: "#0f172a",

        fontWeight: "500",

        lineHeight: 21,
    },

    pressed: {
        opacity: 0.8,
        transform: [{ scale: 0.98 }],
    },
});