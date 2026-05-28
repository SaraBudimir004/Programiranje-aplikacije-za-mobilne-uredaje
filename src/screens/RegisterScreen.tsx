import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, firestore } from "../../firebaseConfig";
import { useRouter } from "expo-router";

export default function RegisterScreen() {
    const router = useRouter();

    const [ime, setIme] = useState("");
    const [prezime, setPrezime] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [godine, setGodine] = useState("");
    const [error, setError] = useState("");

    const handleRegister = async () => {
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
            setError(err.message);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Create Account</Text>

            <TextInput placeholder="Ime" value={ime} onChangeText={setIme} style={styles.input} />
            <TextInput placeholder="Prezime" value={prezime} onChangeText={setPrezime} style={styles.input} />
            <TextInput placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" style={styles.input} />
            <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />
            <TextInput placeholder="Godine" value={godine} onChangeText={setGodine} style={styles.input} />

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <Pressable style={styles.button} onPress={handleRegister}>
                <Text style={styles.buttonText}>Sign up</Text>
            </Pressable>

            <Pressable onPress={() => router.push("/login")}>
                <Text style={styles.link}>
                    Already have an account? <Text style={{ fontWeight: "700" }}>Login</Text>
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
        backgroundColor: "#6C5CE7",
        padding: 14,
        borderRadius: 12,
        marginTop: 10,
    },
    buttonText: {
        color: "white",
        textAlign: "center",
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
    },
});