import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import { useRouter } from "expo-router";

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        // kasnije promijeniT u /dashboard ili /home ovisno gdje zelimo da nas vodi
        router.replace("/home");
      } else {
        router.replace("/login");
      }
    });

    return () => unsub();
  }, []);

  return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
  );
}