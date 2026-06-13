import { Ionicons } from "@expo/vector-icons";
import { Image, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { useTheme } from "../../context/ThemeContext";

interface Props {
    image: string | null;
    onPickCamera: () => void;
    onPickGallery: () => void;
    onPreviewPress: () => void;
}

export function ImagePickerCard({ image, onPickCamera, onPickGallery, onPreviewPress }: Props) {
    const { colors } = useTheme();

    return (
        <>
            {/* Prikaz slike */}
            <View style={[styles.imageCard, { backgroundColor: colors.card }]}>
                {image ? (
                    <Pressable onPress={onPreviewPress}>
                        <Image source={{ uri: image }} style={styles.receiptImage} resizeMode="contain" />
                        <Text style={[styles.tapHint, { color: colors.textSecondary }]}>
                            Tapni za pregled punog računa
                        </Text>
                    </Pressable>
                ) : (
                    <View style={styles.placeholder}>
                        <Ionicons name="receipt-outline" size={64} color={colors.textMuted} />
                        <Text style={[styles.placeholderText, { color: colors.textMuted }]}>
                            Fotografiraj ili učitaj račun
                        </Text>
                    </View>
                )}
            </View>

            {/* Gumbi */}
            <View style={styles.btnRow}>
                <Pressable
                    style={[
                        styles.actionBtn,
                        {
                            backgroundColor: Platform.OS === "web" ? colors.textMuted : colors.accent,
                            opacity: Platform.OS === "web" ? 0.6 : 1,
                        },
                    ]}
                    onPress={onPickCamera}
                >
                    <Ionicons name="camera" size={22} color="#fff" />
                    <Text style={styles.actionBtnText}>
                        {Platform.OS === "web" ? "Kamera " : "Kamera"}
                    </Text>
                </Pressable>
                <Pressable
                    style={[styles.actionBtn, { backgroundColor: colors.card }]}
                    onPress={onPickGallery}
                >
                    <Ionicons name="images" size={22} color={colors.text} />
                    <Text style={[styles.actionBtnText, { color: colors.text }]}>Učitaj sliku</Text>
                </Pressable>
            </View>

            {/* Web upozorenje */}
            {Platform.OS === "web" && (
                <View
                    style={[
                        styles.webNotice,
                        { backgroundColor: "rgba(251,191,36,0.12)", borderColor: "rgba(251,191,36,0.3)" },
                    ]}
                >
                    <Ionicons name="information-circle-outline" size={16} color="#FBBF24" />
                    <Text style={[styles.webNoticeText, { color: "#FBBF24" }]}>
                        Kamera nije dostupna u web verziji. Koristite "Učitaj sliku" za upload s računala.
                    </Text>
                </View>
            )}
        </>
    );
}

const styles = StyleSheet.create({
    imageCard: {
        borderRadius: 22,
        overflow: "hidden",
        marginBottom: 16,
        minHeight: 180,
        justifyContent: "center",
        alignItems: "center",
    },
    receiptImage: { width: "100%", height: 240 },
    tapHint: { textAlign: "center", fontSize: 12, paddingVertical: 6 },
    placeholder: { alignItems: "center", padding: 40, gap: 12 },
    placeholderText: { fontSize: 15, fontWeight: "600", textAlign: "center" },
    btnRow: { flexDirection: "row", gap: 12, marginBottom: 10 },
    actionBtn: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        borderRadius: 16,
        paddingVertical: 16,
    },
    actionBtnText: { color: "#fff", fontWeight: "800", fontSize: 15 },
    webNotice: {
        flexDirection: "row",
        alignItems: "flex-start",
        gap: 8,
        borderRadius: 12,
        padding: 12,
        marginBottom: 14,
        borderWidth: 1,
    },
    webNoticeText: { flex: 1, fontSize: 13, fontWeight: "500", lineHeight: 18 },
});
