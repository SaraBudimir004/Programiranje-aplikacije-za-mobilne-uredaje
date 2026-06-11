import { Ionicons } from "@expo/vector-icons";
import {
    Modal,
    Pressable,
    StyleSheet,
    Text,
    TouchableWithoutFeedback,
    View,
} from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { CAT_ICONS, CATEGORIES } from "./CategorySection";

interface Props {
    visible: boolean;
    onClose: () => void;
    selectedCategory: string;
    onSelect: (cat: string) => void;
}

export function CategoryModal({ visible, onClose, selectedCategory, onSelect }: Props) {
    const { colors } = useTheme();

    return (
        <Modal visible={visible} transparent animationType="slide">
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={[styles.overlay, { backgroundColor: "rgba(0,0,0,0.55)" }]}>
                    <TouchableWithoutFeedback>
                        <View style={[styles.modal, { backgroundColor: (colors as any).cardStrong ?? colors.card }]}>
                            <View style={styles.modalHandle} />
                            <Text style={[styles.modalTitle, { color: colors.text }]}>Odaberi kategoriju</Text>
                            {CATEGORIES.map((cat) => (
                                <Pressable
                                    key={cat}
                                    onPress={() => { onSelect(cat); onClose(); }}
                                    style={[
                                        styles.catItem,
                                        cat === selectedCategory && {
                                            backgroundColor: (colors as any).accentLight ?? "rgba(96,165,250,0.15)",
                                        },
                                    ]}
                                >
                                    <Ionicons name={(CAT_ICONS[cat] ?? "receipt") as any} size={18} color={colors.accent} />
                                    <Text style={[styles.catText, { color: colors.text }]}>{cat}</Text>
                                    {cat === selectedCategory && (
                                        <Ionicons name="checkmark-circle" size={18} color={colors.accent} />
                                    )}
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
    overlay: { flex: 1, justifyContent: "flex-end" },
    modal: { borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 24, paddingBottom: 36 },
    modalHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: "rgba(0,0,0,0.15)", alignSelf: "center", marginBottom: 18 },
    modalTitle: { fontSize: 22, fontWeight: "900", marginBottom: 14 },
    catItem: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 14, paddingHorizontal: 12, borderRadius: 14, marginBottom: 4 },
    catText: { flex: 1, fontSize: 16, fontWeight: "600" },
});
