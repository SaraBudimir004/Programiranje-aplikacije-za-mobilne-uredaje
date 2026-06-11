import { Platform } from "react-native";
import { auth } from "../../firebaseConfig";
import { supabase } from "../../supabase";

export const uploadReceiptImage = async (localUri: string): Promise<string> => {
    const user = auth.currentUser;
    if (!user) throw new Error("Korisnik nije prijavljen");

    const timestamp = Date.now();
    const filename = `receipts/${user.uid}/${timestamp}.jpg`;

    let bytes: Uint8Array;

    if (Platform.OS === "web") {
        // Na webu localUri je već data:image/...;base64,XXX
        const base64 = localUri.split(",")[1];
        const binaryString = globalThis.atob(base64);
        bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
    } else {
        // Na mobitelu koristimo expo-file-system
        const FileSystem = await import("expo-file-system/legacy");
        const base64 = await FileSystem.readAsStringAsync(localUri, {
            encoding: "base64" as any,
        });
        const binaryString = globalThis.atob(base64);
        bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
    }

    const { error } = await supabase.storage
        .from("receipts")
        .upload(filename, bytes, {
            contentType: "image/jpeg",
            upsert: false,
        });

    if (error) {
        console.error("Supabase upload error:", error);
        throw new Error(`Upload slike nije uspio: ${error.message}`);
    }

    const { data: urlData } = supabase.storage
        .from("receipts")
        .getPublicUrl(filename);

    if (!urlData?.publicUrl) throw new Error("Nije moguće dohvatiti URL slike");

    return urlData.publicUrl;
};
