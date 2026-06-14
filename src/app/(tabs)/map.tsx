import { useFocusEffect } from "expo-router";
import { useCallback, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import { WebView } from "react-native-webview";
import ScreenBackground from "../../components/ScreenBackground";
import DetailModal from "../../components/map/DetailModal";
import FilterModal from "../../components/map/FilterModal";
import MapHeader from "../../components/map/MapHeader";
import MapLegend from "../../components/map/MapLegend";
import MapViewContainer from "../../components/map/MapViewContainer";
import ReceiptImageModal from "../../components/map/ReceiptImageModal";
import StatsBar from "../../components/map/StatsBar";
import { LocationGroup, Receipt } from "../../components/map/types";
import { useTheme } from "../../context/ThemeContext";
import { fetchReceiptsWithLocation } from "../../services/firestore";

export default function MapScreen() {
    const { colors } = useTheme();
    const webRef = useRef<WebView>(null);

    const [receipts, setReceipts] = useState<Receipt[]>([]);
    const [groups, setGroups] = useState<LocationGroup[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedGroup, setSelectedGroup] = useState<LocationGroup | null>(null);
    const [detailModal, setDetailModal] = useState(false);
    const [receiptImageModal, setReceiptImageModal] = useState<string | null>(null);
    const [filterCat, setFilterCat] = useState("Sve");
    const [filterAmount, setFilterAmount] = useState("");
    const [filterVisible, setFilterVisible] = useState(false);
    const [mapReady, setMapReady] = useState(false);

    useFocusEffect(
        useCallback(() => {
            loadData();
        }, []),
    );

    const loadData = async () => {
        setLoading(true);
        try {
            const data = (await fetchReceiptsWithLocation()) as Receipt[];
            setReceipts(data);
            const g = buildGroups(data);
            setGroups(g);
        } catch (e) {
            console.error(e);
        }
        setLoading(false);
    };

    const buildGroups = (data: Receipt[]): LocationGroup[] => {
        const map: Record<string, LocationGroup> = {};
        for (const r of data) {
            if (!r.latitude || !r.longitude) continue;
            // Grupiramo po lat+lng zaokruženima na 4 decimale (isti objekt ~11m)
            const key = `${r.latitude.toFixed(4)}_${r.longitude.toFixed(4)}`;
            if (!map[key]) {
                map[key] = {
                    key,
                    storeName: r.storeName ?? "Nepoznata lokacija",
                    address: r.address ?? "",
                    latitude: r.latitude,
                    longitude: r.longitude,
                    receipts: [],
                    totalAmount: 0,
                    color: "red",
                };
            }
            map[key].receipts.push(r);
            map[key].totalAmount += r.amount;
        }
        const arr = Object.values(map);
        if (arr.length === 0) return arr;

        // Određivanje boja markera prema učestalosti
        const counts = arr.map((g) => g.receipts.length).sort((a, b) => a - b);
        const maxCount = counts[counts.length - 1];
        const minCount = counts[0];
        const mid = (maxCount + minCount) / 2;

        for (const g of arr) {
            const c = g.receipts.length;
            if (c >= mid * 1.4) g.color = "green";
            else if (c >= mid * 0.7) g.color = "yellow";
            else g.color = "red";
        }
        return arr;
    };

    // Filtrirani groups
    const filteredGroups = groups.filter((g) => {
        const catOk =
            filterCat === "Sve" || g.receipts.some((r) => r.category === filterCat);
        const amtOk = !filterAmount || g.totalAmount >= Number(filterAmount);
        return catOk && amtOk;
    });

    const handleWebViewMessage = (event: any) => {
        try {
            const data = JSON.parse(event.nativeEvent.data);
            const g = groups.find((x) => x.key === data.key);
            if (g) {
                setSelectedGroup(g);
                setDetailModal(true);
            }
        } catch (_) {}
    };

    return (
        <ScreenBackground>
            <View style={styles.flex}>
                <MapHeader colors={colors} onFilterPress={() => setFilterVisible(true)} />

                <StatsBar
                    colors={colors}
                    loading={loading}
                    groups={groups}
                    receipts={receipts}
                />

                <MapViewContainer
                    colors={colors}
                    loading={loading}
                    filteredGroups={filteredGroups}
                    webRef={webRef}
                    onMessage={handleWebViewMessage}
                    onLoad={() => setMapReady(true)}
                />

                <MapLegend
                    colors={colors}
                    filterCat={filterCat}
                    onClearFilter={() => setFilterCat("Sve")}
                />
            </View>

            <DetailModal
                colors={colors}
                visible={detailModal}
                selectedGroup={selectedGroup}
                onClose={() => setDetailModal(false)}
                onReceiptImagePress={(url) => setReceiptImageModal(url)}
            />

            <ReceiptImageModal
                imageUrl={receiptImageModal}
                onClose={() => setReceiptImageModal(null)}
            />

            <FilterModal
                colors={colors}
                visible={filterVisible}
                onClose={() => setFilterVisible(false)}
                filterCat={filterCat}
                setFilterCat={setFilterCat}
                filterAmount={filterAmount}
                setFilterAmount={setFilterAmount}
            />
        </ScreenBackground>
    );
}

const styles = StyleSheet.create({
    flex: { flex: 1 },
});
