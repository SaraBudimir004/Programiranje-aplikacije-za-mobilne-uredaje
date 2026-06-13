import { Ionicons } from "@expo/vector-icons";
import { Image, Modal, Pressable, StyleSheet } from "react-native";

interface ReceiptImageModalProps {
    imageUrl: string | null;
    onClose: () => void;
}

export default function ReceiptImageModal({
                                              imageUrl,
                                              onClose,
                                          }: ReceiptImageModalProps) {
    return (
        <Modal visible={!!imageUrl} transparent animationType="fade">
            <Pressable style={styles.imgOverlay} onPress={onClose}>
                {imageUrl && (
                    <Image source={{ uri: imageUrl }} style={styles.fullImg} resizeMode="contain" />
                )}
                <Pressable style={styles.imgCloseBtn} onPress={onClose}>
                    <Ionicons name="close-circle" size={36} color="#fff" />
                </Pressable>
            </Pressable>
        </Modal>
    );
}

const styles = StyleSheet.create({
    imgOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.92)",
        justifyContent: "center",
        alignItems: "center",
    },
    fullImg: { width: "95%", height: "80%" },
    imgCloseBtn: { position: "absolute", top: 50, right: 20 },
});
