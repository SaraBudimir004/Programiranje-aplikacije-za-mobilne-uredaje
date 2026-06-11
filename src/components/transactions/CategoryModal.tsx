import { Modal, View, Text, Pressable, TouchableWithoutFeedback, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../context/ThemeContext";

type Props = {
    visible: boolean;
    onClose: () => void;
    title: string;
    items: string[];
    icons: Record<string, string>;
    selected: string;
    onSelect: (item: string) => void;
    accentColor: string;
    accentLightColor: string;
};

export default function CategoryModal({ visible, onClose, title, items, icons, selected, onSelect, accentColor, accentLightColor }: Props) {
    const { colors } = useTheme();

    return (
        <Modal visible={visible} transparent animationType="slide">
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={[styles.modalOverlay, { backgroundColor: colors.overlay }]}>
                    <TouchableWithoutFeedback>
                        <View style={[styles.modal, { backgroundColor: colors.cardStrong }]}>
                            <View style={styles.modalHandle} />
                            <Text style={[styles.modalTitle, { color: colors.text }]}>{title}</Text>
                            {items.map((item) => (
                                <Pressable
                                    key={item}
                                    onPress={() => { onSelect(item); onClose(); }}
                                    style={[styles.modalItem, selected === item && { backgroundColor: accentLightColor }]}
                                >
                                    <View style={[styles.modalItemIcon, { backgroundColor: accentLightColor }]}>
                                        <Ionicons name={(icons[item] || "ellipse") as any} size={16} color={accentColor} />
                                    </View>
                                    <Text style={[styles.modalText, { color: colors.text }]}>{item}</Text>
                                    {selected === item && <Ionicons name="checkmark-circle" size={18} color={accentColor} />}
                                </Pressable>
                            ))}
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalOverlay: { flex: 1, justifyContent: "flex-end" },
    modal: { borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 20, paddingBottom: 34 },
    modalHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: "rgba(0,0,0,0.15)", alignSelf: "center", marginBottom: 16 },
    modalTitle: { fontSize: 18, fontWeight: "800", marginBottom: 12 },
    modalItem: { flexDirection: "row", alignItems: "center", paddingVertical: 14, paddingHorizontal: 12, borderRadius: 14, marginBottom: 4, gap: 12 },
    modalItemIcon: { width: 34, height: 34, borderRadius: 10, justifyContent: "center", alignItems: "center" },
    modalText: { flex: 1, fontSize: 16, fontWeight: "600" },
});
