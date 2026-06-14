import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface HomeHeaderProps {
    name: string;
    colors: any;
    onProfilePress: () => void;
    onLogoutPress: () => void;
}

export default function HomeHeader({
                                       name,
                                       colors,
                                       onProfilePress,
                                       onLogoutPress,
                                   }: HomeHeaderProps) {
    return (
        <View style={styles.header}>
            <View>
                <Text style={[styles.name, { color: colors.textHeading }]}>{name}</Text>
            </View>
            <View style={styles.headerActions}>
                <Pressable
                    style={[styles.iconBtn, { backgroundColor: colors.card }]}
                    onPress={onProfilePress}
                >
                    <Ionicons name="person-outline" size={20} color={colors.accent} />
                </Pressable>
                <Pressable
                    style={[styles.iconBtn, { backgroundColor: colors.card }]}
                    onPress={onLogoutPress}
                >
                    <Ionicons name="log-out-outline" size={20} color={colors.danger} />
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    headerActions: { flexDirection: "row", gap: 10 },
    iconBtn: {
        width: 44,
        height: 44,
        borderRadius: 14,
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },
    name: { fontSize: 26, fontWeight: "800", marginTop: 2 },
});
