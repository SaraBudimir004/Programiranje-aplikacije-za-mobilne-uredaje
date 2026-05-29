import {
    View,
    Text,
    TextInput,
    Pressable,
    StyleSheet,
    ActivityIndicator,
    useWindowDimensions,
} from "react-native";
import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, firestore } from "../../firebaseConfig";
import { useRouter } from "expo-router";
import ScreenBackground from "../components/ScreenBackground";

export default function RegisterScreen() {
    const router = useRouter();
    const { width } = useWindowDimensions();

    const isDesktop = width >= 768;

    const [ime, setIme] = useState("");
    const [prezime, setPrezime] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [godine, setGodine] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        setError("");
        setLoading(true);

        try {
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );

            const user = userCredential.user;

            await setDoc(doc(firestore, "users", user.uid), {
                ime,
                prezime,
                email,
                godine,
                createdAt: new Date(),
            });

            router.replace("/login");
        } catch (err: any) {
            setError("Nešto je pošlo po zlu. Provjeri podatke.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScreenBackground>
            <View style={styles.container}>
                <View
                    style={[
                        styles.card,
                        { width: isDesktop ? "45%" : "85%" },
                    ]}
                >
                    <Text style={styles.title}>Registracija</Text>

                    <TextInput
                        placeholder="Ime (npr. Ana)"
                        value={ime}
                        onChangeText={setIme}
                        style={styles.input}
                        placeholderTextColor="#999"
                    />

                    <TextInput
                        placeholder="Prezime (npr. Marić)"
                        value={prezime}
                        onChangeText={setPrezime}
                        style={styles.input}
                        placeholderTextColor="#999"
                    />

                    <TextInput
                        placeholder="Email (npr. ime@gmail.com)"
                        value={email}
                        onChangeText={setEmail}
                        style={styles.input}
                        placeholderTextColor="#999"
                        autoCapitalize="none"
                    />

                    <TextInput
                        placeholder="Lozinka (npr. 123456)"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        style={styles.input}
                        placeholderTextColor="#999"
                    />

                    <TextInput
                        placeholder="Godine (npr. 20)"
                        value={godine}
                        onChangeText={setGodine}
                        style={styles.input}
                        placeholderTextColor="#999"
                        keyboardType="numeric"
                    />

                    {error ? <Text style={styles.error}>{error}</Text> : null}

                    <Pressable
                        style={[styles.button, loading && { opacity: 0.6 }]}
                        onPress={handleRegister}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#1f6feb" />
                        ) : (
                            <Text style={styles.buttonText}>
                                Kreiraj račun
                            </Text>
                        )}
                    </Pressable>

                    <Pressable onPress={() => router.push("/login")}>
                        <Text style={styles.link}>
                            Već imaš račun?{" "}
                            <Text style={styles.linkBold}>Prijavi se</Text>
                        </Text>
                    </Pressable>
                </View>
            </View>
        </ScreenBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },

    card: {
        backgroundColor: "rgba(255,255,255,0.92)",
        padding: 24,
        borderRadius: 16,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },

    title: {
        fontSize: 26,
        fontWeight: "600",
        color: "#222",
        marginBottom: 20,
    },

    input: {
        backgroundColor: "#f2f4f7",
        padding: 14,
        borderRadius: 10,
        marginBottom: 12,
        color: "#111",
    },

    button: {
        backgroundColor: "#1f6feb",
        padding: 14,
        borderRadius: 10,
        alignItems: "center",
        marginTop: 10,
    },

    buttonText: {
        color: "#fff",
        fontWeight: "600",
    },

    link: {
        marginTop: 16,
        textAlign: "center",
        color: "#666",
    },

    linkBold: {
        color: "#1f6feb",
        fontWeight: "600",
    },

    error: {
        color: "#b00020",
        marginBottom: 10,
        fontSize: 13,
    },
});