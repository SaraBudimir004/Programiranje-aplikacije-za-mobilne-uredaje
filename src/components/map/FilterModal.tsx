import {
    Modal, Pressable, ScrollView, StyleSheet, Text, TextInput,
    TouchableWithoutFeedback, View,
} from "react-native";
import { CATEGORIES } from "./types";

interface FilterModalProps {
    colors: any;
    visible: boolean;
    onClose: () => void;
    filterCat: string;
    setFilterCat: (cat: string) => void;
    filterAmount: string;
    setFilterAmount: (amount: string) => void;
}

export default function FilterModal({
                                        colors,
                                        visible,
                                        onClose,
                                        filterCat,
                                        setFilterCat,
                                        filterAmount,
                                        setFilterAmount,
                                    }: FilterModalProps) {
    return (
        <Modal visible={visible} transparent animationType="slide">
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={[styles.overlay, { backgroundColor: "rgba(0,0,0,0.6)" }]}>
                    <TouchableWithoutFeedback>
                        <View
                            style={[
                                styles.filterModal,
                                { backgroundColor: colors.cardStrong ?? colors.card },
                            ]}
                        >
                            <View style={styles.modalHandle} />
                            <Text style={[styles.filterTitle, { color: colors.text }]}>
                                Filtriraj kartu
                            </Text>

                            <Text style={[styles.filterLabel, { color: colors.textSecondary }]}>
                                Kategorija
                            </Text>
                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                style={{ marginBottom: 16 }}
                            >
                                {CATEGORIES.map((cat) => (
                                    <Pressable
                                        key={cat}
                                        onPress={() => setFilterCat(cat)}
                                        style={[
                                            styles.catChip,
                                            {
                                                backgroundColor:
                                                    filterCat === cat ? colors.accent : colors.input,
                                            },
                                        ]}
                                    >
                                        <Text
                                            style={{
                                                color: filterCat === cat ? "#fff" : colors.text,
                                                fontWeight: "700",
                                                fontSize: 13,
                                            }}
                                        >
                                            {cat}
                                        </Text>
                                    </Pressable>
                                ))}
                            </ScrollView>

                            <Text style={[styles.filterLabel, { color: colors.textSecondary }]}>
                                Min. ukupni iznos (€)
                            </Text>
                            <TextInput
                                placeholder="npr. 50"
                                placeholderTextColor={colors.textMuted}
                                keyboardType="numeric"
                                value={filterAmount}
                                onChangeText={setFilterAmount}
                                style={[
                                    styles.filterInput,
                                    { backgroundColor: colors.input, color: colors.text },
                                ]}
                            />

                            <View style={styles.filterBtns}>
                                <Pressable
                                    style={[styles.filterActionBtn, { backgroundColor: colors.input }]}
                                    onPress={() => {
                                        setFilterCat("Sve");
                                        setFilterAmount("");
                                    }}
                                >
                                    <Text style={[{ color: colors.text, fontWeight: "700" }]}>
                                        Resetiraj
                                    </Text>
                                </Pressable>
                                <Pressable
                                    style={[styles.filterActionBtn, { backgroundColor: colors.accent }]}
                                    onPress={onClose}
                                >
                                    <Text style={{ color: "#fff", fontWeight: "700" }}>Primijeni</Text>
                                </Pressable>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: { flex: 1, justifyContent: "flex-end" },
    filterModal: {
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: 22,
        paddingBottom: 34,
    },
    modalHandle: {
        width: 40,
        height: 4,
        borderRadius: 2,
        backgroundColor: "rgba(0,0,0,0.15)",
        alignSelf: "center",
        marginBottom: 14,
    },
    filterTitle: { fontSize: 20, fontWeight: "900", marginBottom: 16 },
    filterLabel: { fontSize: 13, fontWeight: "700", marginBottom: 8 },
    catChip: {
        borderRadius: 12,
        paddingVertical: 8,
        paddingHorizontal: 14,
        marginRight: 8,
    },
    filterInput: {
        borderRadius: 14,
        padding: 14,
        fontSize: 15,
        marginBottom: 16,
    },
    filterBtns: { flexDirection: "row", gap: 12 },
    filterActionBtn: {
        flex: 1,
        borderRadius: 14,
        padding: 15,
        alignItems: "center",
    },
});
