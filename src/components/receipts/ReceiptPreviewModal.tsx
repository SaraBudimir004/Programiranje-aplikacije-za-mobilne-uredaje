import { Ionicons } from "@expo/vector-icons";
import { Image, Modal, Pressable, StyleSheet } from "react-native";

interface Props {
    visible: boolean;
    imageUri: string | null;
    onClose: () => void;
}

export function ReceiptPreviewModal({ visible, imageUri, onClose }: Props) {
    return (
        <Modal visible={visible} transparent animationType="fade">
            <Pressable style={styles.overlay} onPress={onClose}>
                <Image source={{ uri: imageUri ?? "" }} style={styles.fullImage} resizeMode="contain" />
                <Pressable style={styles.closeBtn} onPress={onClose}>
                    <Ionicons name="close-circle" size={36} color="#fff" />
                </Pressable>
            </Pressable>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.92)",
        justifyContent: "center",
        alignItems: "center",
    },
    fullImage: { width: "95%", height: "80%" },
    closeBtn: { position: "absolute", top: 50, right: 20 },
});
