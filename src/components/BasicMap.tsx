import React, { useState } from "react";
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

const BasicMap: React.FC = () => {
  const [path, setPath] = useState<[number, number][]>([]);

  // Route Creator Component
  const RouteCreator: React.FC = () => {
    useMapEvents({
      click(e) {
        setPath((prev) => [...prev, [e.latlng.lat, e.latlng.lng]]);
      },
    });
    return null;
  };

  const clearPath = () => {
    setPath([]);
  };

  const calculateDistance = (coords: [number, number][]): number => {
    if (coords.length < 2) return 0;

    let totalDistance = 0;
    for (let i = 1; i < coords.length; i++) {
      const lat1 = coords[i - 1][0];
      const lng1 = coords[i - 1][1];
      const lat2 = coords[i][0];
      const lng2 = coords[i][1];

      const R = 6371; // Earth's radius in km
      const dLat = ((lat2 - lat1) * Math.PI) / 180;
      const dLng = ((lng2 - lng1) * Math.PI) / 180;
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
          Math.cos((lat2 * Math.PI) / 180) *
          Math.sin(dLng / 2) *
          Math.sin(dLng / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      totalDistance += R * c;
    }

    return Math.round(totalDistance * 100) / 100;
  };

  return (
    <div
      style={{
        height: "100vh",
        background: "linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%)",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          maxWidth: "1200px",
          marginBottom: "20px",
        }}
      >
        <h1 style={{ color: "white", margin: 0 }}>🗺️ Waypoint Premium</h1>
        <div style={{ display: "flex", gap: "10px" }}>
          {path.length > 0 && (
            <div
              style={{
                color: "white",
                background: "rgba(255, 255, 255, 0.1)",
                padding: "8px 16px",
                borderRadius: "8px",
                fontSize: "14px",
              }}
            >
              Distance: {calculateDistance(path)}km | Points: {path.length}
            </div>
          )}
          <button
            onClick={clearPath}
            style={{
              background: path.length > 0 ? "#ef4444" : "#6b7280",
              color: "white",
              border: "none",
              padding: "8px 16px",
              borderRadius: "8px",
              cursor: path.length > 0 ? "pointer" : "not-allowed",
              fontSize: "14px",
            }}
            disabled={path.length === 0}
          >
            Clear Route
          </button>
        </div>
      </div>

      <div
        style={{
          height: "80%",
          width: "100%",
          borderRadius: "16px",
          overflow: "hidden",
          maxWidth: "1200px",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
        }}
      >
        <MapContainer
          center={[45.5017, -73.5673]}
          zoom={13}
          scrollWheelZoom={true}
          style={{ width: "100%", height: "100%" }}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution="© CartoDB"
          />

          <RouteCreator />

          {path.map((position, idx) => (
            <Marker key={idx} position={position}>
              <Popup>
                <div
                  style={{
                    color: "#333",
                    textAlign: "center",
                    fontWeight: "bold",
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
              weight={4}
              opacity={0.8}
              dashArray="10, 5"
            />
          )}
        </MapContainer>
      </div>

      <div
        style={{
          color: "#a0a0a0",
          textAlign: "center",
          marginTop: "10px",
          fontSize: "14px",
        }}
      >
        Click on the map to create a route • Premium route tracking experience
      </div>
    </div>
  );
};

export default BasicMap;
