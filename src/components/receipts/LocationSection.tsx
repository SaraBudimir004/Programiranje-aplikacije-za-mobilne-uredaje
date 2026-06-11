import { Ionicons } from "@expo/vector-icons";
import {
    ActivityIndicator,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { useTheme } from "../../context/ThemeContext";
import type { LocationSuggestion } from "../../hooks/useLocationSearch";

interface Props {
    storeName: string;
    onStoreNameChange: (v: string) => void;
    locationQuery: string;
    onLocationQueryChange: (v: string) => void;
    locationLoading: boolean;
    locationSuggestions: LocationSuggestion[];
    showSuggestions: boolean;
    onSelectSuggestion: (s: LocationSuggestion) => void;
    onClearLocation: () => void;
    onGetGPS: () => void;
    currentLat: number | null;
    currentLng: number | null;
    setShowSuggestions: (v: boolean) => void;
}

export function LocationSection({
                                    storeName,
                                    onStoreNameChange,
                                    locationQuery,
                                    onLocationQueryChange,
                                    locationLoading,
                                    locationSuggestions,
                                    showSuggestions,
                                    onSelectSuggestion,
                                    onClearLocation,
                                    onGetGPS,
                                    currentLat,
                                    currentLng,
                                    setShowSuggestions,
                                }: Props) {
    const { colors } = useTheme();

    return (
        <View style={[styles.section, { backgroundColor: colors.card }]}>
            <View style={styles.sectionHeader}>
                <Ionicons name="location" size={20} color="#F472B6" />
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                    Lokacija kupovine
                </Text>
                <Text
                    style={[
                        styles.optionalBadge,
                        { backgroundColor: "rgba(244,114,182,0.12)", color: "#F472B6" },
                    ]}
                >
                    opcionalno
                </Text>
            </View>

            <TextInput
                placeholder="Naziv trgovine (npr. Lidl, Konzum)"
                placeholderTextColor={colors.textMuted}
                value={storeName}
                onChangeText={onStoreNameChange}
                style={[styles.input, { backgroundColor: colors.input, color: colors.text }]}
            />

            {/* Search input */}
            <View style={[styles.locationSearchContainer]}>
                <View style={[styles.locationInputRow, { backgroundColor: colors.input }]}>
                    <Ionicons name="search" size={16} color={colors.textMuted} style={{ marginLeft: 12 }} />
                    <TextInput
                        placeholder="Pretraži lokaciju..."
                        placeholderTextColor={colors.textMuted}
                        value={locationQuery}
                        onChangeText={onLocationQueryChange}
                        onFocus={() => locationSuggestions.length > 0 && setShowSuggestions(true)}
                        style={[styles.locationInput, { color: colors.text }]}
                        returnKeyType="search"
                    />
                    {locationLoading && (
                        <ActivityIndicator size="small" color={colors.accent} style={{ marginRight: 10 }} />
                    )}
                    {locationQuery.length > 0 && !locationLoading && (
                        <Pressable onPress={onClearLocation}>
                            <Ionicons name="close-circle" size={18} color={colors.textMuted} style={{ marginRight: 10 }} />
                        </Pressable>
                    )}
                </View>

                {showSuggestions && locationSuggestions.length > 0 && (
                    <View
                        style={[
                            styles.suggestionsBox,
                            {
                                backgroundColor: (colors as any).cardStrong ?? colors.card,
                                borderColor: (colors as any).border ?? "rgba(255,255,255,0.1)",
                            },
                        ]}
                    >
                        {locationSuggestions.map((item, idx) => (
                            <Pressable
                                key={item.place_id}
                                onPress={() => onSelectSuggestion(item)}
                                style={[
                                    styles.suggestionItem,
                                    idx < locationSuggestions.length - 1 && {
                                        borderBottomWidth: 1,
                                        borderBottomColor: (colors as any).border ?? "rgba(255,255,255,0.06)",
                                    },
                                ]}
                            >
                                <Ionicons name="location-outline" size={14} color="#F472B6" style={{ marginTop: 2 }} />
                                <Text style={[styles.suggestionText, { color: colors.text }]} numberOfLines={2}>
                                    {item.display_name}
                                </Text>
                            </Pressable>
                        ))}
                    </View>
                )}
            </View>

            {/* GPS gumb */}
            <Pressable
                style={[styles.gpsBtn, { backgroundColor: colors.input }]}
                onPress={onGetGPS}
                disabled={locationLoading}
            >
                {locationLoading ? (
                    <ActivityIndicator size="small" color="#F472B6" />
                ) : (
                    <Ionicons name="navigate" size={18} color="#F472B6" />
                )}
                <Text style={[styles.gpsBtnText, { color: colors.text }]}>
                    {locationLoading ? "Dohvaćam GPS..." : "Koristi moju GPS lokaciju"}
                </Text>
                {currentLat && <Ionicons name="checkmark-circle" size={16} color="#22c55e" />}
            </Pressable>

            {currentLat && (
                <View style={[styles.coordsPill, { backgroundColor: "rgba(34,197,94,0.1)" }]}>
                    <Ionicons name="checkmark-circle" size={14} color="#22c55e" />
                    <Text style={[styles.coordsText, { color: "#22c55e" }]}>
                        Lokacija postavljena: {currentLat.toFixed(4)}, {currentLng?.toFixed(4)}
                    </Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    section: { borderRadius: 22, padding: 18, marginBottom: 14 },
    sectionHeader: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 14 },
    sectionTitle: { fontSize: 17, fontWeight: "800", flex: 1 },
    optionalBadge: { fontSize: 11, fontWeight: "700", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
    input: { borderRadius: 14, padding: 14, fontSize: 15, marginBottom: 10 },
    locationSearchContainer: { position: "relative", zIndex: 10, marginBottom: 10 },
    locationInputRow: { flexDirection: "row", alignItems: "center", borderRadius: 14, gap: 6 },
    locationInput: { flex: 1, padding: 14, fontSize: 15 },
    suggestionsBox: {
        position: "absolute",
        top: "100%",
        left: 0,
        right: 0,
        borderRadius: 14,
        borderWidth: 1,
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 10,
        zIndex: 100,
        overflow: "hidden",
    },
    suggestionItem: { flexDirection: "row", alignItems: "flex-start", gap: 10, paddingVertical: 12, paddingHorizontal: 14 },
    suggestionText: { flex: 1, fontSize: 13, fontWeight: "500", lineHeight: 18 },
    gpsBtn: { flexDirection: "row", alignItems: "center", gap: 8, borderRadius: 14, padding: 14, marginTop: 4 },
    gpsBtnText: { flex: 1, fontWeight: "600", fontSize: 14 },
    coordsPill: { flexDirection: "row", alignItems: "center", gap: 6, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8, marginTop: 8 },
    coordsText: { fontSize: 12, fontWeight: "600" },
});
