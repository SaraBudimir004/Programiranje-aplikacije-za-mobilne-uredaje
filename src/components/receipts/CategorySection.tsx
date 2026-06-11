import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useTheme } from "../../context/ThemeContext";

export const CATEGORIES = ["Hrana", "Prijevoz", "Šoping", "Zabava", "Računi", "Ostalo"];

export const CAT_ICONS: Record<string, string> = {
    Hrana: "restaurant",
    Prijevoz: "car",
    Šoping: "bag-handle",
    Zabava: "game-controller",
    Računi: "receipt",
    Ostalo: "ellipsis-horizontal",
};

interface Props {
    category: string;
    onOpen: () => void;
}

export function CategorySection({ category, onOpen }: Props) {
    const { colors } = useTheme();

    return (
        <View style={[styles.section, { backgroundColor: colors.card }]}>
            <View style={styles.sectionHeader}>
                <Ionicons name="pricetag" size={20} color={colors.accent} />
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Kategorija</Text>
            </View>
            <Pressable
                style={[styles.dropdownTrigger, { backgroundColor: colors.input }]}
                onPress={onOpen}
            >
                <View style={styles.dropLeft}>
                    <Ionicons name={(CAT_ICONS[category] ?? "receipt") as any} size={18} color={colors.accent} />
                    <Text style={[styles.dropText, { color: colors.text }]}>{category}</Text>
                </View>
                <Ionicons name="chevron-down" size={18} color={colors.textMuted} />
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    section: { borderRadius: 22, padding: 18, marginBottom: 14 },
    sectionHeader: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 14 },
    sectionTitle: { fontSize: 17, fontWeight: "800", flex: 1 },
    dropdownTrigger: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderRadius: 14, padding: 14 },
    dropLeft: { flexDirection: "row", alignItems: "center", gap: 8 },
    dropText: { fontWeight: "600", fontSize: 15 },
});
