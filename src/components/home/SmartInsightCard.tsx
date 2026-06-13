import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

interface SmartInsightCardProps {
    colors: any;
    spentPercent: number;
}

export default function SmartInsightCard({
                                             colors,
                                             spentPercent,
                                         }: SmartInsightCardProps) {
    return (
        <View style={[styles.aiCard, { backgroundColor: colors.card }]}>
            <View style={[styles.aiIcon, { backgroundColor: "rgba(124,58,237,0.15)" }]}>
                <Ionicons name="sparkles" size={20} color={colors.purple} />
            </View>
            <Text style={[styles.aiText, { color: colors.text }]}>
                {spentPercent > 80
                    ? "⚠️ Blizu si limita budžeta! Pazi na potrošnju."
                    : spentPercent > 50
                        ? "📊 Prešao si polovicu budžeta. Sve pod kontrolom!"
                        : "✅ Odlično! Financije su u redu ovaj mjesec."}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    aiCard: {
        marginTop: 16,
        borderRadius: 20,
        padding: 16,
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    aiIcon: {
        width: 40,
        height: 40,
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
    },
    aiText: { flex: 1, fontWeight: "500", lineHeight: 20 },
});
