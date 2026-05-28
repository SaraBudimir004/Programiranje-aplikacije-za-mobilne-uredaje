import { View, Text, TextInput, Pressable, StyleSheet, ActivityIndicator } from "react-native";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import { useRouter } from "expo-router";

export default function LoginScreen() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        setError("");
        setSuccess("");
        setLoading(true);

        try {
            await signInWithEmailAndPassword(auth, email, password);

            setSuccess(" Login successful! Welcome back!");

            // mala pauza da user vidi poruku
            setTimeout(() => {
                router.replace("/");
            }, 800);

        } catch (err: any) {
            setError(" Invalid email or password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome back</Text>

            <TextInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
                placeholderTextColor="#888"
            />

            <TextInput
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={styles.input}
                placeholderTextColor="#888"
            />

            {error ? <Text style={styles.error}>{error}</Text> : null}
            {success ? <Text style={styles.success}>{success}</Text> : null}

            <Pressable
                style={[styles.button, loading && { opacity: 0.6 }]}
                onPress={handleLogin}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator color="#000" />
                ) : (
                    <Text style={styles.buttonText}>Login</Text>
                )}
            </Pressable>

            <Pressable onPress={() => router.push("/register")}>
                <Text style={styles.link}>
                    Don’t have account? <Text style={{ fontWeight: "700" }}>Sign up</Text>
                </Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        justifyContent: "center",
        backgroundColor: "#0B0F1A",
    },
    title: {
        fontSize: 34,
        fontWeight: "800",
        color: "#fff",
        marginBottom: 30,
    },
    input: {
        backgroundColor: "#161B2E",
        padding: 14,
        borderRadius: 12,
        marginBottom: 12,
        color: "#fff",
    },
    button: {
        backgroundColor: "#00D2D3",
        padding: 14,
        borderRadius: 12,
        marginTop: 10,
        alignItems: "center",
    },
    buttonText: {
        color: "#000",
        fontWeight: "700",
    },
    link: {
        color: "#aaa",
        textAlign: "center",
        marginTop: 20,
    },
    error: {
        color: "#ff4d4d",
        marginBottom: 10,
        fontWeight: "600",
    },
    success: {
        color: "#00ff9d",
        marginBottom: 10,
        fontWeight: "600",
    },
});