import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Theme = "light" | "dark";

interface ThemeContextType {
    theme: Theme;
    isDark: boolean;
    toggleTheme: () => void;
    colors: typeof lightColors;
}

export const lightColors = {
    background: "transparent",
    card: "rgba(255,255,255,0.75)",
    cardStrong: "rgba(255,255,255,0.92)",
    text: "#0f172a",
    textSecondary: "#475569",
    textMuted: "#94a3b8",
    border: "rgba(255,255,255,0.4)",
    accent: "#2563eb",
    accentLight: "rgba(37,99,235,0.12)",
    success: "#10b981",
    danger: "#ef4444",
    warning: "#f59e0b",
    purple: "#7c3aed",
    tabBar: "rgba(78,146,225,0.65)",
    input: "rgba(255,255,255,0.9)",
    shadow: "#000",
    overlay: "rgba(0,0,0,0.4)",
    incomeGreen: "#10b981",
    expenseRed: "#ef4444",
};

export const darkColors = {
    background: "transparent",
    card: "rgba(15,23,42,0.82)",
    cardStrong: "rgba(15,23,42,0.95)",
    text: "#f1f5f9",
    textSecondary: "#94a3b8",
    textMuted: "#64748b",
    border: "rgba(255,255,255,0.1)",
    accent: "#3b82f6",
    accentLight: "rgba(59,130,246,0.18)",
    success: "#10b981",
    danger: "#ef4444",
    warning: "#f59e0b",
    purple: "#a78bfa",
    tabBar: "rgba(15,23,42,0.88)",
    input: "rgba(30,41,59,0.9)",
    shadow: "#000",
    overlay: "rgba(0,0,0,0.6)",
    incomeGreen: "#34d399",
    expenseRed: "#f87171",
};

const ThemeContext = createContext<ThemeContextType>({
    theme: "light",
    isDark: false,
    toggleTheme: () => {},
    colors: lightColors,
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const [theme, setTheme] = useState<Theme>("light");

    useEffect(() => {
        AsyncStorage.getItem("appTheme").then((saved) => {
            if (saved === "dark" || saved === "light") setTheme(saved);
        });
    }, []);

    const toggleTheme = async () => {
        const next = theme === "light" ? "dark" : "light";
        setTheme(next);
        await AsyncStorage.setItem("appTheme", next);
    };

    const isDark = theme === "dark";
    const colors = isDark ? darkColors : lightColors;

    return (
        <ThemeContext.Provider value={{ theme, isDark, toggleTheme, colors }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
