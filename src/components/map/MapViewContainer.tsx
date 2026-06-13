import { Ionicons } from "@expo/vector-icons";
import { Ref } from "react";
import { ActivityIndicator, Platform, StyleSheet, Text, View } from "react-native";
import { WebView } from "react-native-webview";
import { generateMapHtml } from "./generateMapHtml";
import { LocationGroup } from "./types";

interface MapViewProps {
    colors: any;
    loading: boolean;
    filteredGroups: LocationGroup[];
    webRef: Ref<WebView>;
    onMessage: (event: any) => void;
    onLoad: () => void;
}

export default function MapViewContainer({
                                             colors,
                                             loading,
                                             filteredGroups,
                                             webRef,
                                             onMessage,
                                             onLoad,
                                         }: MapViewProps) {
    return (
        <View style={styles.mapContainer}>
            {loading ? (
                <View style={styles.centered}>
                    <ActivityIndicator size="large" color={colors.accent} />
                    <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
                        Učitavam lokacije...
                    </Text>
                </View>
            ) : filteredGroups.length === 0 ? (
                <View style={styles.centered}>
                    <Ionicons name="location-outline" size={64} color={colors.textMuted} />
                    <Text style={[styles.emptyText, { color: colors.textMuted }]}>
                        Nema lokacija s računima.{"\n"}Dodaj račune s lokacijom!
                    </Text>
                </View>
            ) : Platform.OS === "web" ? (
                <View style={styles.centered}>
                    <Ionicons name="map-outline" size={50} color={colors.textMuted} />
                    <Text style={{ color: colors.textMuted, marginTop: 10 }}>
                        Mapa nije dostupna na web verziji
                    </Text>
                </View>
            ) : (
                <WebView
                    ref={webRef}
                    source={{ html: generateMapHtml(filteredGroups) }}
                    style={styles.webView}
                    onMessage={onMessage}
                    onLoad={onLoad}
                    javaScriptEnabled
                    domStorageEnabled
                    originWhitelist={["*"]}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    mapContainer: { flex: 1 },
    webView: {
        flex: 1,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        overflow: "hidden",
    },
    centered: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 12,
    },
    loadingText: { fontSize: 15, fontWeight: "600" },
    emptyText: {
        fontSize: 16,
        fontWeight: "700",
        textAlign: "center",
        lineHeight: 26,
    },
});
