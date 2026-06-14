import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface QuickActionsProps {
    colors: any;
    onAddIncome: () => void;
    onAddExpense: () => void;
    onAnalytics: () => void;
}

export default function QuickActions({
                                         colors,
                                         onAddIncome,
                                         onAddExpense,
                                         onAnalytics,
                                     }: QuickActionsProps) {
    return (
        <>
            <Text style={[styles.sectionTitle, { color: colors.textHeading }]}>
                Brze radnje
            </Text>
            <View style={styles.actionsRow}>
                <Pressable
                    style={({ pressed }) => [
                        styles.actionCard,
                        { backgroundColor: colors.card },
                        pressed && styles.pressed,
                    ]}
                    onPress={onAddIncome}
                >
                    <View
                        style={[styles.actionIcon, { backgroundColor: "rgba(16,185,129,0.15)" }]}
                    >
                        <Ionicons name="add-circle" size={30} color={colors.success} />
                    </View>
                    <Text style={[styles.actionText, { color: colors.text }]}>
                        Dodaj{"\n"}prihod
                    </Text>
                </Pressable>

                <Pressable
                    style={({ pressed }) => [
                        styles.actionCard,
                        { backgroundColor: colors.card },
                        pressed && styles.pressed,
                    ]}
                    onPress={onAddExpense}
                >
                    <View
                        style={[styles.actionIcon, { backgroundColor: "rgba(239,68,68,0.15)" }]}
                    >
                        <Ionicons name="remove-circle" size={30} color={colors.danger} />
                    </View>
                    <Text style={[styles.actionText, { color: colors.text }]}>
                        Dodaj{"\n"}trošak
                    </Text>
                </Pressable>

                <Pressable
                    style={({ pressed }) => [
                        styles.actionCard,
                        { backgroundColor: colors.card },
                        pressed && styles.pressed,
                    ]}
                    onPress={onAnalytics}
                >
                    <View
                        style={[styles.actionIcon, { backgroundColor: "rgba(124,58,237,0.15)" }]}
                    >
                        <Ionicons name="stats-chart" size={28} color={colors.purple} />
                    </View>
                    <Text style={[styles.actionText, { color: colors.text }]}>
                        Analitika
                    </Text>
                </Pressable>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    sectionTitle: {
        marginTop: 28,
        marginBottom: 14,
        fontSize: 20,
        fontWeight: "800",
    },
    actionsRow: { flexDirection: "row", gap: 12 },
    actionCard: {
        flex: 1,
        paddingVertical: 20,
        borderRadius: 22,
        alignItems: "center",
        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 4 },
        elevation: 3,
    },
    actionIcon: {
        width: 52,
        height: 52,
        borderRadius: 16,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 8,
    },
    actionText: { fontSize: 13, fontWeight: "700", textAlign: "center" },
    pressed: { opacity: 0.8, transform: [{ scale: 0.97 }] },
});
