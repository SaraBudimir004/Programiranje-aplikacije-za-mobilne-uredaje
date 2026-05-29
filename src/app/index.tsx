import { View, Text, Pressable, StyleSheet, ImageBackground, Image } from "react-native";
import { useRouter } from "expo-router";

export default function Home() {
  const router = useRouter();

  return (
      <ImageBackground
          source={{
            uri: "https://i.pinimg.com/1200x/f1/c4/6a/f1c46a9783ff0aa8b16e4cd8a0b1bd35.jpg",
          }}
          style={styles.background}
      >
        <View style={styles.overlay}>

          {/* LOGO */}
          <Image
              source={require("../../assets/money.png")}
              style={styles.rightImage}
          />

          {/* GUMB */}
          <View style={styles.buttonWrapper}>
            <Pressable
                style={styles.button}
                onPress={() => router.push("/login")}
            >
              <Text style={styles.buttonText}>Prijava</Text>
            </Pressable>
          </View>

        </View>
      </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },

  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
  },

  // 🔥 LOGO VEĆI + DESNO
  rightImage: {
    width: 400,
    height: 400,
    resizeMode: "contain",
    position: "absolute",
    right: 20,
    top: "-3%",
  },

  buttonWrapper: {
    width: "100%",
    alignItems: "flex-end",
    paddingRight: 20,
    position: "absolute",
    bottom: 40,
  },
  button: {
    backgroundColor: "#fff",
    paddingVertical: 18,
    paddingHorizontal: 60,
    borderRadius: 14,
    width: "80%",
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
  },

  buttonText: {
    color: "#000",
    fontSize: 18,
    fontWeight: "600",
  },
});