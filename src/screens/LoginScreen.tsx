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
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import { useRouter } from "expo-router";
import ScreenBackground from "../components/ScreenBackground";

export default function LoginScreen() {
    const router = useRouter();
    const { width } = useWindowDimensions();

    const isDesktop = width >= 768;

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        setError("");
        setLoading(true);

        try {
            await signInWithEmailAndPassword(auth, email, password);
            router.replace("/(tabs)/home");
        } catch (err: any) {
            setError("Nevažeća e-pošta ili lozinka");
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
                        { width: isDesktop ? "45%" : "85%" }, // responsive
                    ]}
                >
                    <Text style={styles.title}>Prijava</Text>

                    <TextInput
                        placeholder="Email (npr. ime@gmail.com)"
                        value={email}
                        onChangeText={setEmail}
                        style={styles.input}
                        placeholderTextColor="#999"
                    />

                    <TextInput
                        placeholder="Lozinka (npr. 123456)"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        style={styles.input}
                        placeholderTextColor="#999"
                    />

                    {error ? <Text style={styles.error}>{error}</Text> : null}

                    <Pressable
                        style={[styles.button, loading && { opacity: 0.6 }]}
                        onPress={handleLogin}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#1f6feb" />
                        ) : (
                            <Text style={styles.buttonText}>Prijavi se</Text>
                        )}
                    </Pressable>

                    <Pressable onPress={() => router.push("/register")}>
                        <Text style={styles.link}>
                            Ako nemaš račun?{" "}
                            <Text style={styles.linkBold}>Registriraj se</Text>
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