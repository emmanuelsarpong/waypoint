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
import { useState } from "react";

const ElevationAPI = "https://api.opentopodata.org/v1/test-dataset";

const cuteMarker = new L.Icon({
  iconUrl:
    "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='32' height='48' viewBox='0 0 32 48'><ellipse cx='16' cy='16' rx='14' ry='14' fill='%23a78bfa' stroke='white' stroke-width='3'/><circle cx='16' cy='16' r='7' fill='white'/></svg>",
  iconSize: [32, 48],
  iconAnchor: [16, 48],
  popupAnchor: [0, -48],
});

const AddRoute = ({ setPath }) => {
  useMapEvents({
    click(e) {
      setPath((prev) => [...prev, [e.latlng.lat, e.latlng.lng]]);
    },
  });
  return null;
};

const AdvancedMap = () => {
  const [path, setPath] = useState([]);

  return (
    <div
      style={{
        minHeight: "100vh",
        paddingTop: "80px", 
        paddingBottom: "60px",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        backgroundColor: "#000",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "1280px",
          margin: "0 auto",
          borderRadius: "14px",
          overflow: "hidden",
          boxShadow: "0 10px 40px rgba(0, 0, 0, 0.12)",
          background: "#fff",
          position: "relative",
        }}
      >
        <div style={{ height: "620px", position: "relative" }}>
          <MapContainer
            center={[45.5017, -73.5673]}
            zoom={14}
            scrollWheelZoom
            style={{ width: "100%", height: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="© OpenStreetMap contributors"
            />
            <AddRoute setPath={setPath} />
            {path.map((position, idx) => (
              <Marker key={idx} position={position} icon={cuteMarker}>
                <Popup>
                  <span style={{ color: "#a78bfa", fontWeight: 600 }}>
                    Point {idx + 1}
                  </span>
                </Popup>
              </Marker>
            ))}
            {path.length > 1 && <Polyline positions={path} color="#a78bfa" />}

            {/* Top UI Controls */}
            <div
              style={{
                position: "absolute",
                top: 24,
                left: "50%",
                transform: "translateX(-50%)",
                zIndex: 1000,
                display: "flex",
                flexWrap: "wrap",
                gap: "14px",
              }}
            >
              <input
                type="text"
                placeholder="Search location..."
                style={{
                  padding: "10px 14px",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                  fontSize: "14px",
                  minWidth: "160px",
                }}
              />
              <select
                style={{
                  padding: "10px 14px",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                  fontSize: "14px",
                }}
              >
                <option value="all">All Sports</option>
                <option value="running">Running</option>
                <option value="cycling">Cycling</option>
                <option value="hiking">Hiking</option>
              </select>
              <button
                style={{
                  padding: "10px 16px",
                  borderRadius: "8px",
                  background: "#f97316",
                  color: "white",
                  border: "none",
                  fontWeight: 600,
                }}
              >
                Heatmaps
              </button>
              <button
                style={{
                  padding: "10px 16px",
                  borderRadius: "8px",
                  background: "#f97316",
                  color: "white",
                  border: "none",
                  fontWeight: 600,
                }}
              >
                Segments
              </button>
              <button
                style={{
                  padding: "10px 16px",
                  borderRadius: "8px",
                  background: "#f97316",
                  color: "white",
                  border: "none",
                  fontWeight: 600,
                }}
              >
                Create Route
              </button>
              <select
                style={{
                  padding: "10px 14px",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                  fontSize: "14px",
                }}
              >
                <option value="">My Routes</option>
                <option value="recent">Recent</option>
                <option value="favorites">Favorites</option>
              </select>
            </div>
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

export default AdvancedMap;
