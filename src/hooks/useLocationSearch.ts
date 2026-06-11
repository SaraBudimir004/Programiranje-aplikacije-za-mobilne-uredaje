import { useRef, useState } from "react";
import { Alert } from "react-native";

export interface LocationSuggestion {
    place_id: string;
    display_name: string;
    lat: string;
    lon: string;
    address?: {
        road?: string;
        city?: string;
        town?: string;
        village?: string;
        suburb?: string;
    };
}

export function useLocationSearch() {
    const [locationQuery, setLocationQuery] = useState("");
    const [locationSuggestions, setLocationSuggestions] = useState<LocationSuggestion[]>([]);
    const [locationLoading, setLocationLoading] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [address, setAddress] = useState("");
    const [currentLat, setCurrentLat] = useState<number | null>(null);
    const [currentLng, setCurrentLng] = useState<number | null>(null);

    const locationTimerRef = useRef<any>(null);

    const searchLocation = async (query: string) => {
        if (query.length < 2) {
            setLocationSuggestions([]);
            setShowSuggestions(false);
            return;
        }
        setLocationLoading(true);
        try {
            const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&addressdetails=1&limit=6&accept-language=hr,en`;
            const resp = await fetch(url, {
                headers: {
                    "Accept-Language": "hr",
                    "User-Agent": "SmartExpenseTracker/1.0",
                },
            });
            const data: LocationSuggestion[] = await resp.json();
            setLocationSuggestions(data);
            setShowSuggestions(data.length > 0);
        } catch (e) {
            console.error("Location search error:", e);
        }
        setLocationLoading(false);
    };

    const handleLocationQueryChange = (text: string) => {
        setLocationQuery(text);
        if (locationTimerRef.current) clearTimeout(locationTimerRef.current);
        locationTimerRef.current = setTimeout(() => searchLocation(text), 400);
    };

    const handleSelectLocation = (
        suggestion: LocationSuggestion,
        storeName: string,
        setStoreName: (v: string) => void,
    ) => {
        const addr = suggestion.address;
        const road = addr?.road ?? "";
        const city = addr?.city ?? addr?.town ?? addr?.village ?? addr?.suburb ?? "";
        const fullAddr = [road, city].filter(Boolean).join(", ") || suggestion.display_name;
        setLocationQuery(suggestion.display_name);
        setAddress(fullAddr);
        setCurrentLat(parseFloat(suggestion.lat));
        setCurrentLng(parseFloat(suggestion.lon));
        if (!storeName) setStoreName(city || road || "");
        setShowSuggestions(false);
        setLocationSuggestions([]);
    };

    const getCurrentLocation = async (
        storeName: string,
        setStoreName: (v: string) => void,
    ) => {
        setLocationLoading(true);
        try {
            const Location = await import("expo-location");
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                Alert.alert("Dozvola potrebna", "Treba nam pristup lokaciji");
                setLocationLoading(false);
                return;
            }
            const loc = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.Balanced,
            });
            setCurrentLat(loc.coords.latitude);
            setCurrentLng(loc.coords.longitude);
            try {
                const resp = await fetch(
                    `https://nominatim.openstreetmap.org/reverse?lat=${loc.coords.latitude}&lon=${loc.coords.longitude}&format=json`,
                    { headers: { "Accept-Language": "hr", "User-Agent": "SmartExpenseTracker/1.0" } },
                );
                const geo = await resp.json();
                if (geo?.address) {
                    const road = geo.address.road ?? geo.address.pedestrian ?? "";
                    const city = geo.address.city ?? geo.address.town ?? geo.address.village ?? "";
                    const house = geo.address.house_number ?? "";
                    const fullAddress = [road, house, city].filter(Boolean).join(", ");
                    setAddress(fullAddress);
                    setLocationQuery(fullAddress);
                    if (!storeName) setStoreName(city);
                }
            } catch {
                const coords = `${loc.coords.latitude.toFixed(5)}, ${loc.coords.longitude.toFixed(5)}`;
                setAddress(coords);
                setLocationQuery(coords);
            }
        } catch {
            Alert.alert("Greška", "Nije moguće dohvatiti lokaciju.");
        }
        setLocationLoading(false);
    };

    const clearLocation = () => {
        setLocationQuery("");
        setShowSuggestions(false);
        setLocationSuggestions([]);
    };

    const resetLocation = () => {
        setAddress("");
        setCurrentLat(null);
        setCurrentLng(null);
        clearLocation();
    };

    return {
        locationQuery,
        locationSuggestions,
        locationLoading,
        showSuggestions,
        address,
        currentLat,
        currentLng,
        handleLocationQueryChange,
        handleSelectLocation,
        getCurrentLocation,
        clearLocation,
        resetLocation,
        setShowSuggestions,
    };
}