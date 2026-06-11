import { useRouter } from "expo-router";
import {
  Dimensions,
  Image,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

const { width, height } = Dimensions.get("window");

const isTabletOrDesktop = width > 768;

export default function Home() {
  const router = useRouter();

  return (
      <ImageBackground
          source={require("../../assets/1.jpg")}
          style={styles.background}
          resizeMode="cover"
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
    width: "100%",
    height: "100%",
  },

  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
  },

  rightImage: {
    width: isTabletOrDesktop ? 260 : width * 0.35,
    height: isTabletOrDesktop ? 260 : width * 0.35,
    resizeMode: "contain",
    position: "absolute",
    top: isTabletOrDesktop ? "10%" : "30%",
    right: isTabletOrDesktop ? 70 : width * 0.08,
    opacity: 0.9,
  },

  buttonWrapper: {
    position: "absolute",
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: "center",
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
