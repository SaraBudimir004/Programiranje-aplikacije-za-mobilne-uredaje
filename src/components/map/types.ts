export interface Receipt {
    id: string;
    amount: number;
    category: string;
    storeName?: string;
    address?: string;
    latitude?: number;
    longitude?: number;
    receiptImageUrl?: string;
    purchaseDate?: string;
    purchaseTime?: string;
    date?: any;
}

export interface LocationGroup {
    key: string;
    storeName: string;
    address: string;
    latitude: number;
    longitude: number;
    receipts: Receipt[];
    totalAmount: number;
    color: string;
}

export const CATEGORIES = [
    "Sve",
    "Hrana",
    "Prijevoz",
    "Šoping",
    "Zabava",
    "Računi",
    "Ostalo",
];

export const colorLabel = (color: string) => {
    if (color === "green") return { label: "Česta kupovina", bg: "#22c55e" };
    if (color === "yellow") return { label: "Povremena kupovina", bg: "#FBBF24" };
    return { label: "Rijetka kupovina", bg: "#ef4444" };
};
