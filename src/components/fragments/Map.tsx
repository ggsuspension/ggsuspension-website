import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix untuk marker icons
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Perlu casting ke any atau mengatur module declaration untuk file gambar
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: (markerIcon as any).src,
  iconRetinaUrl: (markerIcon2x as any).src,
  shadowUrl: (markerShadow as any).src,
});
interface MarkerType {
  position: L.LatLngExpression;
  popupText: string;
}

interface MapProps {
  center: L.LatLngExpression;
  zoom: number;
  markers: MarkerType[];
}

const Map: React.FC<MapProps> = ({ center, zoom, markers }) => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const markerLayer = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!mapInstance.current && mapRef.current) {
      // Inisialisasi peta
      mapInstance.current = L.map(mapRef.current, {
        center: center || [-6.2088, 106.8456], // Default ke Jakarta
        zoom: zoom || 13,
      });

      // Tambahkan tile layer (OpenStreetMap)
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapInstance.current);

      // Buat layer group untuk marker
      markerLayer.current = L.layerGroup().addTo(mapInstance.current);
    }

    // Update marker ketika props berubah
    if (markers && markerLayer.current) {
      markerLayer.current.clearLayers();
      markers.forEach((marker) => {
        L.marker(marker.position)
          .addTo(markerLayer.current as L.LayerGroup)
          .bindPopup(marker.popupText);
      });
    }

    // Bersihkan peta saat komponen unmount
    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [center, zoom, markers]);

  return (
    <div
      className="w-full h-[500px] rounded-lg shadow-lg border border-gray-200 overflow-hidden"
      ref={mapRef}
    />
  );
};

const DemoMap: React.FC = () => {
  const markers: MarkerType[] = [
    {
      position: [-6.2088, 106.8456], // Jakarta
      popupText: "Monas - Jakarta Pusat",
    },
    {
      position: [-6.9147, 107.6098], // Bandung
      popupText: "Gedung Sate - Bandung",
    },
  ];

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">
        Peta Indonesia - Contoh Leaflet.js
      </h1>
      <Map center={[-6.2088, 106.8456]} zoom={5} markers={markers} />
    </div>
  );
};

export default DemoMap;
