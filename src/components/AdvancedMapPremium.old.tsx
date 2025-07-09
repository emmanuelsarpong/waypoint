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
import styled, { keyframes, createGlobalStyle } from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";

// Import routing machine for road-following routes
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";

// Types
interface RouteCoordinate {
  lat: number;
  lng: number;
  elevation?: number;
  timestamp?: string;
}

interface RouteStats {
  distance: number;
  duration: number;
  avgPace: string;
  avgSpeed: number;
  elevationGain: number;
  elevationLoss: number;
  calories: number;
  steps: number;
  maxSpeed: number;
  avgHeartRate: number;
}

interface Route {
  id: string;
  name: string;
  sport: string;
  date: string;
  stats: RouteStats;
  coordinates: RouteCoordinate[];
  weather?: {
    temperature: number;
    condition: string;
    humidity: number;
  };
}

// Styled Components
const MapContainer_SC = styled.div`
  height: 100%;
  background: linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%);
  border-radius: 16px;
  overflow: hidden;
  position: relative;
`;

const Header = styled(motion.div)`
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  text-align: center;
  pointer-events: none;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 800;
  color: #ffffff;
  margin: 0;
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
`;

const Subtitle = styled.p`
  font-size: 1rem;
  color: #a0a0a0;
  margin: 4px 0 0 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
`;

// Helper Functions
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

const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  }
  return `${minutes}:${secs.toString().padStart(2, "0")}`;
};

const getSportColor = (sport: string): string => {
  const colors = {
    running: "#ef4444",
    cycling: "#3b82f6",
    hiking: "#10b981",
    walking: "#f59e0b",
    swimming: "#06b6d4",
    default: "#8b5cf6",
  };
  return colors[sport as keyof typeof colors] || colors.default;
};

// Route clustering algorithm for performance
const clusterRoutes = (routes: Route[], zoom: number): Route[] => {
  if (zoom > 12) return routes; // No clustering at high zoom levels

  const clustered: Route[] = [];
  const used = new Set<string>();

  routes.forEach((route) => {
    if (used.has(route.id.toString())) return;

    const cluster = routes.filter(
      (r) =>
        !used.has(r.id.toString()) &&
        Math.abs(r.coordinates[0]?.lat - route.coordinates[0]?.lat) < 0.01 &&
        Math.abs(r.coordinates[0]?.lng - route.coordinates[0]?.lng) < 0.01
    );

    cluster.forEach((r) => used.add(r.id.toString()));
    clustered.push(route); // Use first route as representative
  });

  return clustered;
};

