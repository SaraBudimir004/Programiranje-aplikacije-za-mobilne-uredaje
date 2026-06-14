import { Ionicons } from "@expo/vector-icons";
import {
    Modal, Pressable, ScrollView, StyleSheet, Text, TouchableWithoutFeedback, View,
} from "react-native";
import { colorLabel, LocationGroup } from "./types";

interface DetailModalProps {
    colors: any;
    visible: boolean;
    selectedGroup: LocationGroup | null;
    onClose: () => void;
    onReceiptImagePress: (url: string) => void;
}

export default function DetailModal({
                                        colors,
                                        visible,
                                        selectedGroup,
                                        onClose,
                                        onReceiptImagePress,
                                    }: DetailModalProps) {
    return (
        <Modal visible={visible} transparent animationType="slide">
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={[styles.overlay, { backgroundColor: "rgba(0,0,0,0.6)" }]}>
                    <TouchableWithoutFeedback>
                        <View
                            style={[
                                styles.detailModal,
                                { backgroundColor: colors.cardStrong ?? colors.card },
                            ]}
                        >
                            <View style={styles.modalHandle} />
                            {selectedGroup && (
                                <>
                                    <View style={styles.detailHeader}>
                                        <View
                                            style={[
                                                styles.colorBadge,
                                                { backgroundColor: colorLabel(selectedGroup.color).bg },
                                            ]}
                                        >
                                            <Text style={styles.colorBadgeText}>
                                                {colorLabel(selectedGroup.color).label}
                                            </Text>
                                        </View>
                                    </View>
                                    <Text style={[styles.modalStoreName, { color: colors.text }]}>
                                        {selectedGroup.storeName}
                                    </Text>
                                    {selectedGroup.address ? (
                                        <Text
                                            style={[styles.modalAddress, { color: colors.textSecondary }]}
                                        >
                                            📍 {selectedGroup.address}
                                        </Text>
                                    ) : null}
                                    <Text style={[styles.modalTotal, { color: colors.accent }]}>
                                        Ukupno potrošeno: €{selectedGroup.totalAmount.toFixed(2)}
                                    </Text>

                                    <ScrollView
                                        style={{ maxHeight: 300 }}
                                        showsVerticalScrollIndicator={false}
                                    >
                                        {selectedGroup.receipts.map((r, i) => (
                                            <View
                                                key={i}
                                                style={[styles.receiptRow, { backgroundColor: colors.input }]}
                                            >
                                                <View style={styles.receiptRowLeft}>
                                                    <Text
                                                        style={[styles.receiptDate, { color: colors.textSecondary }]}
                                                    >
                                                        {r.purchaseDate ?? "–"}{" "}
                                                        {r.purchaseTime ? `– ${r.purchaseTime}` : ""}
                                                    </Text>
                                                    <Text
                                                        style={[styles.receiptCat, { color: colors.textMuted }]}
                                                    >
                                                        {r.category}
                                                    </Text>
                                                </View>
                                                <View style={styles.receiptRowRight}>
                                                    <Text style={[styles.receiptAmt, { color: colors.text }]}>
                                                        €{r.amount.toFixed(2)}
                                                    </Text>
                                                    {r.receiptImageUrl && (
                                                        <Pressable
                                                            onPress={() => onReceiptImagePress(r.receiptImageUrl!)}
                                                        >
                                                            <Ionicons name="image" size={20} color={colors.accent} />
                                                        </Pressable>
                                                    )}
                                                </View>
                                            </View>
                                        ))}
                                    </ScrollView>

                                    <Pressable
                                        style={[styles.closeBtn, { backgroundColor: colors.input }]}
                                        onPress={onClose}
                                    >
                                        <Text style={[styles.closeBtnText, { color: colors.text }]}>
                                            Zatvori
                                        </Text>
                                    </Pressable>
                                </>
                            )}
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: { flex: 1, justifyContent: "flex-end" },
    detailModal: {
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: 22,
        paddingBottom: 34,
        maxHeight: "75%",
    },
    modalHandle: {
        width: 40,
        height: 4,
        borderRadius: 2,
        backgroundColor: "rgba(0,0,0,0.15)",
        alignSelf: "center",
        marginBottom: 14,
    },
    detailHeader: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
    colorBadge: { borderRadius: 10, paddingVertical: 4, paddingHorizontal: 10 },
    colorBadgeText: { color: "#fff", fontWeight: "800", fontSize: 12 },
    modalStoreName: { fontSize: 22, fontWeight: "900", marginBottom: 4 },
    modalAddress: { fontSize: 13, marginBottom: 8 },
    modalTotal: { fontSize: 18, fontWeight: "900", marginBottom: 14 },
    receiptRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderRadius: 14,
        padding: 12,
        marginBottom: 6,
    },
    receiptRowLeft: { flex: 1 },
    receiptRowRight: { flexDirection: "row", alignItems: "center", gap: 10 },
    receiptDate: { fontSize: 13, fontWeight: "600" },
    receiptCat: { fontSize: 12 },
    receiptAmt: { fontSize: 16, fontWeight: "800" },
    closeBtn: {
        borderRadius: 14,
        padding: 15,
        alignItems: "center",
        marginTop: 12,
    },
    closeBtnText: { fontWeight: "800", fontSize: 15 },
});
