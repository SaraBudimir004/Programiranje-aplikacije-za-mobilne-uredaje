import { LocationGroup } from "./types";

// Generiranje Leaflet HTML karte (OpenStreetMap - besplatno, bez API ključa)
export const generateMapHtml = (lgroups: LocationGroup[]) => {
    const markersJs = lgroups
        .map((g) => {
            const colorMap: Record<string, string> = {
                green: "#22c55e",
                yellow: "#FBBF24",
                red: "#ef4444",
            };
            const color = colorMap[g.color] ?? "#60A5FA";
            const infoHtml = `<b>${g.storeName}</b><br/>${g.address}<br/>Ukupno: €${g.totalAmount.toFixed(2)}<br/>${g.receipts.length} račun(a)`;
            return `
            L.circleMarker([${g.latitude}, ${g.longitude}], {
                radius: ${Math.min(10 + g.receipts.length * 3, 28)},
                fillColor: '${color}', color: '#fff',
                weight: 2, opacity: 1, fillOpacity: 0.85
            })
            .bindPopup(\`${infoHtml}\`)
            .on('click', function() {
                window.ReactNativeWebView.postMessage(JSON.stringify({ key: '${g.key}' }));
            })
            .addTo(map);`;
        })
        .join("\n");

    const center =
        lgroups.length > 0
            ? `[${lgroups[0].latitude}, ${lgroups[0].longitude}]`
            : "[44.1, 16.4]";

    return `<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  #map { width:100%; height:100vh; }
  .leaflet-popup-content b { font-size:14px; }
</style>
</head>
<body>
<div id="map"></div>
<script>
  var map = L.map('map').setView(${center}, ${lgroups.length > 0 ? 13 : 7});
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors', maxZoom: 19
  }).addTo(map);
  ${markersJs}
  ${
        lgroups.length > 1
            ? `
  var bounds = [${lgroups.map((g) => `[${g.latitude},${g.longitude}]`).join(",")}];
  map.fitBounds(bounds, {padding:[30,30]});
  `
            : ""
    }
</script>
</body>
</html>`;
};
