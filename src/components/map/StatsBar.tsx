import { Ionicons } from "@expo/vector-icons";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { LocationGroup, Receipt } from "./types";

interface StatsBarProps {
    colors: any;
    loading: boolean;
    groups: LocationGroup[];
    receipts: Receipt[];
}

export default function StatsBar({
                                     colors,
                                     loading,
                                     groups,
                                     receipts,
                                 }: StatsBarProps) {
    if (loading) return null;

    const totalLocations = groups.length;
    const totalReceipts = receipts.filter((r) => r.latitude).length;
    const topSpend = [...groups].sort((a, b) => b.totalAmount - a.totalAmount)[0];
    const topVisit = [...groups].sort(
        (a, b) => b.receipts.length - a.receipts.length,
    )[0];
    const totalSpent = groups.reduce((s, g) => s + g.totalAmount, 0);

    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={[styles.statsScroll, { backgroundColor: colors.card }]}
        >
            <StatChip
                icon="location"
                label="Lokacija"
                value={`${totalLocations}`}
                color="#60A5FA"
                colors={colors}
            />
            <StatChip
                icon="receipt"
                label="Računi"
                value={`${totalReceipts}`}
                color="#34D399"
                colors={colors}
            />
            <StatChip
                icon="cash"
                label="Ukupno"
                value={`€${totalSpent.toFixed(0)}`}
                color="#FBBF24"
                colors={colors}
            />
            {topSpend && (
                <StatChip
                    icon="flame"
                    label="Najviše potrošeno"
                    value={topSpend.storeName}
                    color="#F87171"
                    colors={colors}
                />
            )}
            {topVisit && (
                <StatChip
                    icon="star"
                    label="Najposjećenije"
                    value={topVisit.storeName}
                    color="#A78BFA"
                    colors={colors}
                />
            )}
        </ScrollView>
    );
}

function StatChip({ icon, label, value, color, colors }: any) {
    return (
        <View style={[styles.chip, { backgroundColor: colors.input }]}>
            <Ionicons name={icon} size={16} color={color} />
            <View>
                <Text style={[styles.label, { color: colors.textMuted }]}>{label}</Text>
                <Text style={[styles.value, { color: colors.text }]} numberOfLines={1}>
                    {value}
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    statsScroll: { paddingVertical: 10, paddingHorizontal: 12 },
    chip: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        borderRadius: 14,
        paddingVertical: 10,
        paddingHorizontal: 14,
        marginRight: 8,
    },
    label: { fontSize: 10, fontWeight: "600" },
    value: { fontSize: 14, fontWeight: "800", maxWidth: 120 },
});
