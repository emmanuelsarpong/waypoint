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

// Sample data
const SAMPLE_ROUTES = [
  {
    id: 1,
    name: "Morning Run in Park",
    sport: "running",
    date: "2025-06-27",
    distance: 5.2,
    duration: 1800,
    avgPace: "5:45",
    elevationGain: 120,
    calories: 350,
    steps: 6800,
    coordinates: [
      [45.5017, -73.5673],
      [45.5025, -73.568],
      [45.5035, -73.5675],
      [45.5045, -73.569],
    ],
  },
  {
    id: 2,
    name: "Cycling Along River",
    sport: "cycling",
    date: "2025-06-26",
    distance: 15.8,
    duration: 2700,
    avgSpeed: "21.2 km/h",
    elevationGain: 85,
    calories: 420,
    steps: 0,
    coordinates: [
      [45.4995, -73.57],
      [45.4985, -73.572],
      [45.4975, -73.574],
      [45.4965, -73.576],
    ],
  },
];

const formatDuration = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  return `${minutes} min`;
};

const getSportColor = (sport) => {
  const colors = {
    running: "#ec4899", // pink
    cycling: "#22d3ee", // cyan
    hiking: "#a3e635", // lime
  };
  return colors[sport] || "#f9fafb";
};

const cuteMarker = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
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
  const [savedRoutes] = useState(SAMPLE_ROUTES);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [sportFilter, setSportFilter] = useState("all");

  const filteredRoutes = savedRoutes.filter(
    (route) => sportFilter === "all" || route.sport === sportFilter
  );

  return (
    <div
      style={{
        fontFamily: "'Inter', sans-serif",
        background: "#0a0a0a",
        padding: "20px",
        minHeight: "100vh",
        color: "white",
      }}
    >
      <header
        style={{
          textAlign: "center",
          marginBottom: "20px",
        }}
      >
        <h1
          style={{
            fontSize: "2rem",
            fontWeight: "700",
          }}
        >
          📍 Waypoint
        </h1>
        <p
          style={{
            color: "#6b7280",
            margin: 0,
          }}
        >
          Modern Route Tracking
        </p>
      </header>

      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          borderRadius: "16px",
          overflow: "hidden",
          background: "#111",
          boxShadow: "0 0 0 1px #1f2937",
        }}
      >
        <MapContainer
          center={[45.5017, -73.5673]}
          zoom={14}
          style={{ width: "100%", height: "600px" }}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            attribution="© CartoDB"
          />

          {!selectedRoute && <AddRoute setPath={setPath} />}

          {filteredRoutes.map((route) => (
            <Polyline
              key={route.id}
              positions={route.coordinates}
              color={getSportColor(route.sport)}
              weight={selectedRoute?.id === route.id ? 6 : 3}
              opacity={selectedRoute?.id === route.id ? 0.9 : 0.7} // Reduced opacity for better glow effect
              eventHandlers={{
                click: () => setSelectedRoute(route),
              }}
            />
          ))}

          {!selectedRoute &&
            path.map((pos, idx) => (
              <Marker key={idx} position={pos} icon={cuteMarker}>
                <Popup>Point {idx + 1}</Popup>
              </Marker>
            ))}

          {!selectedRoute && path.length > 1 && (
            <Polyline
              positions={path}
              color="#6366f1"
              weight={4}
              opacity={0.8} // Slightly transparent for modern look
            />
          )}
        </MapContainer>

        {/* Controls */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "16px",
            background: "#111",
            borderTop: "1px solid #1f2937",
          }}
        >
          <select
            value={sportFilter}
            onChange={(e) => setSportFilter(e.target.value)}
            style={{
              background: "#1f2937",
              border: "1px solid #374151",
              color: "white",
              padding: "8px 12px",
              borderRadius: "8px",
            }}
          >
            <option value="all">All Sports</option>
            <option value="running">Running</option>
            <option value="cycling">Cycling</option>
            <option value="hiking">Hiking</option>
          </select>
          {selectedRoute && (
            <button
              onClick={() => setSelectedRoute(null)}
              style={{
                background: "#ef4444",
                color: "white",
                padding: "8px 16px",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
              }}
            >
              Deselect
            </button>
          )}
        </div>

        {/* Selected route details */}
        {selectedRoute && (
          <div
            style={{
              padding: "20px",
              borderTop: "1px solid #1f2937",
              background: "#111",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "20px",
            }}
          >
            <div>
              <h2
                style={{
                  margin: "0 0 8px 0",
                  fontSize: "1.25rem",
                  color: getSportColor(selectedRoute.sport),
                }}
              >
                {selectedRoute.name}
              </h2>
              <div style={{ color: "#9ca3af" }}>
                {new Date(selectedRoute.date).toLocaleDateString()}
              </div>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "12px",
              }}
            >
              <div>
                <strong>{selectedRoute.distance} km</strong>
                <div style={{ fontSize: "0.85rem", color: "#9ca3af" }}>
                  Distance
                </div>
              </div>
              <div>
                <strong>{formatDuration(selectedRoute.duration)}</strong>
                <div style={{ fontSize: "0.85rem", color: "#9ca3af" }}>
                  Duration
                </div>
              </div>
              <div>
                <strong>{selectedRoute.elevationGain} m</strong>
                <div style={{ fontSize: "0.85rem", color: "#9ca3af" }}>
                  Elevation
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdvancedMap;
