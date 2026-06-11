import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import ScreenBackground from "../../components/ScreenBackground";
import { useTheme } from "../../context/ThemeContext";
import { CategoryModal } from "../../components/receipts/CategoryModal";
import { CategorySection } from "../../components/receipts/CategorySection";
import { ImagePickerCard } from "../../components/receipts/ImagePickerCard";
import { LocationSection } from "../../components/receipts/LocationSection";
import { ReceiptPreviewModal } from "../../components/receipts/ReceiptPreviewModal";
import { SaveReceiptModal } from "../../components/receipts/SaveReceiptModal";
import { useLocationSearch } from "../../hooks/useLocationSearch";
import { useReceiptForm } from "../../hooks/useReceiptForm";

export default function ReceiptsScreen() {
    const { colors } = useTheme();
    const router = useRouter();

    const {
        image,
        manualAmount,
        category,
        storeName,
        saving,
        confirmModal,
        catModal,
        success,
        uploadProgress,
        showReceiptModal,
        fileInputRef,
        setManualAmount,
        setCategory,
        setStoreName,
        setConfirmModal,
        setCatModal,
        setShowReceiptModal,
        handleWebFileChange,
        pickFromGallery,
        pickFromCamera,
        handleSaveReceipt,
    } = useReceiptForm();

    const {
        locationQuery,
        locationSuggestions,
        locationLoading,
        showSuggestions,
        address,
        currentLat,
        currentLng,
        handleLocationQueryChange,
        handleSelectLocation,
        getCurrentLocation,
        clearLocation,
        resetLocation,
        setShowSuggestions,
    } = useLocationSearch();

    return (
        <ScreenBackground>
            {/* Skriveni file input za web */}
            {Platform.OS === "web" && (
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handleWebFileChange}
                />
            )}

            <ScrollView
                contentContainerStyle={styles.container}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                {/* Header */}
                <View style={styles.header}>
                    <Pressable onPress={() => router.back()} style={styles.backBtn}>
                        <Ionicons name="arrow-back" size={22} color={colors.text} />
                    </Pressable>
                    <Text style={[styles.title, { color: colors.text }]}>Dodaj račun</Text>
                </View>

                {success && (
                    <View style={styles.successBanner}>
                        <Ionicons name="checkmark-circle" size={22} color="#fff" />
                        <Text style={styles.successText}>Račun uspješno spremljen! ✓</Text>
                    </View>
                )}

                <ImagePickerCard
                    image={image}
                    onPickCamera={pickFromCamera}
                    onPickGallery={pickFromGallery}
                    onPreviewPress={() => setShowReceiptModal(true)}
                />

                <LocationSection
                    storeName={storeName}
                    onStoreNameChange={setStoreName}
                    locationQuery={locationQuery}
                    onLocationQueryChange={handleLocationQueryChange}
                    locationLoading={locationLoading}
                    locationSuggestions={locationSuggestions}
                    showSuggestions={showSuggestions}
                    onSelectSuggestion={(s) => handleSelectLocation(s, storeName, setStoreName)}
                    onClearLocation={clearLocation}
                    onGetGPS={() => getCurrentLocation(storeName, setStoreName)}
                    currentLat={currentLat}
                    currentLng={currentLng}
                    setShowSuggestions={setShowSuggestions}
                />

                <CategorySection
                    category={category}
                    onOpen={() => setCatModal(true)}
                />

                {image && (
                    <Pressable
                        style={[styles.confirmBtn, { backgroundColor: (colors as any).success ?? "#22c55e" }]}
                        onPress={() => setConfirmModal(true)}
                    >
                        <Ionicons name="checkmark-circle" size={22} color="#fff" />
                        <Text style={styles.confirmBtnText}>Unesi iznos i spremi račun</Text>
                    </Pressable>
                )}
            </ScrollView>

            <SaveReceiptModal
                visible={confirmModal}
                onClose={() => setConfirmModal(false)}
                manualAmount={manualAmount}
                onAmountChange={setManualAmount}
                storeName={storeName}
                address={address}
                category={category}
                saving={saving}
                uploadProgress={uploadProgress}
                onSave={() =>
                    handleSaveReceipt({
                        address,
                        currentLat,
                        currentLng,
                        onSuccess: resetLocation,
                    })
                }
            />

            <ReceiptPreviewModal
                visible={showReceiptModal}
                imageUri={image}
                onClose={() => setShowReceiptModal(false)}
            />

            <CategoryModal
                visible={catModal}
                onClose={() => setCatModal(false)}
                selectedCategory={category}
                onSelect={setCategory}
            />
        </ScreenBackground>
    );
}

const styles = StyleSheet.create({
    container: { padding: 20, paddingTop: 60, paddingBottom: 120 },
    header: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 22 },
    backBtn: {
        width: 40,
        height: 40,
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(255,255,255,0.08)",
    },
    title: { fontSize: 24, fontWeight: "900" },
    successBanner: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        backgroundColor: "#22c55e",
        borderRadius: 16,
        padding: 14,
        marginBottom: 16,
    },
    successText: { color: "#fff", fontWeight: "800", fontSize: 15 },
    confirmBtn: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        borderRadius: 18,
        paddingVertical: 18,
        marginTop: 6,
    },
    confirmBtnText: { color: "#fff", fontWeight: "900", fontSize: 16 },
});
