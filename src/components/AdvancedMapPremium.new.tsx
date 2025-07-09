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

// Enhanced Types
interface RouteCoordinate {
  lat: number;
  lng: number;
  elevation?: number;
  timestamp?: string;
  speed?: number;
  heartRate?: number;
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

interface RouteWaypoint {
  lat: number;
  lng: number;
  type: "start" | "end" | "waypoint";
  name?: string;
}

// Global Styles for Premium Map
const GlobalMapStyles = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
  
  .leaflet-container {
    background: linear-gradient(135deg, #000000 0%, #1a1a1a 100%) !important;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif !important;
  }
  
  .leaflet-tile {
    filter: brightness(0.3) contrast(1.8) saturate(0.8) hue-rotate(200deg) !important;
    transition: all 0.3s ease !important;
  }
  
  .leaflet-control-zoom {
    border: none !important;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6) !important;
  }
  
  .leaflet-control-zoom a {
    background: rgba(15, 15, 15, 0.95) !important;
    color: #ffffff !important;
    border: 1px solid rgba(255, 255, 255, 0.1) !important;
    backdrop-filter: blur(20px) !important;
    font-weight: 600 !important;
    font-size: 16px !important;
    border-radius: 8px !important;
    margin: 2px !important;
    transition: all 0.2s ease !important;
  }
  
  .leaflet-control-zoom a:hover {
    background: rgba(59, 130, 246, 0.9) !important;
    border-color: rgba(59, 130, 246, 0.3) !important;
    transform: scale(1.05) !important;
  }
  
  .leaflet-popup-content-wrapper {
    background: rgba(15, 15, 15, 0.95) !important;
    color: #ffffff !important;
    border-radius: 16px !important;
    backdrop-filter: blur(20px) !important;
    border: 1px solid rgba(255, 255, 255, 0.1) !important;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6) !important;
    font-family: 'Inter', sans-serif !important;
  }
  
  .leaflet-popup-tip {
    background: rgba(15, 15, 15, 0.95) !important;
    border: 1px solid rgba(255, 255, 255, 0.1) !important;
  }
  
  .leaflet-popup-close-button {
    color: #ffffff !important;
    font-size: 16px !important;
    font-weight: 600 !important;
  }
  
  .leaflet-popup-close-button:hover {
    color: #ef4444 !important;
  }
  
  .leaflet-routing-container {
    display: none !important;
  }
`;

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const slideIn = keyframes`
  from { transform: translateX(-100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.02); }
`;

const glow = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.3); }
  50% { box-shadow: 0 0 30px rgba(59, 130, 246, 0.6); }
`;

// Main Container
const MapWrapper = styled.div`
  width: 100%;
  height: calc(100vh - 140px);
  background: linear-gradient(135deg, #000000 0%, #0a0a0a 100%);
  font-family: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
  position: relative;
  overflow: hidden;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
`;

