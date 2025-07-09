import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default markers in react-leaflet
(L.Icon.Default.prototype as any)._getIconUrl = undefined;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const AdvancedMapPremium: React.FC = () => {
  const [path, setPath] = useState<[number, number][]>([]);
  const mapRef = useRef<L.Map | null>(null);

  // Route Creator Component
  const RouteCreator: React.FC<{
    setPath: React.Dispatch<React.SetStateAction<[number, number][]>>;
  }> = ({ setPath }) => {
    useMapEvents({
      click(e) {
        setPath((prev) => [...prev, [e.latlng.lat, e.latlng.lng]]);
      },
    });
    return null;
  };

  return (
    <div
      style={{
        height: "100%",
        background: "#1a1a1a",
        borderRadius: "16px",
        overflow: "hidden",
        position: "relative",
        padding: "20px",
      }}
    >
      <div
        style={{
          height: "100%",
          borderRadius: "16px",
          overflow: "hidden",
        }}
      >
        <MapContainer
          center={[45.5017, -73.5673]}
          zoom={14}
          scrollWheelZoom
          style={{ width: "100%", height: "100%" }}
          ref={mapRef}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution="© CartoDB"
          />

          <RouteCreator setPath={setPath} />

          {path.map((position, idx) => (
            <Marker key={idx} position={position}>
              <Popup>
                <div
                  style={{
                    color: "#333",
                    fontWeight: 600,
                    textAlign: "center",
                  }}
                >
                  <strong>Point {idx + 1}</strong>
                  <br />
                  <small>Lat: {position[0].toFixed(6)}</small>
                  <br />
                  <small>Lng: {position[1].toFixed(6)}</small>
                </div>
              </Popup>
            </Marker>
          ))}

          {path.length > 1 && (
            <Polyline
              positions={path}
              color="#00d4ff"
              weight={3}
              opacity={0.9}
            />
          )}
        </MapContainer>
      </div>
    </div>
  );
};

export default AdvancedMapPremium;
