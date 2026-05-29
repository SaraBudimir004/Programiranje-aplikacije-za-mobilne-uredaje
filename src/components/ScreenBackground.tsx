import { ImageBackground, StyleSheet, Dimensions } from "react-native";

export default function ScreenBackground({ children }: any) {
    return (
        <ImageBackground
            source={require("../../assets/2.jpg")}
            style={styles.bg}
            resizeMode="cover"
        >
            {children}
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    bg: {
        flex: 1,
        width: "100%",
        height: Dimensions.get("window").height,
        minWidth: "100%",
        minHeight: "100%",
    },
});