// Header
const Header = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: linear-gradient(
    135deg,
    rgba(0, 0, 0, 0.9) 0%,
    rgba(10, 10, 10, 0.95) 100%
  );
  backdrop-filter: blur(20px);
  padding: 20px;
  text-align: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 800;
  color: #ffffff;
  margin: 0 0 8px 0;
  letter-spacing: -0.02em;
  background: linear-gradient(135deg, #ffffff 0%, #3b82f6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Subtitle = styled.p`
  color: #a0a0a0;
  font-size: 1rem;
  margin: 0;
  font-weight: 500;
  letter-spacing: 0.01em;
`;

// Smart Controls Panel
const ControlsPanel = styled(motion.div)<{ $isMobile?: boolean }>`
  position: absolute;
  top: 120px;
  left: 20px;
  right: 20px;
  z-index: 1001;
  background: rgba(15, 15, 15, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6);
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
  justify-content: center;

  @media (max-width: 768px) {
    left: 12px;
    right: 12px;
    top: 100px;
    padding: 12px;
    gap: 8px;
  }
`;

const ModeToggle = styled(motion.div)`
  display: flex;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 4px;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const ModeButton = styled(motion.button)<{ $active?: boolean }>`
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  background: ${(props) =>
    props.$active ? "rgba(59, 130, 246, 0.9)" : "transparent"};
  color: ${(props) => (props.$active ? "#ffffff" : "#a0a0a0")};
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${(props) =>
      props.$active ? "rgba(59, 130, 246, 1)" : "rgba(255, 255, 255, 0.1)"};
    color: #ffffff;
  }
`;

const SmartButton = styled(motion.button)<{
  $variant?: "primary" | "secondary" | "success" | "danger" | "warning";
  $disabled?: boolean;
}>`
  padding: 10px 16px;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: ${(props) => (props.$disabled ? "not-allowed" : "pointer")};
  transition: all 0.2s ease;
  backdrop-filter: blur(10px);

  background: ${(props) => {
    if (props.$disabled) return "rgba(128, 128, 128, 0.3)";
    switch (props.$variant) {
      case "primary":
        return "rgba(59, 130, 246, 0.9)";
      case "success":
        return "rgba(16, 185, 129, 0.9)";
      case "danger":
        return "rgba(239, 68, 68, 0.9)";
      case "warning":
        return "rgba(245, 158, 11, 0.9)";
      default:
        return "rgba(255, 255, 255, 0.1)";
    }
  }};

  color: ${(props) => (props.$disabled ? "#666666" : "#ffffff")};

  border: 1px solid
    ${(props) => {
      if (props.$disabled) return "rgba(128, 128, 128, 0.2)";
      switch (props.$variant) {
        case "primary":
          return "rgba(59, 130, 246, 0.3)";
        case "success":
          return "rgba(16, 185, 129, 0.3)";
        case "danger":
          return "rgba(239, 68, 68, 0.3)";
        case "warning":
          return "rgba(245, 158, 11, 0.3)";
        default:
          return "rgba(255, 255, 255, 0.2)";
      }
    }};

  &:hover {
    ${(props) =>
      !props.$disabled &&
      `
      transform: translateY(-1px);
      box-shadow: 0 4px 16px rgba(59, 130, 246, 0.3);
    `}
  }
`;

// Smart Sidebar
const SmartSidebar = styled(motion.div)<{ $isMobile?: boolean }>`
  position: absolute;
  top: 200px;
  left: 20px;
  width: ${(props) => (props.$isMobile ? "280px" : "360px")};
  max-height: calc(100vh - 320px);
  background: rgba(15, 15, 15, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
  z-index: 1002;
  overflow: hidden;

  @media (max-width: 768px) {
    left: 12px;
    width: calc(100% - 24px);
    max-height: 400px;
  }
`;

const SidebarHeader = styled.div`
  padding: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const SidebarTitle = styled.h3`
  margin: 0;
  font-size: 1.125rem;
  font-weight: 700;
  color: #ffffff;
`;

const SidebarContent = styled.div`
  max-height: 400px;
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

// Route Analytics Panel
const AnalyticsPanel = styled(motion.div)<{ $isMobile?: boolean }>`
  position: absolute;
  top: 200px;
  right: 20px;
  width: ${(props) => (props.$isMobile ? "280px" : "360px")};
  max-height: calc(100vh - 320px);
  background: rgba(15, 15, 15, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
  z-index: 1003;
  overflow: hidden;

  @media (max-width: 768px) {
    right: 12px;
    width: calc(100% - 24px);
    max-height: 400px;
    top: 500px;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  padding: 16px;
`;

const StatCard = styled(motion.div)<{ $color?: string }>`
  background: ${(props) =>
    props.$color
      ? `linear-gradient(135deg, ${props.$color}20 0%, ${props.$color}10 100%)`
      : "rgba(255, 255, 255, 0.08)"};
  border: 1px solid
    ${(props) =>
      props.$color ? `${props.$color}40` : "rgba(255, 255, 255, 0.1)"};
  border-radius: 12px;
  padding: 16px;
  text-align: center;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
  }
`;

const StatValue = styled.div<{ $color?: string }>`
  font-size: 1.5rem;
  font-weight: 800;
  color: ${(props) => props.$color || "#ffffff"};
  margin-bottom: 4px;
`;

const StatLabel = styled.div`
  font-size: 0.75rem;
  color: #a0a0a0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 600;
`;

const RouteCard = styled(motion.div)<{ $selected?: boolean; $color?: string }>`
  margin: 12px 16px;
  padding: 16px;
  background: ${(props) =>
    props.$selected
      ? `linear-gradient(135deg, ${props.$color}20 0%, ${props.$color}10 100%)`
      : "rgba(255, 255, 255, 0.08)"};
  border: 2px solid
    ${(props) => (props.$selected ? props.$color : "rgba(255, 255, 255, 0.1)")};
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    background: ${(props) =>
      props.$selected
        ? `linear-gradient(135deg, ${props.$color}30 0%, ${props.$color}15 100%)`
        : "rgba(255, 255, 255, 0.12)"};
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
  }
`;

// Helper Functions
const calculateDistance = (coords: [number, number][]): number => {
  if (coords.length < 2) return 0;

  let totalDistance = 0;
  for (let i = 1; i < coords.length; i++) {
    const [lat1, lng1] = coords[i - 1];
    const [lat2, lng2] = coords[i];

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

// Enhanced Route Creator with Smart Path Generation
const RouteCreator: React.FC<{
  mode: "create" | "view";
  waypoints: RouteWaypoint[];
  setWaypoints: React.Dispatch<React.SetStateAction<RouteWaypoint[]>>;
  setRouteGeometry: React.Dispatch<React.SetStateAction<[number, number][]>>;
}> = ({ mode, waypoints, setWaypoints, setRouteGeometry }) => {
  const map = useMapEvents({
    click(e) {
      if (mode !== "create") return;

      const newWaypoint: RouteWaypoint = {
        lat: e.latlng.lat,
        lng: e.latlng.lng,
        type: waypoints.length === 0 ? "start" : "waypoint",
      };

      setWaypoints((prev) => [...prev, newWaypoint]);
    },
  });

  // Generate smart route geometry when waypoints change
  useEffect(() => {
    if (waypoints.length < 2) {
      setRouteGeometry([]);
      return;
    }

    // Create a more intelligent path by adding intermediate points
    const generateSmartPath = (
      waypoints: RouteWaypoint[]
    ): [number, number][] => {
      const path: [number, number][] = [];

      for (let i = 0; i < waypoints.length - 1; i++) {
        const start = waypoints[i];
        const end = waypoints[i + 1];

        // Add start point
        path.push([start.lat, start.lng]);

        // Add intermediate points to simulate road following
        const steps = 5;
        for (let j = 1; j < steps; j++) {
          const ratio = j / steps;
          const lat = start.lat + (end.lat - start.lat) * ratio;
          const lng = start.lng + (end.lng - start.lng) * ratio;

          // Add slight curve to simulate road paths
          const curveFactor = 0.0005;
          const curveOffset = Math.sin(ratio * Math.PI) * curveFactor;

          path.push([lat + curveOffset, lng + curveOffset]);
        }
      }

      // Add final point
      if (waypoints.length > 1) {
        const lastWaypoint = waypoints[waypoints.length - 1];
        path.push([lastWaypoint.lat, lastWaypoint.lng]);
      }

      return path;
    };

    const smartPath = generateSmartPath(waypoints);
    setRouteGeometry(smartPath);
  }, [waypoints, setRouteGeometry]);

  return null;
};

// Enhanced Premium Markers
const createPremiumMarker = (
  type: "start" | "end" | "waypoint",
  color: string = "#3b82f6"
): L.Icon => {
  const iconMap = {
    start: "🚀",
    end: "🏁",
    waypoint: "📍",
  };

  return new L.Icon({
    iconUrl: `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'>
      <defs>
        <linearGradient id='gradient' x1='0%' y1='0%' x2='100%' y2='100%'>
          <stop offset='0%' style='stop-color:${color};stop-opacity:1' />
          <stop offset='100%' style='stop-color:${color}80;stop-opacity:1' />
        </linearGradient>
        <filter id='glow'>
          <feGaussianBlur stdDeviation='3' result='coloredBlur'/>
          <feMerge>
            <feMergeNode in='coloredBlur'/>
            <feMergeNode in='SourceGraphic'/>
          </feMerge>
        </filter>
      </defs>
      <circle cx='20' cy='20' r='16' fill='url(#gradient)' filter='url(#glow)' stroke='white' stroke-width='2'/>
      <circle cx='20' cy='20' r='8' fill='white' opacity='0.9'/>
      <text x='20' y='25' text-anchor='middle' font-family='Arial' font-size='12' font-weight='bold' fill='${color}'>${iconMap[type]}</text>
    </svg>`,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20],
  });
};

// Premium Sample Routes
const PREMIUM_ROUTES: Route[] = [
  {
    id: "route_1",
    name: "Elite Central Park Loop",
    sport: "running",
    date: "2025-07-05",
    stats: {
      distance: 6.2,
      duration: 1800,
      avgPace: "4:52",
      avgSpeed: 12.4,
      elevationGain: 98,
      elevationLoss: 95,
      calories: 420,
      steps: 8240,
      maxSpeed: 16.8,
      avgHeartRate: 168,
    },
    coordinates: [
      { lat: 40.7829, lng: -73.9654, elevation: 65 },
      { lat: 40.7851, lng: -73.9665, elevation: 72 },
      { lat: 40.7876, lng: -73.9698, elevation: 85 },
      { lat: 40.7892, lng: -73.9732, elevation: 94 },
      { lat: 40.7903, lng: -73.9765, elevation: 102 },
      { lat: 40.7889, lng: -73.9798, elevation: 88 },
      { lat: 40.7864, lng: -73.9812, elevation: 76 },
      { lat: 40.7839, lng: -73.9798, elevation: 71 },
      { lat: 40.7829, lng: -73.9654, elevation: 65 },
    ],
    weather: {
      temperature: 22,
      condition: "Partly Cloudy",
      humidity: 58,
    },
  },
  {
    id: "route_2",
    name: "Brooklyn Bridge Cycling",
    sport: "cycling",
    date: "2025-07-03",
    stats: {
      distance: 18.5,
      duration: 2700,
      avgPace: "2:26",
      avgSpeed: 24.7,
      elevationGain: 156,
      elevationLoss: 142,
      calories: 680,
      steps: 0,
      maxSpeed: 38.2,
      avgHeartRate: 145,
    },
    coordinates: [
      { lat: 40.7061, lng: -73.9969, elevation: 15 },
      { lat: 40.7081, lng: -73.9959, elevation: 25 },
      { lat: 40.7101, lng: -73.9939, elevation: 45 },
      { lat: 40.7121, lng: -73.9909, elevation: 35 },
      { lat: 40.7141, lng: -73.9879, elevation: 20 },
      { lat: 40.7161, lng: -73.9849, elevation: 18 },
    ],
    weather: {
      temperature: 25,
      condition: "Sunny",
      humidity: 42,
    },
  },
];

// Main Component
const AdvancedMapPremium: React.FC = () => {
  const [mode, setMode] = useState<"create" | "view">("view");
  const [waypoints, setWaypoints] = useState<RouteWaypoint[]>([]);
  const [routeGeometry, setRouteGeometry] = useState<[number, number][]>([]);
  const [savedRoutes, setSavedRoutes] = useState<Route[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [sportFilter, setSportFilter] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Load premium routes
  useEffect(() => {
    setSavedRoutes(PREMIUM_ROUTES);
  }, []);

  // Filtered routes
  const filteredRoutes = useMemo(() => {
    return savedRoutes.filter(
      (route) => sportFilter === "all" || route.sport === sportFilter
    );
  }, [savedRoutes, sportFilter]);

  // Handle route selection
  const handleRouteClick = useCallback((route: Route) => {
    setSelectedRoute(route);
    setShowAnalytics(true);
    setMode("view");
    setWaypoints([]);
    setRouteGeometry([]);
  }, []);

  // Create new route
  const handleCreateRoute = useCallback(() => {
    setMode("create");
    setSelectedRoute(null);
    setShowAnalytics(false);
    setWaypoints([]);
    setRouteGeometry([]);
  }, []);

  // Save route
  const handleSaveRoute = useCallback(async () => {
    if (routeGeometry.length < 2) {
      alert("Please create a route with at least 2 waypoints");
      return;
    }

    const newRoute: Route = {
      id: `route_${Date.now()}`,
      name: `Custom Route ${savedRoutes.length + 1}`,
      sport: "running",
      date: new Date().toISOString().split("T")[0],
      stats: {
        distance: calculateDistance(routeGeometry),
        duration: Math.floor(Math.random() * 3600) + 600,
        avgPace: "5:30",
        avgSpeed: 10.8,
        elevationGain: Math.floor(Math.random() * 150) + 50,
        elevationLoss: Math.floor(Math.random() * 120) + 40,
        calories: Math.floor(Math.random() * 400) + 200,
        steps: Math.floor(Math.random() * 6000) + 2000,
        maxSpeed: Math.floor(Math.random() * 10) + 12,
        avgHeartRate: Math.floor(Math.random() * 30) + 150,
      },
      coordinates: routeGeometry.map(([lat, lng]) => ({
        lat,
        lng,
        elevation: 50 + Math.random() * 100,
      })),
      weather: {
        temperature: 18 + Math.random() * 10,
        condition: "Clear",
        humidity: 40 + Math.random() * 30,
      },
    };

    setSavedRoutes((prev) => [newRoute, ...prev]);
    setSelectedRoute(newRoute);
    setShowAnalytics(true);
    setMode("view");
    setWaypoints([]);
    setRouteGeometry([]);

    alert(`Route saved: ${newRoute.stats.distance}km`);
  }, [routeGeometry, savedRoutes]);

  // Clear route
  const handleClearRoute = useCallback(() => {
    setSelectedRoute(null);
    setShowAnalytics(false);
    setWaypoints([]);
    setRouteGeometry([]);
    setMode("view");
  }, []);

  return (
    <>
      <GlobalMapStyles />
      <MapWrapper>
        <Header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Title>Waypoint Premium</Title>
          <Subtitle>
            Professional route tracking with intelligent path optimization
          </Subtitle>
        </Header>

        <ControlsPanel
          $isMobile={isMobile}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <ModeToggle>
            <ModeButton
              $active={mode === "view"}
              onClick={() => setMode("view")}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              👁️ View Routes
            </ModeButton>
            <ModeButton
              $active={mode === "create"}
              onClick={handleCreateRoute}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              ✏️ Create Route
            </ModeButton>
          </ModeToggle>

          <select
            value={sportFilter}
            onChange={(e) => setSportFilter(e.target.value)}
            style={{
              padding: "10px 12px",
              borderRadius: "10px",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              background: "rgba(255, 255, 255, 0.1)",
              color: "#ffffff",
              fontSize: "0.875rem",
              fontWeight: "500",
              outline: "none",
              cursor: "pointer",
            }}
          >
            <option value="all">🏃‍♂️ All Sports</option>
            <option value="running">🏃‍♂️ Running</option>
            <option value="cycling">🚴‍♂️ Cycling</option>
            <option value="hiking">🥾 Hiking</option>
            <option value="walking">🚶‍♂️ Walking</option>
          </select>

          <SmartButton
            $variant="primary"
            onClick={() => setShowSidebar(!showSidebar)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            📂 Routes ({filteredRoutes.length})
          </SmartButton>

          {mode === "create" && (
            <SmartButton
              $variant="success"
              $disabled={routeGeometry.length < 2}
              onClick={handleSaveRoute}
              whileHover={{ scale: routeGeometry.length >= 2 ? 1.02 : 1 }}
              whileTap={{ scale: routeGeometry.length >= 2 ? 0.98 : 1 }}
            >
              💾 Save Route
            </SmartButton>
          )}

          {(selectedRoute || waypoints.length > 0) && (
            <SmartButton
              $variant="danger"
              onClick={handleClearRoute}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              🗑️ Clear
            </SmartButton>
          )}
        </ControlsPanel>

        <AnimatePresence>
          {showSidebar && (
            <SmartSidebar
              $isMobile={isMobile}
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -100, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <SidebarHeader>
                <SidebarTitle>My Routes</SidebarTitle>
                <SmartButton
                  $variant="danger"
                  onClick={() => setShowSidebar(false)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  ✕
                </SmartButton>
              </SidebarHeader>

              <SidebarContent>
                {filteredRoutes.map((route) => (
                  <RouteCard
                    key={route.id}
                    $selected={selectedRoute?.id === route.id}
                    $color={getSportColor(route.sport)}
                    onClick={() => handleRouteClick(route)}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "12px",
                      }}
                    >
                      <h4
                        style={{
                          margin: 0,
                          color: "#ffffff",
                          fontSize: "1rem",
                          fontWeight: "600",
                        }}
                      >
                        {route.name}
                      </h4>
                      <span
                        style={{
                          padding: "4px 8px",
                          borderRadius: "12px",
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

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "8px",
                        marginBottom: "8px",
                      }}
                    >
                      <div style={{ textAlign: "center" }}>
                        <div style={{ fontWeight: "700", color: "#ffffff" }}>
                          {route.stats.distance}km
                        </div>
                        <div style={{ fontSize: "0.75rem", color: "#a0a0a0" }}>
                          Distance
                        </div>
                      </div>
                      <div style={{ textAlign: "center" }}>
                        <div style={{ fontWeight: "700", color: "#ffffff" }}>
                          {formatDuration(route.stats.duration)}
                        </div>
                        <div style={{ fontSize: "0.75rem", color: "#a0a0a0" }}>
                          Duration
                        </div>
                      </div>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: "0.75rem",
                        color: "#a0a0a0",
                      }}
                    >
                      <span>🔥 {route.stats.calories} cal</span>
                      <span>↗ {route.stats.elevationGain}m</span>
                      <span>💗 {route.stats.avgHeartRate} bpm</span>
                    </div>
                  </RouteCard>
                ))}
              </SidebarContent>
            </SmartSidebar>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showAnalytics && selectedRoute && (
            <AnalyticsPanel
              $isMobile={isMobile}
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 100, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <SidebarHeader>
                <SidebarTitle>Route Analytics</SidebarTitle>
                <SmartButton
                  $variant="danger"
                  onClick={() => setShowAnalytics(false)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  ✕
                </SmartButton>
              </SidebarHeader>

              <div style={{ padding: "16px" }}>
                <div style={{ marginBottom: "16px" }}>
                  <h4
                    style={{
                      margin: "0 0 8px 0",
                      color: "#ffffff",
                      fontSize: "1.1rem",
                    }}
                  >
                    {selectedRoute.name}
                  </h4>
                  <div style={{ fontSize: "0.875rem", color: "#a0a0a0" }}>
                    📅 {new Date(selectedRoute.date).toLocaleDateString()}
                  </div>
                  {selectedRoute.weather && (
                    <div
                      style={{
                        fontSize: "0.875rem",
                        color: "#a0a0a0",
                        marginTop: "4px",
                      }}
                    >
                      🌡️ {selectedRoute.weather.temperature}°C •{" "}
                      {selectedRoute.weather.condition}
                    </div>
                  )}
                </div>

                <StatsGrid>
                  <StatCard $color="#3b82f6">
                    <StatValue $color="#3b82f6">
                      {selectedRoute.stats.distance}
                    </StatValue>
                    <StatLabel>Kilometers</StatLabel>
                  </StatCard>
                  <StatCard $color="#f59e0b">
                    <StatValue $color="#f59e0b">
                      {formatDuration(selectedRoute.stats.duration)}
                    </StatValue>
                    <StatLabel>Duration</StatLabel>
                  </StatCard>
                  <StatCard $color="#10b981">
                    <StatValue $color="#10b981">
                      {selectedRoute.stats.avgPace}
                    </StatValue>
                    <StatLabel>Avg Pace</StatLabel>
                  </StatCard>
                  <StatCard $color="#ef4444">
                    <StatValue $color="#ef4444">
                      {selectedRoute.stats.elevationGain}m
                    </StatValue>
                    <StatLabel>Elevation</StatLabel>
                  </StatCard>
                </StatsGrid>

                <div style={{ marginTop: "16px" }}>
                  <h5
                    style={{
                      margin: "0 0 8px 0",
                      color: "#ffffff",
                      fontSize: "0.9rem",
                    }}
                  >
                    Elevation Profile
                  </h5>
                  <div
                    style={{
                      height: "120px",
                      background: "rgba(255, 255, 255, 0.05)",
                      borderRadius: "8px",
                      padding: "8px",
                    }}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={selectedRoute.coordinates.map((coord, index) => ({
                          distance:
                            (index / selectedRoute.coordinates.length) *
                            selectedRoute.stats.distance,
                          elevation: coord.elevation || 0,
                        }))}
                      >
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
                              stopColor={getSportColor(selectedRoute.sport)}
                              stopOpacity={0.8}
                            />
                            <stop
                              offset="95%"
                              stopColor={getSportColor(selectedRoute.sport)}
                              stopOpacity={0.1}
                            />
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="distance" hide />
                        <YAxis hide />
                        <Tooltip
                          labelFormatter={(value) => `${value.toFixed(1)}km`}
                          formatter={(value: number) => [
                            `${value}m`,
                            "Elevation",
                          ]}
                          contentStyle={{
                            background: "rgba(15, 15, 15, 0.9)",
                            border: "1px solid rgba(255, 255, 255, 0.1)",
                            borderRadius: "8px",
                            color: "white",
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="elevation"
                          stroke={getSportColor(selectedRoute.sport)}
                          fillOpacity={1}
                          fill="url(#elevationGradient)"
                          strokeWidth={2}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </AnalyticsPanel>
          )}
        </AnimatePresence>

        <MapContainer
          center={[40.7829, -73.9654]}
          zoom={13}
          style={{
            width: "100%",
            height: "100%",
            borderRadius: "20px",
          }}
          scrollWheelZoom={true}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution="© CartoDB"
          />

          <RouteCreator
            mode={mode}
            waypoints={waypoints}
            setWaypoints={setWaypoints}
            setRouteGeometry={setRouteGeometry}
          />

          {/* Current route being created */}
          {mode === "create" && routeGeometry.length > 1 && (
            <Polyline
              positions={routeGeometry}
              color="#00d4ff"
              weight={4}
              opacity={0.9}
              dashArray="10, 5"
              className="creating-route"
            />
          )}

          {/* Waypoint markers */}
          {waypoints.map((waypoint, index) => (
            <Marker
              key={index}
              position={[waypoint.lat, waypoint.lng]}
              icon={createPremiumMarker(
                index === 0
                  ? "start"
                  : index === waypoints.length - 1 && waypoints.length > 1
                  ? "end"
                  : "waypoint"
              )}
            >
              <Popup>
                <div style={{ textAlign: "center", color: "white" }}>
                  <strong>
                    {index === 0
                      ? "Start"
                      : index === waypoints.length - 1
                      ? "End"
                      : `Waypoint ${index + 1}`}
                  </strong>
                  <br />
                  <small>
                    {waypoint.lat.toFixed(6)}, {waypoint.lng.toFixed(6)}
                  </small>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Saved routes */}
          {filteredRoutes.map((route) => (
            <Polyline
              key={route.id}
              positions={route.coordinates.map((coord) => [
                coord.lat,
                coord.lng,
              ])}
              color={getSportColor(route.sport)}
              weight={selectedRoute?.id === route.id ? 4 : 2}
              opacity={selectedRoute?.id === route.id ? 1 : 0.7}
              dashArray={selectedRoute?.id === route.id ? undefined : "5, 10"}
              eventHandlers={{
                click: () => handleRouteClick(route),
              }}
            />
          ))}

          {/* Selected route markers */}
          {selectedRoute && selectedRoute.coordinates.length > 0 && (
            <>
              <Marker
                position={[
                  selectedRoute.coordinates[0].lat,
                  selectedRoute.coordinates[0].lng,
                ]}
                icon={createPremiumMarker(
                  "start",
                  getSportColor(selectedRoute.sport)
                )}
              >
                <Popup>
                  <div style={{ textAlign: "center", color: "white" }}>
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
                icon={createPremiumMarker(
                  "end",
                  getSportColor(selectedRoute.sport)
                )}
              >
                <Popup>
                  <div style={{ textAlign: "center", color: "white" }}>
                    <div style={{ fontSize: "20px", marginBottom: "8px" }}>
                      🏁
                    </div>
                    <strong>Finish</strong>
                    <br />
                    <small>Distance: {selectedRoute.stats.distance}km</small>
                  </div>
                </Popup>
              </Marker>
            </>
          )}
        </MapContainer>
      </MapWrapper>
    </>
  );
};

export default AdvancedMapPremium;
