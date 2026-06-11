import { useRef, useState } from "react";
import { Alert, Platform } from "react-native";
import { addExpenseWithReceipt } from "../services/firestore";
import { uploadReceiptImage } from "../services/storageService";

export function useReceiptForm() {
    const [image, setImage] = useState<string | null>(null);
    const [manualAmount, setManualAmount] = useState("");
    const [category, setCategory] = useState("Računi");
    const [storeName, setStoreName] = useState("");
    const [saving, setSaving] = useState(false);
    const [confirmModal, setConfirmModal] = useState(false);
    const [catModal, setCatModal] = useState(false);
    const [success, setSuccess] = useState(false);
    const [uploadProgress, setUploadProgress] = useState("");
    const [showReceiptModal, setShowReceiptModal] = useState(false);

    const fileInputRef = useRef<any>(null);

    const handleWebFileChange = (e: any) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            const uri = ev.target?.result as string;
            setImage(uri);
            setConfirmModal(true);
        };
        reader.readAsDataURL(file);
        e.target.value = "";
    };

    const pickFromGallery = async () => {
        if (Platform.OS === "web") {
            fileInputRef.current?.click();
            return;
        }
        try {
            const ImagePicker = await import("expo-image-picker");
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== "granted") {
                Alert.alert("Dozvola potrebna", "Treba nam pristup galeriji");
                return;
            }
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ["images"],
                quality: 0.85,
            });
            if (!result.canceled && result.assets[0]) {
                setImage(result.assets[0].uri);
                setConfirmModal(true);
            }
        } catch {
            Alert.alert("Greška", "Nije moguće otvoriti galeriju.");
        }
    };

    const pickFromCamera = async () => {
        if (Platform.OS === "web") {
            Alert.alert("Kamera nije dostupna", "Kamera ne radi u web verziji. Molimo učitaj sliku iz galerije.");
            return;
        }
        try {
            const ImagePicker = await import("expo-image-picker");
            const { status } = await ImagePicker.requestCameraPermissionsAsync();
            if (status !== "granted") {
                Alert.alert("Dozvola potrebna", "Treba nam pristup kameri");
                return;
            }
            const result = await ImagePicker.launchCameraAsync({ quality: 0.85 });
            if (!result.canceled && result.assets[0]) {
                setImage(result.assets[0].uri);
                setConfirmModal(true);
            }
        } catch {
            Alert.alert("Greška", "Nije moguće otvoriti kameru.");
        }
    };

    const handleSaveReceipt = async (params: {
        address?: string;
        currentLat?: number | null;
        currentLng?: number | null;
        onSuccess: () => void;
    }) => {
        const amount = Number(manualAmount);
        if (!amount || amount <= 0) {
            Alert.alert("Greška", "Unesite ispravan iznos prije spremanja");
            return;
        }
        setSaving(true);
        try {
            let receiptImageUrl: string | undefined;
            if (image) {
                setUploadProgress("Upload slike na Supabase Storage...");
                receiptImageUrl = await uploadReceiptImage(image);
            }
            setUploadProgress("Sprema se trošak u Firestore...");
            await addExpenseWithReceipt({
                amount,
                category,
                receiptImageUrl,
                storeName: storeName || undefined,
                address: params.address || undefined,
                latitude: params.currentLat ?? undefined,
                longitude: params.currentLng ?? undefined,
            });
            setUploadProgress("");
            setSaving(false);
            setConfirmModal(false);
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3500);
            setImage(null);
            setManualAmount("");
            setStoreName("");
            params.onSuccess();
        } catch (e: any) {
            setUploadProgress("");
            setSaving(false);
            Alert.alert("Greška", e.message ?? "Greška pri spremanju");
        }
    };

    return {
        // state
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
        // setters
        setImage,
        setManualAmount,
        setCategory,
        setStoreName,
        setConfirmModal,
        setCatModal,
        setShowReceiptModal,
        // handlers
        handleWebFileChange,
        pickFromGallery,
        pickFromCamera,
        handleSaveReceipt,
    };
}