import { Pressable, StyleSheet, Text, View } from "react-native";

interface MapLegendProps {
    colors: any;
    filterCat: string;
    onClearFilter: () => void;
}

export default function MapLegend({
                                      colors,
                                      filterCat,
                                      onClearFilter,
                                  }: MapLegendProps) {
    return (
        <View style={[styles.legend, { backgroundColor: colors.card }]}>
            {[
                { c: "#22c55e", l: "Česta" },
                { c: "#FBBF24", l: "Povremena" },
                { c: "#ef4444", l: "Rijetka" },
            ].map((x) => (
                <View key={x.c} style={styles.legendItem}>
                    <View style={[styles.dot, { backgroundColor: x.c }]} />
                    <Text style={[styles.legendText, { color: colors.textSecondary }]}>
                        {x.l}
                    </Text>
                </View>
            ))}
            {filterCat !== "Sve" && (
                <Pressable onPress={onClearFilter} style={styles.clearFilter}>
                    <Text style={{ color: colors.accent, fontWeight: "700", fontSize: 12 }}>
                        ✕ {filterCat}
                    </Text>
                </Pressable>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    legend: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
        paddingVertical: 10,
        paddingBottom: 28,
    },
    legendItem: { flexDirection: "row", alignItems: "center", gap: 6 },
    dot: { width: 12, height: 12, borderRadius: 6 },
    legendText: { fontSize: 12, fontWeight: "600" },
    clearFilter: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        backgroundColor: "rgba(96,165,250,0.15)",
        borderRadius: 10,
    },
});
