import { View, Text, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../context/ThemeContext";

type Props = {
    activeSection: "income" | "expense";
    onSelect: (s: "income" | "expense") => void;
};

export default function SectionToggle({ activeSection, onSelect }: Props) {
    const { colors } = useTheme();

    return (
        <View style={[styles.sectionToggle, { backgroundColor: colors.card }]}>
            <Pressable
                style={[styles.toggleBtn, activeSection === "income" && { backgroundColor: colors.success }]}
                onPress={() => onSelect("income")}
            >
                <Ionicons name="arrow-down-circle" size={16} color={activeSection === "income" ? "#fff" : colors.textSecondary} />
                <Text style={[styles.toggleText, { color: activeSection === "income" ? "#fff" : colors.textSecondary }]}>Prihod</Text>
            </Pressable>
            <Pressable
                style={[styles.toggleBtn, activeSection === "expense" && { backgroundColor: colors.danger }]}
                onPress={() => onSelect("expense")}
            >
                <Ionicons name="arrow-up-circle" size={16} color={activeSection === "expense" ? "#fff" : colors.textSecondary} />
                <Text style={[styles.toggleText, { color: activeSection === "expense" ? "#fff" : colors.textSecondary }]}>Trošak</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    sectionToggle: { flexDirection: "row", borderRadius: 18, padding: 4, marginBottom: 14 },
    toggleBtn: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", paddingVertical: 12, borderRadius: 14, gap: 6 },
    toggleText: { fontWeight: "700", fontSize: 15 },
});
