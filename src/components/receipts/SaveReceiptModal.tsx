import { Ionicons } from "@expo/vector-icons";
import {
    ActivityIndicator,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    TouchableWithoutFeedback,
    View,
} from "react-native";
import { useTheme } from "../../context/ThemeContext";

interface Props {
    visible: boolean;
    onClose: () => void;
    manualAmount: string;
    onAmountChange: (v: string) => void;
    storeName: string;
    address: string;
    category: string;
    saving: boolean;
    uploadProgress: string;
    onSave: () => void;
}

export function SaveReceiptModal({
                                     visible,
                                     onClose,
                                     manualAmount,
                                     onAmountChange,
                                     storeName,
                                     address,
                                     category,
                                     saving,
                                     uploadProgress,
                                     onSave,
                                 }: Props) {
    const { colors } = useTheme();

    return (
        <Modal visible={visible} transparent animationType="slide">
            <TouchableWithoutFeedback onPress={() => !saving && onClose()}>
                <View style={[styles.overlay, { backgroundColor: "rgba(0,0,0,0.55)" }]}>
                    <TouchableWithoutFeedback>
                        <View style={[styles.modal, { backgroundColor: (colors as any).cardStrong ?? colors.card }]}>
                            <View style={styles.modalHandle} />
                            <Text style={[styles.modalTitle, { color: colors.text }]}>Unesi iznos</Text>
                            <Text style={[styles.amountLabel, { color: colors.textSecondary }]}>
                                Ukupni iznos računa (€):
                            </Text>
                            <TextInput
                                placeholder="0.00"
                                placeholderTextColor={colors.textMuted}
                                keyboardType="numeric"
                                value={manualAmount}
                                onChangeText={onAmountChange}
                                style={[
                                    styles.amountInput,
                                    { backgroundColor: colors.input, color: colors.text },
                                ]}
                                autoFocus
                            />
                            {storeName ? (
                                <Text style={[styles.infoText, { color: colors.textSecondary }]}>
                                    📍 {storeName}{address ? ` – ${address}` : ""}
                                </Text>
                            ) : null}
                            <Text style={[styles.infoText, { color: colors.textSecondary }]}>
                                🏷️ Kategorija: {category}
                            </Text>

                            {saving ? (
                                <View style={styles.savingRow}>
                                    <ActivityIndicator size="small" color={colors.accent} />
                                    <Text style={[styles.savingText, { color: colors.textSecondary }]}>
                                        {uploadProgress || "Sprema se..."}
                                    </Text>
                                </View>
                            ) : (
                                <View style={styles.modalBtns}>
                                    <Pressable
                                        style={[styles.modalBtn, { backgroundColor: colors.input }]}
                                        onPress={onClose}
                                    >
                                        <Text style={[styles.modalBtnText, { color: colors.text }]}>Odustani</Text>
                                    </Pressable>
                                    <Pressable
                                        style={[styles.modalBtn, { backgroundColor: "#22c55e" }]}
                                        onPress={onSave}
                                    >
                                        <Ionicons name="checkmark" size={18} color="#fff" />
                                        <Text style={[styles.modalBtnText, { color: "#fff" }]}>Spremi</Text>
                                    </Pressable>
                                </View>
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
    modal: { borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 24, paddingBottom: 36 },
    modalHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: "rgba(0,0,0,0.15)", alignSelf: "center", marginBottom: 18 },
    modalTitle: { fontSize: 22, fontWeight: "900", marginBottom: 14 },
    amountLabel: { fontSize: 13, fontWeight: "600", marginBottom: 8 },
    amountInput: { borderRadius: 16, padding: 18, fontSize: 32, fontWeight: "900", textAlign: "center", marginBottom: 14 },
    infoText: { fontSize: 14, marginBottom: 6 },
    savingRow: { flexDirection: "row", alignItems: "center", gap: 10, justifyContent: "center", padding: 14 },
    savingText: { fontSize: 14, fontWeight: "600" },
    modalBtns: { flexDirection: "row", gap: 12, marginTop: 10 },
    modalBtn: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, borderRadius: 16, paddingVertical: 16 },
    modalBtnText: { fontWeight: "800", fontSize: 15 },
});
