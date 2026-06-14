import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface MapHeaderProps {
    colors: any;
    onFilterPress: () => void;
}

export default function MapHeader({ colors, onFilterPress }: MapHeaderProps) {
    return (
        <View style={[styles.topBar, { backgroundColor: colors.card }]}>
            <Text style={[styles.pageTitle, { color: colors.text }]}>
                🗺️ Mapa troškova
            </Text>
            <Pressable
                onPress={onFilterPress}
                style={[styles.filterBtn, { backgroundColor: colors.input }]}
            >
                <Ionicons name="options" size={20} color={colors.accent} />
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    topBar: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 18,
        paddingTop: 56,
        paddingBottom: 12,
    },
    pageTitle: { fontSize: 22, fontWeight: "900" },
    filterBtn: {
        width: 40,
        height: 40,
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
    },
});
