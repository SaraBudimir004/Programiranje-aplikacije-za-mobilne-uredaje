import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { View, StyleSheet, Platform } from "react-native";

export default function TabsLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: false,

                tabBarStyle: {
                    position: "absolute",
                    left: 16,
                    right: 16,
                    bottom: 18,
                    height: 70,

                    backgroundColor: "rgba(78,146,225,0.61)",
                    borderRadius: 26,

                    borderTopWidth: 0,

                    paddingBottom: Platform.OS === "ios" ? 18 : 10,
                    paddingTop: 10,

                    shadowColor: "#000",
                    shadowOpacity: 0.3,
                    shadowRadius: 20,
                    shadowOffset: { width: 0, height: 10 },
                    elevation: 12,
                },

                tabBarActiveTintColor: "#ffffff",
                tabBarInactiveTintColor: "rgb(255,255,255)",
            }}
        >
            {/* HOME */}
            <Tabs.Screen
                name="home"
                options={{
                    tabBarIcon: ({ focused, color }) => (
                        <View style={[styles.iconWrap, focused && styles.active]}>
                            <Ionicons
                                name={focused ? "home" : "home-outline"}
                                size={22}
                                color={focused ? "#60A5FA" : color}
                            />
                        </View>
                    ),
                }}
            />

            {/* TRANSAKACIJE */}
            <Tabs.Screen
                name="transaction"
                options={{
                    tabBarIcon: ({ focused, color }) => (
                        <View style={[styles.iconWrap, focused && styles.active]}>
                            <Ionicons
                                name={focused ? "swap-horizontal" : "swap-horizontal-outline"}
                                size={22}
                                color={focused ? "#34D399" : color}
                            />
                        </View>
                    ),
                }}
            />

            {/* ANALIZA */}
            <Tabs.Screen
                name="analytics"
                options={{
                    tabBarIcon: ({ focused, color }) => (
                        <View style={[styles.iconWrap, focused && styles.active]}>
                            <Ionicons
                                name={focused ? "bar-chart" : "bar-chart-outline"}
                                size={22}
                                color={focused ? "#A78BFA" : color}
                            />
                        </View>
                    ),
                }}
            />

            {/* PROFIL */}
            <Tabs.Screen
                name="profile"
                options={{
                    tabBarIcon: ({ focused, color }) => (
                        <View style={[styles.iconWrap, focused && styles.active]}>
                            <Ionicons
                                name={focused ? "person-circle" : "person-circle-outline"}
                                size={22}
                                color={focused ? "#F472B6" : color}
                            />
                        </View>
                    ),
                }}
            />
        </Tabs>
    );
}

const styles = StyleSheet.create({
    iconWrap: {
        width: 44,
        height: 44,
        borderRadius: 14,
        justifyContent: "center",
        alignItems: "center",
    },

    active: {
        backgroundColor: "rgb(216,212,212)",
        shadowColor: "#60A5FA",
        shadowOpacity: 0.25,
        shadowRadius: 12,
        elevation: 5,
        transform: [{ scale: 1.05 }],
    },
});