// Create premium map markers
const createPremiumMarker = (type: "start" | "end" | "path"): L.Icon => {
  const colors = {
    start: "#22c55e",
    end: "#ef4444",
    path: "#8b5cf6",
  };

  const icons = {
    start: "S",
    end: "F",
    path: "●",
  };

  return new L.Icon({
    iconUrl: `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'><circle cx='16' cy='16' r='14' fill='${colors[type]}' stroke='white' stroke-width='3'/><circle cx='16' cy='16' r='8' fill='white'/><text x='16' y='20' text-anchor='middle' fill='${colors[type]}' font-size='12' font-weight='bold'>${icons[type]}</text></svg>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  });
};

// Sample premium routes with enhanced data
const PREMIUM_SAMPLE_ROUTES: Route[] = [
  {
    id: 1,
    name: "Elite Morning Run",
    sport: "running",
    date: "2025-07-05",
    stats: {
      distance: 8.4,
      duration: 2400,
      avgPace: "4:45",
      elevationGain: 180,
      elevationLoss: 165,
      calories: 520,
      steps: 11200,
      maxSpeed: 18.5,
      avgHeartRate: 165,
    },
    coordinates: [
      { lat: 45.5017, lng: -73.5673, elevation: 50 },
      { lat: 45.5025, lng: -73.568, elevation: 80 },
      { lat: 45.5035, lng: -73.5675, elevation: 120 },
      { lat: 45.5045, lng: -73.569, elevation: 180 },
      { lat: 45.505, lng: -73.5685, elevation: 245 },
      { lat: 45.504, lng: -73.567, elevation: 220 },
      { lat: 45.503, lng: -73.5665, elevation: 150 },
      { lat: 45.5017, lng: -73.5673, elevation: 50 },
    ],
    weather: {
      temperature: 18,
      condition: "Partly Cloudy",
      humidity: 65,
    },
  },
  {
    id: 2,
    name: "River Valley Cycling",
    sport: "cycling",
    date: "2025-07-02",
    stats: {
      distance: 24.7,
      duration: 3600,
      avgSpeed: "24.7 km/h",
      elevationGain: 312,
      calories: 890,
      steps: 0,
      maxSpeed: 42.1,
      avgHeartRate: 142,
    },
    coordinates: [
      { lat: 45.4995, lng: -73.57, elevation: 40 },
      { lat: 45.4985, lng: -73.572, elevation: 65 },
      { lat: 45.4975, lng: -73.574, elevation: 85 },
      { lat: 45.4965, lng: -73.576, elevation: 120 },
      { lat: 45.4955, lng: -73.578, elevation: 180 },
      { lat: 45.4945, lng: -73.58, elevation: 220 },
    ],
    weather: {
      temperature: 22,
      condition: "Sunny",
      humidity: 45,
    },
  },
];

// Global Styles
const GlobalMapStyles = createGlobalStyle`
  .leaflet-container {
    background: #0a0a0a !important;
  }
  
  .leaflet-tile {
    filter: brightness(0.6) contrast(3) hue-rotate(200deg) saturate(0.3) !important;
  }
  
  .leaflet-control-zoom a {
    background: rgba(20, 20, 22, 0.9) !important;
    color: white !important;
    border: 1px solid rgba(255, 255, 255, 0.1) !important;
    backdrop-filter: blur(10px) !important;
  }
  
  .leaflet-control-zoom a:hover {
    background: rgba(40, 40, 42, 0.9) !important;
  }
  
  .leaflet-popup-content-wrapper {
    background: rgba(20, 20, 22, 0.95) !important;
    color: white !important;
    border-radius: 12px !important;
    backdrop-filter: blur(20px) !important;
    border: 1px solid rgba(255, 255, 255, 0.1) !important;
  }
  
  .leaflet-popup-tip {
    background: rgba(20, 20, 22, 0.95) !important;
  }
`;

// Animations
const slideIn = keyframes`
  from {
    transform: translateX(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
`;

// Styled Components
const MapContainer_SC = styled.div`
  width: 100%;
  height: calc(100vh - 140px);
  background: #000000;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  position: relative;
  min-height: 400px;
  overflow: hidden;
`;

const Header = styled(motion.div)`
  text-align: center;
  padding: 20px 0 24px;
  background: linear-gradient(135deg, #000000 0%, #111111 100%);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 8px 0;
  letter-spacing: -1px;
  background: linear-gradient(135deg, #ffffff, #a0a0a0);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Subtitle = styled.p`
  color: #a0a0a0;
  font-size: 1.1rem;
  margin: 0;
  font-weight: 400;
`;

const MainContainer = styled.div`
  width: 100%;
  height: calc(100% - 120px);
  background: linear-gradient(135deg, #1a1a1a 0%, #0f0f0f 100%);
  border-radius: 16px;
  border: 1px solid #333333;
  overflow: hidden;
  position: relative;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
`;

const GlassmorphicPanel = styled(motion.div)<{ $isMobile?: boolean }>`
  position: absolute;
  background: rgba(20, 20, 22, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4),
    0 0 0 0.5px rgba(255, 255, 255, 0.05);
  z-index: 1001;
  overflow: hidden;
`;

const ControlsBar = styled(GlassmorphicPanel)<{
  $isMobile?: boolean;
  $showRoutesList?: boolean;
}>`
  top: ${(props) => (props.$isMobile ? "12px" : "24px")};
  left: ${(props) => {
    if (props.$isMobile) return "12px";
    return props.$showRoutesList ? "416px" : "24px";
  }};
  right: ${(props) => (props.$isMobile ? "12px" : "24px")};
  padding: ${(props) => (props.$isMobile ? "12px 16px" : "16px 20px")};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 1002;
`;

const ControlsGrid = styled.div<{ $isMobile?: boolean }>`
  display: flex;
  gap: ${(props) => (props.$isMobile ? "8px" : "12px")};
  align-items: center;
  flex-wrap: wrap;
  justify-content: ${(props) => (props.$isMobile ? "center" : "flex-start")};
`;

const PremiumButton = styled(motion.button)<{
  $variant?: "primary" | "secondary" | "success" | "danger";
  $active?: boolean;
  $disabled?: boolean;
}>`
  padding: 10px 16px;
  border-radius: 10px;
  background: ${(props) => {
    if (props.$disabled) return "rgba(128, 128, 128, 0.3)";
    if (props.$active || props.$variant === "primary")
      return "rgba(59, 130, 246, 0.9)";
    if (props.$variant === "success") return "rgba(16, 185, 129, 0.9)";
    if (props.$variant === "danger") return "rgba(239, 68, 68, 0.9)";
    return "rgba(255, 255, 255, 0.1)";
  }};
  backdrop-filter: blur(10px);
  color: ${(props) => (props.$disabled ? "#666666" : "white")};
  border: 1px solid
    ${(props) => {
      if (props.$disabled) return "rgba(128, 128, 128, 0.2)";
      if (props.$active || props.$variant === "primary")
        return "rgba(59, 130, 246, 0.3)";
      if (props.$variant === "success") return "rgba(16, 185, 129, 0.3)";
      if (props.$variant === "danger") return "rgba(239, 68, 68, 0.3)";
      return "rgba(255, 255, 255, 0.2)";
    }};
  font-weight: 600;
  font-size: 0.875rem;
  cursor: ${(props) => (props.$disabled ? "not-allowed" : "pointer")};
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: ${(props) => {
    if (props.$disabled) return "none";
    if (props.$active || props.$variant === "primary")
      return "0 4px 12px rgba(59, 130, 246, 0.4)";
    if (props.$variant === "success")
      return "0 4px 12px rgba(16, 185, 129, 0.4)";
    if (props.$variant === "danger") return "0 4px 12px rgba(239, 68, 68, 0.4)";
    return "none";
  }};

  &:hover {
    ${(props) =>
      !props.$disabled &&
      `
      transform: translateY(-1px);
      box-shadow: ${
        props.$active || props.$variant === "primary"
          ? "0 6px 16px rgba(59, 130, 246, 0.5)"
          : props.$variant === "success"
          ? "0 6px 16px rgba(16, 185, 129, 0.5)"
          : props.$variant === "danger"
          ? "0 6px 16px rgba(239, 68, 68, 0.5)"
          : "0 4px 12px rgba(255, 255, 255, 0.1)"
      };
    `}
  }
`;

const RoutesSidebar = styled(GlassmorphicPanel)<{ $isMobile?: boolean }>`
  top: ${(props) => (props.$isMobile ? "80px" : "24px")};
  left: ${(props) => (props.$isMobile ? "12px" : "24px")};
  width: ${(props) => (props.$isMobile ? "280px" : "380px")};
  max-height: ${(props) => (props.$isMobile ? "350px" : "500px")};
  animation: ${slideIn} 0.3s cubic-bezier(0.4, 0, 0.2, 1);
`;

const SidebarHeader = styled.div`
  padding: 20px 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const SidebarTitle = styled.h3`
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #ffffff;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  padding: 16px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
`;

const StatCard = styled.div`
  text-align: center;
  padding: 12px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const StatValue = styled.div`
  font-weight: 700;
  font-size: 1.1rem;
  color: #ffffff;
  margin-bottom: 4px;
`;

const StatLabel = styled.div`
  font-size: 0.75rem;
  color: #a0a0a0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const RoutesList = styled.div`
  padding: 16px 20px;
  max-height: 280px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 3px;
  }
`;

const RouteCard = styled(motion.div)<{
  $selected?: boolean;
  $sportColor?: string;
}>`
  padding: 16px;
  margin-bottom: 12px;
  border: 2px solid
    ${(props) =>
      props.$selected
        ? props.$sportColor || "#3b82f6"
        : "rgba(255, 255, 255, 0.1)"};
  border-radius: 12px;
  cursor: pointer;
  background: ${(props) =>
    props.$selected
      ? `linear-gradient(135deg, ${props.$sportColor}30, ${props.$sportColor}10)`
      : "rgba(255, 255, 255, 0.08)"};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    transform: translateY(-2px);
    background: ${(props) =>
      props.$selected
        ? `linear-gradient(135deg, ${props.$sportColor}40, ${props.$sportColor}20)`
        : "rgba(255, 255, 255, 0.12)"};
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
  }
`;

const ElevationChart = styled.div`
  height: 120px;
  margin: 16px 0;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 8px;
`;

// Route Creation Component
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

// Route Analytics Overlay Component
const RouteAnalyticsOverlay: React.FC<{ route: Route; isMobile: boolean }> = ({
  route,
  isMobile,
}) => {
  return (
    <GlassmorphicPanel
      style={{
        position: "absolute",
        top: isMobile ? "380px" : "80px",
        right: isMobile ? "12px" : "24px",
        width: isMobile ? "280px" : "320px",
        maxHeight: "400px",
        zIndex: 1003,
        overflow: "auto",
      }}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
    >
      <div style={{ padding: "20px" }}>
        {/* Header */}
        <div style={{ marginBottom: "20px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "8px",
            }}
          >
            <h3
              style={{
                margin: 0,
                color: "#ffffff",
                fontSize: "1.1rem",
                fontWeight: "600",
              }}
            >
              {route.name}
            </h3>
            <span
              style={{
                padding: "6px 12px",
                borderRadius: "20px",
                fontSize: "0.75rem",
                fontWeight: "700",
                backgroundColor: getSportColor(route.sport),
                color: "white",
                textTransform: "uppercase",
              }}
            >
              {route.sport}
            </span>
          </div>
          <div style={{ fontSize: "0.875rem", color: "#a0a0a0" }}>
            📅{" "}
            {new Date(route.date).toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
          {route.weather && (
            <div
              style={{
                fontSize: "0.875rem",
                color: "#a0a0a0",
                marginTop: "4px",
              }}
            >
              🌡️ {route.weather.temperature}°C • {route.weather.condition} •{" "}
              {route.weather.humidity}% humidity
            </div>
          )}
        </div>

        {/* Primary Stats Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "12px",
            marginBottom: "20px",
          }}
        >
          <StatCard
            style={{
              background:
                "linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(59, 130, 246, 0.1))",
            }}
          >
            <StatValue style={{ color: "#3b82f6", fontSize: "1.5rem" }}>
              {route.stats.distance}
            </StatValue>
            <StatLabel>Kilometers</StatLabel>
          </StatCard>
          <StatCard
            style={{
              background:
                "linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(245, 158, 11, 0.1))",
            }}
          >
            <StatValue style={{ color: "#f59e0b", fontSize: "1.5rem" }}>
              {formatDuration(route.stats.duration)}
            </StatValue>
            <StatLabel>Duration</StatLabel>
          </StatCard>
          <StatCard
            style={{
              background:
                "linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(16, 185, 129, 0.1))",
            }}
          >
            <StatValue style={{ color: "#10b981", fontSize: "1.1rem" }}>
              {route.stats.avgPace || route.stats.avgSpeed}
            </StatValue>
            <StatLabel>Avg Pace</StatLabel>
          </StatCard>
          <StatCard
            style={{
              background:
                "linear-gradient(135deg, rgba(124, 58, 237, 0.2), rgba(124, 58, 237, 0.1))",
            }}
          >
            <StatValue style={{ color: "#7c3aed", fontSize: "1.1rem" }}>
              ↗ {route.stats.elevationGain}m
            </StatValue>
            <StatLabel>Elevation</StatLabel>
          </StatCard>
        </div>

        {/* Secondary Stats */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            marginBottom: "20px",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                fontSize: "1.1rem",
                fontWeight: "700",
                color: "#ef4444",
                marginBottom: "4px",
              }}
            >
              🔥 {route.stats.calories}
            </div>
            <div style={{ fontSize: "0.75rem", color: "#a0a0a0" }}>
              Calories
            </div>
          </div>
          {route.stats.steps > 0 && (
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  fontSize: "1.1rem",
                  fontWeight: "700",
                  color: "#3b82f6",
                  marginBottom: "4px",
                }}
              >
                👟 {route.stats.steps.toLocaleString()}
              </div>
              <div style={{ fontSize: "0.75rem", color: "#a0a0a0" }}>Steps</div>
            </div>
          )}
          {route.stats.avgHeartRate && (
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  fontSize: "1.1rem",
                  fontWeight: "700",
                  color: "#f59e0b",
                  marginBottom: "4px",
                }}
              >
                💗 {route.stats.avgHeartRate}
              </div>
              <div style={{ fontSize: "0.75rem", color: "#a0a0a0" }}>
                Avg HR
              </div>
            </div>
          )}
        </div>

        {route.stats.maxSpeed && (
          <div style={{ marginBottom: "20px" }}>
            <div
              style={{
                fontSize: "0.875rem",
                color: "#a0a0a0",
                marginBottom: "8px",
              }}
            >
              Performance
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "0.875rem",
              }}
            >
              <span>
                Max Speed: <strong>{route.stats.maxSpeed} km/h</strong>
              </span>
              <span>
                Avg HR: <strong>{route.stats.avgHeartRate || "N/A"} bpm</strong>
              </span>
            </div>
          </div>
        )}

        {/* Elevation Profile Chart */}
        <div style={{ marginTop: "20px" }}>
          <div
            style={{
              fontSize: "0.875rem",
              color: "#a0a0a0",
              marginBottom: "8px",
            }}
          >
            Elevation Profile
          </div>
          <div
            style={{
              height: "100px",
              background: "rgba(255, 255, 255, 0.05)",
              borderRadius: "8px",
              padding: "8px",
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={route.coordinates.map((coord, index) => ({
                  distance:
                    (index / route.coordinates.length) * route.stats.distance,
                  elevation: coord.elevation || 0,
                }))}
              >
                <defs>
                  <linearGradient
                    id={`gradient-${route.id}`}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor={getSportColor(route.sport)}
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor={getSportColor(route.sport)}
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                </defs>
                <XAxis dataKey="distance" hide />
                <YAxis hide />
                <Tooltip
                  labelFormatter={(value: number) => `${value.toFixed(1)}km`}
                  formatter={(value: number) => [`${value}m`, "Elevation"]}
                  contentStyle={{
                    background: "rgba(20, 20, 22, 0.9)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    borderRadius: "8px",
                    color: "white",
                    fontSize: "12px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="elevation"
                  stroke={getSportColor(route.sport)}
                  fillOpacity={1}
                  fill={`url(#gradient-${route.id})`}
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </GlassmorphicPanel>
  );
};

const AdvancedMapPremium: React.FC = () => {
  const [path, setPath] = useState<[number, number][]>([]);
  const [savedRoutes, setSavedRoutes] = useState<Route[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [showRoutesList, setShowRoutesList] = useState(false);
  const [sportFilter, setSportFilter] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [mapZoom, setMapZoom] = useState(14);
  const mapRef = useRef<L.Map | null>(null);

  // Mobile detection with proper cleanup
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Map events handler
  useEffect(() => {
    if (mapRef.current) {
      const map = mapRef.current;
      const handleZoomEnd = () => {
        setMapZoom(map.getZoom());
      };

      map.on("zoomend", handleZoomEnd);

      return () => {
        map.off("zoomend", handleZoomEnd);
      };
    }
  }, [mapRef.current]);

  // Memoized filtered routes with clustering
  const filteredRoutes = useMemo(() => {
    const filtered = savedRoutes.filter(
      (route) => sportFilter === "all" || route.sport === sportFilter
    );
    return clusterRoutes(filtered, mapZoom);
  }, [savedRoutes, sportFilter, mapZoom]);

  // Memoized elevation data for charts
  const elevationData = useMemo(() => {
    if (!selectedRoute) return [];
    return selectedRoute.coordinates.map((coord, index) => ({
      distance:
        (index / selectedRoute.coordinates.length) *
        selectedRoute.stats.distance,
      elevation: coord.elevation || 0,
    }));
  }, [selectedRoute]);

  const handleRouteClick = useCallback(
    (route: Route) => {
      setSelectedRoute(route);
      setPath([]);
      if (isMobile && showRoutesList) {
        setShowRoutesList(false);
      }
    },
    [isMobile, showRoutesList]
  );

  const seedTestData = useCallback(async () => {
    setSavedRoutes(PREMIUM_SAMPLE_ROUTES);
    setIsLoading(false);

    try {
      const response = await fetch("http://localhost:3000/api/seed-workouts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (response.ok) {
        console.log("Premium test data seeded to backend");
      }
    } catch (error) {
      console.error("Backend seeding failed:", error);
    }
  }, []);

  const fetchUserRoutes = useCallback(async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setSavedRoutes([]);
        setIsLoading(false);
        return;
      }

      const response = await fetch("http://localhost:3000/api/workouts", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to fetch routes");

      const data = await response.json();
      const transformedRoutes: Route[] = data.data.workouts.map(
        (workout: any) => ({
          id: workout.id,
          name: workout.name,
          sport: workout.sport,
          date: workout.createdAt.split("T")[0],
          stats: {
            distance: workout.stats.distance,
            duration: workout.stats.duration,
            avgPace: workout.stats.avgPace,
            avgSpeed: workout.stats.avgSpeed,
            elevationGain: workout.stats.elevationGain,
            elevationLoss: workout.stats.elevationLoss,
            calories: workout.stats.calories,
            steps: workout.stats.steps || 0,
            maxSpeed: workout.stats.maxSpeed,
            avgHeartRate: workout.stats.avgHeartRate,
          },
          coordinates: workout.coordinates.map((coord: any) => ({
            lat: coord.lat,
            lng: coord.lng,
            elevation: coord.elevation || 0,
          })),
        })
      );

      setSavedRoutes(transformedRoutes);
    } catch (error) {
      console.error("Error fetching routes:", error);
      setSavedRoutes([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveCurrentRoute = useCallback(async () => {
    if (path.length < 2) {
      alert("Please create a route with at least 2 points");
      return;
    }

    const newRoute = {
      name: `Premium Route ${savedRoutes.length + 1}`,
      sport: "running",
      startTime: new Date().toISOString(),
      endTime: new Date().toISOString(),
      coordinates: path.map((coord, index) => ({
        lat: coord[0],
        lng: coord[1],
        timestamp: new Date(Date.now() + index * 1000).toISOString(),
        elevation: 50 + Math.random() * 100, // Generate realistic elevation
      })),
      stats: {
        distance: calculateDistance(path),
        duration: Math.floor(Math.random() * 3600) + 600, // 10-60 minutes
        avgPace: "0:00",
        elevationGain: Math.floor(Math.random() * 200) + 50,
        elevationLoss: Math.floor(Math.random() * 150) + 25,
        calories: Math.floor(Math.random() * 500) + 200,
        steps: Math.floor(Math.random() * 8000) + 2000,
        maxSpeed: Math.floor(Math.random() * 15) + 5,
        avgHeartRate: Math.floor(Math.random() * 40) + 140,
      },
      source: "premium_web_app",
    };

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please log in to save routes");
        return;
      }

      const response = await fetch("http://localhost:3000/api/workouts", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newRoute),
      });

      if (!response.ok) throw new Error("Failed to save route");

      const data = await response.json();
      const savedWorkout = data.data.workout;

      const transformedRoute: Route = {
        id: savedWorkout.id,
        name: savedWorkout.name,
        sport: savedWorkout.sport,
        date: savedWorkout.createdAt.split("T")[0],
        stats: {
          distance: savedWorkout.stats.distance,
          duration: savedWorkout.stats.duration,
          avgPace: savedWorkout.stats.avgPace,
          avgSpeed: savedWorkout.stats.avgSpeed,
          elevationGain: savedWorkout.stats.elevationGain,
          elevationLoss: savedWorkout.stats.elevationLoss,
          calories: savedWorkout.stats.calories,
          steps: savedWorkout.stats.steps || 0,
          maxSpeed: savedWorkout.stats.maxSpeed,
          avgHeartRate: savedWorkout.stats.avgHeartRate,
        },
        coordinates: savedWorkout.coordinates.map((coord: any) => ({
          lat: coord.lat,
          lng: coord.lng,
          elevation: coord.elevation || 0,
        })),
        weather: {
          temperature: 18 + Math.random() * 10,
          condition: "Clear",
          humidity: 40 + Math.random() * 30,
        },
      };

      setSavedRoutes((prev) => [transformedRoute, ...prev]);
      setSelectedRoute(transformedRoute);
      setPath([]);
      alert(`Premium route saved: ${transformedRoute.stats.distance}km`);
    } catch (error) {
      console.error("Error saving route:", error);
      alert("Failed to save route. Please try again.");
    }
  }, [path, savedRoutes]);

  useEffect(() => {
    fetchUserRoutes();
  }, [fetchUserRoutes]);

  return (
    <>
      <GlobalMapStyles />
      <MapContainer_SC>
        <Header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Title>Waypoint Premium</Title>
          <Subtitle>Professional route tracking & analytics</Subtitle>
        </Header>

        <MainContainer>
          <AnimatePresence>
            {showRoutesList && (
              <RoutesSidebar
                $isMobile={isMobile}
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -100, opacity: 0 }}
                transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
              >
                <SidebarHeader>
                  <SidebarTitle>My Routes</SidebarTitle>
                  <PremiumButton
                    onClick={() => setShowRoutesList(false)}
                    $variant="danger"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    ✕
                  </PremiumButton>
                </SidebarHeader>

                <StatsGrid>
                  <StatCard>
                    <StatValue>{savedRoutes.length}</StatValue>
                    <StatLabel>Routes</StatLabel>
                  </StatCard>
                  <StatCard>
                    <StatValue>
                      {savedRoutes
                        .reduce((sum, route) => sum + route.stats.distance, 0)
                        .toFixed(1)}
                      km
                    </StatValue>
                    <StatLabel>Total</StatLabel>
                  </StatCard>
                  <StatCard>
                    <StatValue>
                      {Math.round(
                        savedRoutes.reduce(
                          (sum, route) => sum + route.stats.calories,
                          0
                        )
                      )}
                    </StatValue>
                    <StatLabel>Calories</StatLabel>
                  </StatCard>
                </StatsGrid>

                <RoutesList>
                  {isLoading ? (
                    <motion.div
                      style={{
                        textAlign: "center",
                        padding: "40px",
                        color: "#a0a0a0",
                      }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <div
                        style={{
                          width: "40px",
                          height: "40px",
                          border: "3px solid #404040",
                          borderTop: "3px solid #3b82f6",
                          borderRadius: "50%",
                          animation: `${pulse} 1s linear infinite`,
                          margin: "0 auto 16px",
                        }}
                      />
                      Loading premium routes...
                    </motion.div>
                  ) : filteredRoutes.length === 0 ? (
                    <motion.div
                      style={{
                        textAlign: "center",
                        padding: "40px 20px",
                        color: "#a0a0a0",
                        background: "rgba(255, 255, 255, 0.06)",
                        borderRadius: "16px",
                        border: "2px dashed rgba(255, 255, 255, 0.2)",
                      }}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                    >
                      <div style={{ fontSize: "48px", marginBottom: "16px" }}>
                        🗺️
                      </div>
                      <div
                        style={{
                          fontWeight: "600",
                          marginBottom: "8px",
                          color: "#ffffff",
                        }}
                      >
                        No routes yet
                      </div>
                      <div>Create your first route!</div>
                    </motion.div>
                  ) : (
                    filteredRoutes.map((route) => (
                      <RouteCard
                        key={route.id}
                        onClick={() => handleRouteClick(route)}
                        $selected={selectedRoute?.id === route.id}
                        $sportColor={getSportColor(route.sport)}
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        layout
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginBottom: "12px",
                          }}
                        >
                          <h4
                            style={{
                              margin: 0,
                              color: "#ffffff",
                              fontSize: "1rem",
                            }}
                          >
                            {route.name}
                          </h4>
                          <span
                            style={{
                              padding: "4px 8px",
                              borderRadius: "12px",
                              fontSize: "0.75rem",
                              fontWeight: "600",
                              backgroundColor: getSportColor(route.sport),
                              color: "white",
                              textTransform: "uppercase",
                            }}
                          >
                            {route.sport}
                          </span>
                        </div>

                        {/* Weather Info */}
                        {route.weather && (
                          <div
                            style={{
                              fontSize: "0.8rem",
                              color: "#a0a0a0",
                              marginBottom: "8px",
                            }}
                          >
                            🌡️ {route.weather.temperature}°C •{" "}
                            {route.weather.condition}
                          </div>
                        )}

                        {/* Elevation Chart */}
                        {elevationData.length > 0 &&
                          selectedRoute?.id === route.id && (
                            <ElevationChart>
                              <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={elevationData}>
                                  <defs>
                                    <linearGradient
                                      id="elevationGradient"
                                      x1="0"
                                      y1="0"
                                      x2="0"
                                      y2="1"
                                    >
                                      <stop
                                        offset="5%"
                                        stopColor={getSportColor(route.sport)}
                                        stopOpacity={0.8}
                                      />
                                      <stop
                                        offset="95%"
                                        stopColor={getSportColor(route.sport)}
                                        stopOpacity={0.1}
                                      />
                                    </linearGradient>
                                  </defs>
                                  <XAxis dataKey="distance" hide />
                                  <YAxis hide />
                                  <Tooltip
                                    labelFormatter={(value) =>
                                      `${value.toFixed(1)}km`
                                    }
                                    formatter={(value: number) => [
                                      `${value}m`,
                                      "Elevation",
                                    ]}
                                    contentStyle={{
                                      background: "rgba(20, 20, 22, 0.9)",
                                      border:
                                        "1px solid rgba(255, 255, 255, 0.1)",
                                      borderRadius: "8px",
                                      color: "white",
                                    }}
                                  />
                                  <Area
                                    type="monotone"
                                    dataKey="elevation"
                                    stroke={getSportColor(route.sport)}
                                    fillOpacity={1}
                                    fill="url(#elevationGradient)"
                                    strokeWidth={2}
                                  />
                                </AreaChart>
                              </ResponsiveContainer>
                            </ElevationChart>
                          )}

                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr",
                            gap: "8px",
                          }}
                        >
                          <StatCard>
                            <StatValue>{route.stats.distance}km</StatValue>
                            <StatLabel>Distance</StatLabel>
                          </StatCard>
                          <StatCard>
                            <StatValue>
                              {formatDuration(route.stats.duration)}
                            </StatValue>
                            <StatLabel>Duration</StatLabel>
                          </StatCard>
                        </div>

                        <div
                          style={{
                            marginTop: "12px",
                            display: "flex",
                            justifyContent: "space-between",
                            fontSize: "0.75rem",
                            color: "#a0a0a0",
                          }}
                        >
                          <span>🔥 {route.stats.calories} cal</span>
                          <span>↗ {route.stats.elevationGain}m</span>
                          {route.stats.avgHeartRate && (
                            <span>💗 {route.stats.avgHeartRate} bpm</span>
                          )}
                        </div>
                      </RouteCard>
                    ))
                  )}
                </RoutesList>
              </RoutesSidebar>
            )}
          </AnimatePresence>

          <ControlsBar
            $isMobile={isMobile}
            $showRoutesList={showRoutesList}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <ControlsGrid $isMobile={isMobile}>
              <select
                value={sportFilter}
                onChange={(e) => setSportFilter(e.target.value)}
                style={{
                  padding: "10px 14px",
                  borderRadius: "10px",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  fontSize: "0.875rem",
                  fontWeight: "500",
                  background: "rgba(255, 255, 255, 0.1)",
                  backdropFilter: "blur(10px)",
                  color: "#ffffff",
                  cursor: "pointer",
                  outline: "none",
                }}
              >
                <option value="all">🏃‍♂️ All Sports</option>
                <option value="running">🏃‍♂️ Running</option>
                <option value="cycling">🚴‍♂️ Cycling</option>
                <option value="hiking">🥾 Hiking</option>
                <option value="walking">🚶‍♂️ Walking</option>
              </select>

              <PremiumButton
                onClick={() => setShowRoutesList(!showRoutesList)}
                $variant={showRoutesList ? "primary" : "secondary"}
                $active={showRoutesList}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                📂 Routes ({savedRoutes.length})
              </PremiumButton>

              <PremiumButton
                onClick={saveCurrentRoute}
                $variant="success"
                $disabled={path.length < 2}
                whileHover={{ scale: path.length >= 2 ? 1.02 : 1 }}
                whileTap={{ scale: path.length >= 2 ? 0.98 : 1 }}
              >
                💾 Save Route
              </PremiumButton>

              {savedRoutes.length === 0 && !isLoading && (
                <PremiumButton
                  onClick={seedTestData}
                  $variant="primary"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  🎯 Load Premium Data
                </PremiumButton>
              )}

              {selectedRoute && (
                <PremiumButton
                  onClick={() => {
                    setSelectedRoute(null);
                    setPath([]);
                  }}
                  $variant="danger"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  ✖️ Clear
                </PremiumButton>
              )}
            </ControlsGrid>
          </ControlsBar>

          {/* Premium Map Container */}
          <div
            style={{
              height: "100%",
              borderRadius: "16px",
              overflow: "hidden",
              position: "relative",
            }}
          >
            <MapContainer
              center={[45.5017, -73.5673]}
              zoom={14}
              scrollWheelZoom
              style={{ width: "100%", height: "100%" }}
              ref={mapRef}
            >
              {/* Premium Dark Map Tiles */}
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                attribution="© CartoDB"
                className="premium-tiles"
              />

              {/* Route Creation */}
              {!selectedRoute && <RouteCreator setPath={setPath} />}

              {/* Current Path Markers */}
              {!selectedRoute &&
                path.map((position, idx) => (
                  <Marker
                    key={idx}
                    position={position}
                    icon={createPremiumMarker("path")}
                  >
                    <Popup>
                      <div
                        style={{
                          color: "#8b5cf6",
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

              {/* Current Path Line */}
              {!selectedRoute && path.length > 1 && (
                <Polyline
                  positions={path}
                  color="#00d4ff"
                  weight={3}
                  opacity={0.9}
                  dashArray="5, 10"
                  className="creating-route"
                />
              )}

              {/* All Saved Routes */}
              {filteredRoutes.map((route) => (
                <motion.g key={route.id}>
                  <Polyline
                    positions={route.coordinates.map((coord) => [
                      coord.lat,
                      coord.lng,
                    ])}
                    color={getSportColor(route.sport)}
                    weight={selectedRoute?.id === route.id ? 4 : 2}
                    opacity={selectedRoute?.id === route.id ? 1 : 0.7}
                    dashArray={
                      selectedRoute?.id === route.id ? undefined : "3, 3"
                    }
                    eventHandlers={{
                      click: () => handleRouteClick(route),
                      mouseover: (e) => {
                        e.target.setStyle({ weight: 4, opacity: 1 });
                      },
                      mouseout: (e) => {
                        if (selectedRoute?.id !== route.id) {
                          e.target.setStyle({ weight: 2, opacity: 0.7 });
                        }
                      },
                    }}
                  />
                </motion.g>
              ))}

              {/* Start/End Markers for Selected Route */}
              {selectedRoute && selectedRoute.coordinates.length > 0 && (
                <>
                  <Marker
                    position={[
                      selectedRoute.coordinates[0].lat,
                      selectedRoute.coordinates[0].lng,
                    ]}
                    icon={createPremiumMarker("start")}
                  >
                    <Popup>
                      <div
                        style={{
                          textAlign: "center",
                          fontWeight: "600",
                          color: "white",
                        }}
                      >
                        <div style={{ fontSize: "20px", marginBottom: "8px" }}>
                          🚀
                        </div>
                        <strong>Start</strong>
                        <br />
                        <small>{selectedRoute.name}</small>
                      </div>
                    </Popup>
                  </Marker>
                  <Marker
                    position={[
                      selectedRoute.coordinates[
                        selectedRoute.coordinates.length - 1
                      ].lat,
                      selectedRoute.coordinates[
                        selectedRoute.coordinates.length - 1
                      ].lng,
                    ]}
                    icon={createPremiumMarker("end")}
                  >
                    <Popup>
                      <div
                        style={{
                          textAlign: "center",
                          fontWeight: "600",
                          color: "white",
                        }}
                      >
                        <div style={{ fontSize: "20px", marginBottom: "8px" }}>
                          🏁
                        </div>
                        <strong>Finish</strong>
                        <br />
                        <small>
                          Distance: {selectedRoute.stats.distance}km
                        </small>
                      </div>
                    </Popup>
                  </Marker>
                </>
              )}

              {/* Route Analytics Overlay */}
              {selectedRoute && (
                <RouteAnalyticsOverlay
                  route={selectedRoute}
                  isMobile={isMobile}
                />
              )}
            </MapContainer>
          </div>
        </MainContainer>
      </MapContainer_SC>
    </>
  );
};

export default AdvancedMapPremium;
