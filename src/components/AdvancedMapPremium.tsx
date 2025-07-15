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
  useMap,
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

// Fix Leaflet default icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJDOC4xIDIgNSA1LjEgNSA5QzUgMTQgMTIgMjIgMTIgMjJTMTkgMTQgMTkgOUMxOSA1LjEgMTUuOSAyIDEyIDJaTTEyIDExQzEwLjkgMTEgMTAgMTAuMSAxMCA5UzEwLjkgNyAxMiA3UzE0IDcuOSAxNCA5UzEzLjEgMTEgMTIgMTFaIiBmaWxsPSIjMzMzNzMzIi8+Cjwvc3ZnPgo=",
  iconUrl:
    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1zbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJDOC4xIDIgNSA1LjEgNSA5QzUgMTQgMTIgMjIgMTIgMjJTMTkgMTQgMTkgOUMxOSA1LjEgMTUuOSAyIDEyIDJaTTEyIDExQzEwLjkgMTEgMTAgMTAuMSAxMCA5UzEwLjkgNyAxMiA3UzE0IDcuOSAxNCA5UzEzLjEgMTEgMTIgMTFaIiBmaWxsPSIjMzMzNzMzIi8+Cjwvc3ZnPgo=",
  shadowUrl:
    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1zbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48L3N2Zz4K",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

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

interface MapStyle {
  name: string;
  url: string;
  attribution: string;
}

// Map Error Boundary Component
class MapErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: {
    children: React.ReactNode;
    fallback?: React.ReactNode;
  }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Map Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "400px",
              background: "rgba(15, 15, 15, 0.95)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              color: "#ffffff",
              textAlign: "center",
              padding: "20px",
            }}
          >
            <div>
              <h3 style={{ color: "#ef4444", marginBottom: "10px" }}>
                Map Error
              </h3>
              <p>Unable to load the map. Please refresh the page.</p>
              <button
                onClick={() => this.setState({ hasError: false })}
                style={{
                  marginTop: "10px",
                  padding: "8px 16px",
                  border: "none",
                  borderRadius: "8px",
                  background: "rgba(59, 130, 246, 0.9)",
                  color: "white",
                  cursor: "pointer",
                }}
              >
                Retry
              </button>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}

// Loading/Error Overlay Components
const LoadingOverlay = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
`;

const LoadingSpinner = styled.div`
  width: 50px;
  height: 50px;
  border: 3px solid rgba(255, 255, 255, 0.2);
  border-top: 3px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

// Route Distance Indicator
const RouteDistanceIndicator = styled(motion.div)<{ $visible: boolean }>`
  position: absolute;
  bottom: 20px;
  left: 20px;
  right: 20px;
  margin: 0 auto;
  max-width: 300px;
  background: rgba(15, 15, 15, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 12px 20px;
  color: #ffffff;
  font-weight: 600;
  font-size: 1rem;
  z-index: 1500;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6);
  display: ${(props) => (props.$visible ? "block" : "none")};
`;

// Fixed Dynamic Tile Layer Component
const DynamicTileLayer: React.FC<{ mapStyle: MapStyle }> = ({ mapStyle }) => {
  return (
    <TileLayer
      url={mapStyle.url}
      attribution={mapStyle.attribution}
      key={mapStyle.name}
    />
  );
  return null;
};

// Global Styles for Premium Map
const GlobalMapStyles = createGlobalStyle<{ $mapStyle?: string }>`
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
  
  .leaflet-container {
    background: ${(props) =>
      props.$mapStyle === "Light"
        ? "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)"
        : "linear-gradient(135deg, #000000 0%, #1a1a1a 100%)"} !important;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif !important;
  }
  
  .leaflet-tile {
    transition: all 0.3s ease !important;
  }
  
  .leaflet-control-zoom {
    border: none !important;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6) !important;
    position: absolute !important;
    top: 20px !important;
    right: 20px !important;
    left: auto !important;
    z-index: 1500 !important;
    border-radius: 12px !important;
    overflow: hidden !important;
    display: flex !important;
    flex-direction: column !important;
    gap: 2px !important;
  }
  
  .leaflet-control-zoom a {
    background: ${(props) =>
      props.$mapStyle === "Light"
        ? "rgba(255, 255, 255, 0.95)"
        : "rgba(15, 15, 15, 0.95)"} !important;
    color: ${(props) =>
      props.$mapStyle === "Light" ? "#000000" : "#ffffff"} !important;
    border: 1px solid ${(props) =>
      props.$mapStyle === "Light"
        ? "rgba(0, 0, 0, 0.1)"
        : "rgba(255, 255, 255, 0.1)"} !important;
    backdrop-filter: blur(20px) !important;
    font-weight: 700 !important;
    font-size: 18px !important;
    border-radius: 10px !important;
    margin: 0 !important;
    transition: all 0.2s ease !important;
    width: 40px !important;
    height: 40px !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    text-decoration: none !important;
    line-height: 1 !important;
  }
  
  .leaflet-control-zoom a:hover {
    background: rgba(59, 130, 246, 0.9) !important;
    border-color: rgba(59, 130, 246, 0.3) !important;
    color: #ffffff !important;
    transform: scale(1.1) !important;
    box-shadow: 0 4px 16px rgba(59, 130, 246, 0.4) !important;
  }

  .leaflet-control-zoom a:first-child {
    border-radius: 10px 10px 10px 10px !important;
  }

  .leaflet-control-zoom a:last-child {
    border-radius: 10px 10px 10px 10px !important;
  }
  
  .leaflet-popup-content-wrapper {
    background: ${(props) =>
      props.$mapStyle === "Light"
        ? "rgba(255, 255, 255, 0.95)"
        : "rgba(15, 15, 15, 0.95)"} !important;
    color: ${(props) =>
      props.$mapStyle === "Light" ? "#000000" : "#ffffff"} !important;
    border-radius: 16px !important;
    backdrop-filter: blur(20px) !important;
    border: 1px solid ${(props) =>
      props.$mapStyle === "Light"
        ? "rgba(0, 0, 0, 0.1)"
        : "rgba(255, 255, 255, 0.1)"} !important;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6) !important;
    font-family: 'Inter', sans-serif !important;
  }
  
  .leaflet-popup-tip {
    background: ${(props) =>
      props.$mapStyle === "Light"
        ? "rgba(255, 255, 255, 0.95)"
        : "rgba(15, 15, 15, 0.95)"} !important;
    border: 1px solid ${(props) =>
      props.$mapStyle === "Light"
        ? "rgba(0, 0, 0, 0.1)"
        : "rgba(255, 255, 255, 0.1)"} !important;
  }
  
  .leaflet-popup-close-button {
    color: ${(props) =>
      props.$mapStyle === "Light" ? "#000000" : "#ffffff"} !important;
    font-size: 16px !important;
    font-weight: 600 !important;
  }
  
  .leaflet-popup-close-button:hover {
    color: #ef4444 !important;
  }
  
  .leaflet-routing-container {
    display: none !important;
  }

  /* Premium Marker Styles */
  .premium-marker {
    transition: all 0.2s ease !important;
    z-index: 1000 !important;
  }
  
  .premium-marker:hover {
    transform: scale(1.1) !important;
    z-index: 1001 !important;
  }
  
  .premium-marker-start,
  .premium-marker-end {
    z-index: 1002 !important;
  }
  
  .premium-marker-waypoint {
    z-index: 999 !important;
  }

  /* Fix Leaflet marker shadow */
  .leaflet-marker-shadow {
    display: none !important;
  }

  /* Ensure markers are clickable */
  .leaflet-marker-icon {
    cursor: pointer !important;
  }

  /* Enhanced route styling */
  .creating-route {
    filter: drop-shadow(0 2px 4px rgba(255, 107, 53, 0.3)) !important;
    animation: pulse-route 2s ease-in-out infinite !important;
  }

  @keyframes pulse-route {
    0%, 100% {
      filter: drop-shadow(0 2px 4px rgba(255, 107, 53, 0.3));
    }
    50% {
      filter: drop-shadow(0 4px 8px rgba(255, 107, 53, 0.6));
    }
  }

  /* Route polylines with smooth rendering */
  .leaflet-pane .leaflet-overlay-pane svg {
    vector-effect: non-scaling-stroke;
  }

  /* Interactive route styling */
  .leaflet-interactive:hover {
    filter: drop-shadow(0 2px 6px rgba(255, 107, 53, 0.4));
    cursor: pointer;
  }

  /* Mobile scrolling improvements */
  @media (max-width: 768px) {
    .sidebar-content,
    .analytics-content {
      -webkit-overflow-scrolling: touch;
      scroll-behavior: smooth;
    }
  }

  /* Smooth scrolling for all browsers */
  * {
    scroll-behavior: smooth;
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
const MapWrapper = styled.div<{ $sidebarOpen: boolean; $isMobile: boolean }>`
  position: fixed;
  top: 70px;
  left: ${(props) =>
    props.$isMobile ? "0px" : props.$sidebarOpen ? "250px" : "0px"};
  right: 0;
  bottom: 70px;
  width: ${(props) =>
    props.$isMobile
      ? "100vw"
      : props.$sidebarOpen
      ? "calc(100vw - 250px)"
      : "100vw"};
  height: calc(100vh - 140px);
  background: linear-gradient(135deg, #000000 0%, #0a0a0a 100%);
  font-family: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
  transition: left 0.3s ease-in-out, width 0.3s ease-in-out;
  z-index: 1;

  @media (max-width: 768px) {
    left: 0px;
    width: 100vw;
    border-radius: 0;
    box-shadow: none;
    padding: 0;
    bottom: 70px;
  }
`;

// Header with blur and transparency
const Header = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(20px);
  padding: 20px;
  text-align: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 15px;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 800;
  color: #ffffff;
  margin: 0 0 8px 0;
  letter-spacing: -0.02em;
`;

const Subtitle = styled.p`
  color: #a0a0a0;
  font-size: 1rem;
  margin: 0;
  font-weight: 500;
  letter-spacing: 0.01em;
`;

// Success Alert Component
const SuccessAlert = styled(motion.div)<{ $visible: boolean }>`
  position: fixed;
  top: 16px;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: #ffffff;
  padding: 12px 20px;
  border-radius: 8px;
  font-weight: 500;
  font-size: 0.875rem;
  box-shadow: 0 4px 20px rgba(16, 185, 129, 0.25);
  border: 1px solid rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  z-index: 3000;
  display: ${(props) => (props.$visible ? "flex" : "none")};
  align-items: center;
  gap: 8px;
  max-width: 320px;

  @media (max-width: 768px) {
    top: 12px;
    left: 50%;
    transform: translateX(-50%);
    max-width: 280px;
  }
`;

// Smart Controls Panel
const ControlsPanel = styled(motion.div)<{ $isMobile?: boolean }>`
  position: absolute;
  top: 133px;
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
    top: 150px;
    max-width: 100vw;
  }
`;

const ModeToggle = styled(motion.div)`
  display: flex;
  background: rgba(255, 255, 255, 0.1);
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

// Custom dropdown container for better positioning
const DropdownContainer = styled.div`
  position: relative;
  display: inline-block;
`;

// Dropdown trigger button
const DropdownTrigger = styled(motion.button)<{ $isOpen?: boolean }>`
  position: relative;
  padding: 10px 12px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
  font-size: 0.875rem;
  font-weight: 500;
  outline: none;
  cursor: pointer;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;
  min-width: 140px;
  justify-content: space-between;

  &:after {
    content: "";
    width: 0;
    height: 0;
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
    border-top: 4px solid #ffffff;
    transform: ${(props) =>
      props.$isOpen ? "rotate(180deg)" : "rotate(0deg)"};
    transition: transform 0.2s ease;
  }

  &:focus {
    border-color: rgba(59, 130, 246, 0.5);
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
  }

  &:hover {
    border-color: rgba(59, 130, 246, 0.4);
    background: rgba(255, 255, 255, 0.15);
  }
`;

// Dropdown menu that appears directly below trigger
const DropdownMenu = styled(motion.div)<{ $isOpen?: boolean }>`
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  background: rgba(15, 15, 15, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6);
  z-index: 2000;
  overflow: hidden;
  display: ${(props) => (props.$isOpen ? "block" : "none")};
`;

// Individual dropdown option
const DropdownOption = styled(motion.div)<{ $selected?: boolean }>`
  padding: 12px 16px;
  color: #ffffff;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  background: ${(props) =>
    props.$selected ? "rgba(59, 130, 246, 0.2)" : "transparent"};
  border-left: ${(props) =>
    props.$selected ? "3px solid #3b82f6" : "3px solid transparent"};
  transition: all 0.2s ease;

  &:hover {
    background: rgba(59, 130, 246, 0.15);
    border-left-color: #3b82f6;
  }

  &:not(:last-child) {
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
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
  top: ${(props) => (props.$isMobile ? "190px" : "230px")};
  left: 20px;
  width: ${(props) => (props.$isMobile ? "280px" : "360px")};
  // max-height: calc(100vh - 360px);
  background: rgba(15, 15, 15, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
  z-index: 1002;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    left: 20px;
    right: 20px;
    width: auto;
    padding: 8px;
    top: 150px;
  }
`;

const SidebarHeader = styled.div`
  padding: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
`;

const SidebarTitle = styled.h3`
  margin: 0;
  font-size: 1.125rem;
  font-weight: 700;
  color: #ffffff;
`;

const SidebarContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 0;
  scroll-behavior: smooth;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 4px;
    margin: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.3),
      rgba(255, 255, 255, 0.2)
    );
    border-radius: 4px;
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  &::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.4),
      rgba(255, 255, 255, 0.3)
    );
  }

  &::-webkit-scrollbar-thumb:active {
    background: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.5),
      rgba(255, 255, 255, 0.4)
    );
  }

  /* Fade out effect at top and bottom when scrolling */
  &::before,
  &::after {
    content: "";
    position: sticky;
    left: 0;
    right: 0;
    height: 10px;
    background: linear-gradient(to bottom, rgba(15, 15, 15, 0.95), transparent);
    z-index: 1;
    pointer-events: none;
  }

  &::before {
    top: 0;
  }

  &::after {
    bottom: 0;
    background: linear-gradient(to top, rgba(15, 15, 15, 0.95), transparent);
  }
`;

// Route Analytics Panel
const AnalyticsPanel = styled(motion.div)<{ $isMobile?: boolean }>`
  position: absolute;
  top: ${(props) => (props.$isMobile ? "190px" : "230px")};
  right: 20px;
  width: ${(props) => (props.$isMobile ? "280px" : "360px")};
  max-height: calc(100vh - 360px);
  background: rgba(15, 15, 15, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
  z-index: 1003;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    left: 20px;
    right: 20px;
    width: auto;
    max-height: calc(100vh - 120px);
    top: 150px;
    padding: 8px;
  }
`;

// Analytics Panel Content
const AnalyticsContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 0;
  scroll-behavior: smooth;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 4px;
    margin: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.3),
      rgba(255, 255, 255, 0.2)
    );
    border-radius: 4px;
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  &::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.4),
      rgba(255, 255, 255, 0.3)
    );
  }

  &::-webkit-scrollbar-thumb:active {
    background: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.5),
      rgba(255, 255, 255, 0.4)
    );
  }

  /* Fade out effect at top and bottom when scrolling */
  &::before,
  &::after {
    content: "";
    position: sticky;
    left: 0;
    right: 0;
    height: 10px;
    background: linear-gradient(to bottom, rgba(15, 15, 15, 0.95), transparent);
    z-index: 1;
    pointer-events: none;
  }

  &::before {
    top: 0;
  }

  &::after {
    bottom: 0;
    background: linear-gradient(to top, rgba(15, 15, 15, 0.95), transparent);
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

// Enhanced Route Creator with OpenRouteService API Integration
const RouteCreator: React.FC<{
  mode: "create" | "view";
  waypoints: RouteWaypoint[];
  setWaypoints: React.Dispatch<React.SetStateAction<RouteWaypoint[]>>;
  setRouteGeometry: React.Dispatch<React.SetStateAction<[number, number][]>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ mode, waypoints, setWaypoints, setRouteGeometry, setIsLoading }) => {
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

  // Generate route using multiple routing APIs with enhanced fallback
  const generateRouteWithAPI = async (
    waypoints: RouteWaypoint[]
  ): Promise<[number, number][]> => {
    try {
      setIsLoading(true);
      const coordinates = waypoints.map((wp) => [wp.lng, wp.lat]);

      // Try GraphHopper routing first (more reliable for walking routes)
      try {
        const graphHopperCoords = coordinates
          .map(([lng, lat]) => `point=${lat},${lng}`)
          .join("&");

        const graphHopperResponse = await fetch(
          `https://graphhopper.com/api/1/route?${graphHopperCoords}&vehicle=foot&debug=true&calc_points=true&type=json`,
          {
            headers: {
              Accept: "application/json",
            },
          }
        );

        if (graphHopperResponse.ok) {
          const data = await graphHopperResponse.json();
          if (data.paths && data.paths[0] && data.paths[0].points) {
            // Decode GraphHopper polyline
            const decodedPath = decodePolyline(data.paths[0].points);
            return decodedPath;
          }
        }
      } catch (error) {
        console.warn("GraphHopper routing failed:", error);
      }

      // Try OSRM routing service
      try {
        const osrmCoords = coordinates
          .map(([lng, lat]) => `${lng},${lat}`)
          .join(";");
        const osrmResponse = await fetch(
          `https://router.project-osrm.org/route/v1/walking/${osrmCoords}?overview=full&geometries=geojson&steps=true`
        );

        if (osrmResponse.ok) {
          const osrmData = await osrmResponse.json();
          if (
            osrmData.routes &&
            osrmData.routes[0] &&
            osrmData.routes[0].geometry
          ) {
            const coords = osrmData.routes[0].geometry.coordinates;
            return coords.map(([lng, lat]: [number, number]) => [lat, lng]);
          }
        }
      } catch (error) {
        console.warn("OSRM routing failed:", error);
      }

      // Try OpenRouteService as backup
      try {
        const response = await fetch(
          "https://api.openrouteservice.org/v2/directions/foot-walking/geojson",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json, application/geo+json",
            },
            body: JSON.stringify({
              coordinates: coordinates,
              elevation: false,
              geometry_format: "geojson",
              instructions: false,
              maneuvers: false,
            }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          if (data.features && data.features[0] && data.features[0].geometry) {
            const coords = data.features[0].geometry.coordinates;
            return coords.map(([lng, lat]: [number, number]) => [lat, lng]);
          }
        }
      } catch (error) {
        console.warn("OpenRouteService routing failed:", error);
      }

      throw new Error("All routing APIs failed");
    } catch (error) {
      console.warn(
        "External routing APIs failed, using enhanced street routing:",
        error
      );
      return generateEnhancedStreetPath(waypoints);
    } finally {
      setIsLoading(false);
    }
  };

  // Polyline decoder for GraphHopper and other services
  const decodePolyline = (encoded: string): [number, number][] => {
    const poly: [number, number][] = [];
    let index = 0;
    let lat = 0;
    let lng = 0;

    while (index < encoded.length) {
      let b;
      let shift = 0;
      let result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlat = result & 1 ? ~(result >> 1) : result >> 1;
      lat += dlat;

      shift = 0;
      result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlng = result & 1 ? ~(result >> 1) : result >> 1;
      lng += dlng;

      poly.push([lat / 1e5, lng / 1e5]);
    }

    return poly;
  };

  // Enhanced fallback that simulates realistic street following
  const generateEnhancedStreetPath = (
    waypoints: RouteWaypoint[]
  ): [number, number][] => {
    const path: [number, number][] = [];

    for (let i = 0; i < waypoints.length - 1; i++) {
      const start = waypoints[i];
      const end = waypoints[i + 1];

      path.push([start.lat, start.lng]);

      // Calculate distance and determine routing complexity
      const latDiff = end.lat - start.lat;
      const lngDiff = end.lng - start.lng;
      const distance = Math.sqrt(latDiff * latDiff + lngDiff * lngDiff);

      // More segments for longer distances to create realistic curves
      const segments = Math.max(5, Math.floor(distance * 2000));

      // Create realistic street-following path with multiple approaches
      const pathStrategy = Math.random();

      if (pathStrategy < 0.4) {
        // Strategy 1: L-shaped routing (common in city grids)
        const turnPoint =
          Math.random() > 0.5
            ? 0.3 + Math.random() * 0.4
            : 0.6 + Math.random() * 0.3;

        for (let j = 1; j < segments; j++) {
          const progress = j / segments;
          let lat, lng;

          if (progress < turnPoint) {
            // Move primarily in latitude first
            lat = start.lat + latDiff * (progress / turnPoint);
            lng = start.lng + lngDiff * 0.1 * (progress / turnPoint);
          } else {
            // Then move in longitude
            const adjustedProgress = (progress - turnPoint) / (1 - turnPoint);
            lat = start.lat + latDiff * (1 - 0.1 * (1 - adjustedProgress));
            lng = start.lng + lngDiff * (0.1 + 0.9 * adjustedProgress);
          }

          // Add street-like noise
          lat += (Math.random() - 0.5) * 0.0001;
          lng += (Math.random() - 0.5) * 0.0001;

          path.push([lat, lng]);
        }
      } else if (pathStrategy < 0.7) {
        // Strategy 2: Curved diagonal with realistic bends
        for (let j = 1; j < segments; j++) {
          const progress = j / segments;

          // Base interpolation
          let lat = start.lat + latDiff * progress;
          let lng = start.lng + lngDiff * progress;

          // Add realistic street curves using sine waves
          const curveStrength = distance * 50; // Stronger curves for longer distances
          const curve1 = Math.sin(progress * Math.PI * 2) * curveStrength;
          const curve2 =
            Math.sin(progress * Math.PI * 3 + Math.PI / 4) *
            curveStrength *
            0.5;

          // Apply curves perpendicular to the main direction
          if (Math.abs(latDiff) > Math.abs(lngDiff)) {
            lng += curve1 + curve2;
          } else {
            lat += curve1 + curve2;
          }

          // Add micro-variations for street imperfections
          lat += (Math.random() - 0.5) * 0.00005;
          lng += (Math.random() - 0.5) * 0.00005;

          path.push([lat, lng]);
        }
      } else {
        // Strategy 3: Multi-segment routing with intermediate waypoints
        const intermediatePoints = Math.min(3, Math.floor(distance * 1000));

        for (let k = 0; k < intermediatePoints + 1; k++) {
          const segmentProgress = k / (intermediatePoints + 1);
          const nextProgress = (k + 1) / (intermediatePoints + 1);

          const segmentStart = {
            lat: start.lat + latDiff * segmentProgress,
            lng: start.lng + lngDiff * segmentProgress,
          };
          const segmentEnd = {
            lat: start.lat + latDiff * nextProgress,
            lng: start.lng + lngDiff * nextProgress,
          };

          // Add variation to intermediate points to simulate street routing
          if (k > 0 && k < intermediatePoints) {
            segmentStart.lat += (Math.random() - 0.5) * 0.0002;
            segmentStart.lng += (Math.random() - 0.5) * 0.0002;
          }

          const segmentSteps = Math.floor(segments / (intermediatePoints + 1));

          for (let j = 0; j < segmentSteps; j++) {
            const stepProgress = j / segmentSteps;
            let lat =
              segmentStart.lat +
              (segmentEnd.lat - segmentStart.lat) * stepProgress;
            let lng =
              segmentStart.lng +
              (segmentEnd.lng - segmentStart.lng) * stepProgress;

            // Add realistic street following curves
            const streetCurve = Math.sin(stepProgress * Math.PI * 4) * 0.00003;
            if (Math.abs(latDiff) > Math.abs(lngDiff)) {
              lng += streetCurve;
            } else {
              lat += streetCurve;
            }

            path.push([lat, lng]);
          }
        }
      }
    }

    // Add final destination
    if (waypoints.length > 1) {
      const lastWaypoint = waypoints[waypoints.length - 1];
      path.push([lastWaypoint.lat, lastWaypoint.lng]);
    }

    return path;
  };

  // Generate route when waypoints change
  useEffect(() => {
    if (waypoints.length < 2) {
      setRouteGeometry([]);
      return;
    }

    generateRouteWithAPI(waypoints).then((path) => {
      setRouteGeometry(path);
    });
  }, [waypoints, setRouteGeometry, setIsLoading]);

  return null;
};

// Fallback marker creation for better browser compatibility
const createFallbackMarker = (
  type: "start" | "end" | "waypoint",
  color: string = "#3b82f6"
): L.Icon => {
  const iconConfig = {
    start: { symbol: "🚀", bgColor: "#10b981", size: 32 },
    end: { symbol: "🏁", bgColor: "#ef4444", size: 32 },
    waypoint: { symbol: "📍", bgColor: color, size: 28 },
  };

  const config = iconConfig[type];

  // Simple circular marker using Canvas
  const canvas = document.createElement("canvas");
  canvas.width = config.size;
  canvas.height = config.size + (type !== "waypoint" ? 6 : 0);
  const ctx = canvas.getContext("2d");

  if (ctx) {
    // Draw circle
    ctx.fillStyle = config.bgColor;
    ctx.beginPath();
    ctx.arc(
      config.size / 2,
      config.size / 2,
      config.size / 2 - 2,
      0,
      2 * Math.PI
    );
    ctx.fill();

    // Draw white border
    ctx.strokeStyle = "white";
    ctx.lineWidth = 3;
    ctx.stroke();

    // Draw inner white circle
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(
      config.size / 2,
      config.size / 2,
      config.size / 2 - 6,
      0,
      2 * Math.PI
    );
    ctx.fill();

    // Draw symbol
    ctx.fillStyle = "#333";
    ctx.font = `${config.size / 3}px Arial`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(config.symbol, config.size / 2, config.size / 2);

    // Draw pointer for start/end markers
    if (type !== "waypoint") {
      ctx.fillStyle = config.bgColor;
      ctx.beginPath();
      ctx.moveTo(config.size / 2, config.size - 2);
      ctx.lineTo(config.size / 2 - 4, config.size + 4);
      ctx.lineTo(config.size / 2 + 4, config.size + 4);
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = "white";
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  }

  return new L.Icon({
    iconUrl: canvas.toDataURL(),
    iconSize: [config.size, config.size + (type === "waypoint" ? 0 : 6)],
    iconAnchor: [config.size / 2, config.size + (type === "waypoint" ? -2 : 3)],
    popupAnchor: [0, -(config.size / 2 + 5)],
    className: `premium-marker premium-marker-${type}`,
  });
};

// Enhanced Premium Markers with improved design
const createPremiumMarker = (
  type: "start" | "end" | "waypoint",
  color: string = "#3b82f6"
): L.Icon => {
  try {
    const iconConfig = {
      start: { text: "🚀", bgColor: "#10b981", size: 40 },
      end: { text: "🏁", bgColor: "#ef4444", size: 40 },
      waypoint: { text: "📍", bgColor: color, size: 32 },
    };

    const config = iconConfig[type];
    const uniqueId = `marker-${type}-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    // Create a simpler, more reliable SVG
    const svgContent = `
      <svg xmlns="http://www.w3.org/2000/svg" width="${config.size}" height="${
      config.size + (type !== "waypoint" ? 8 : 0)
    }" viewBox="0 0 ${config.size} ${
      config.size + (type !== "waypoint" ? 8 : 0)
    }">
        <defs>
          <filter id="shadow-${uniqueId}" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="rgba(0,0,0,0.4)"/>
          </filter>
        </defs>
        <circle cx="${config.size / 2}" cy="${config.size / 2}" r="${
      config.size / 2 - 3
    }" 
                fill="${config.bgColor}" 
                stroke="white" 
                stroke-width="3"
                filter="url(#shadow-${uniqueId})"/>
        <circle cx="${config.size / 2}" cy="${config.size / 2}" r="${
      config.size / 2 - 8
    }" 
                fill="white" 
                opacity="0.9"/>
        <text x="${config.size / 2}" y="${config.size / 2 + 5}" 
              text-anchor="middle" 
              font-family="Arial, sans-serif" 
              font-size="${config.size / 3}" 
              fill="#333">${config.text}</text>
        ${
          type !== "waypoint"
            ? `
        <path d="M${config.size / 2} ${config.size - 2} L${
                config.size / 2 - 4
              } ${config.size + 6} L${config.size / 2 + 4} ${
                config.size + 6
              } Z" 
              fill="${config.bgColor}" 
              stroke="white" 
              stroke-width="1"
              filter="url(#shadow-${uniqueId})"/>`
            : ""
        }
      </svg>
    `.trim();

    // Properly encode the SVG for data URL
    const encodedSvg = encodeURIComponent(svgContent);

    return new L.Icon({
      iconUrl: `data:image/svg+xml;charset=utf-8,${encodedSvg}`,
      iconSize: [config.size, config.size + (type === "waypoint" ? 0 : 8)],
      iconAnchor: [
        config.size / 2,
        config.size + (type === "waypoint" ? -2 : 4),
      ],
      popupAnchor: [0, -(config.size / 2 + 5)],
      className: `premium-marker premium-marker-${type}`,
    });
  } catch (error) {
    console.warn("SVG marker creation failed, using fallback:", error);
    return createFallbackMarker(type, color);
  }
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

// Component to center map on user location
const MapCenter: React.FC<{ location: [number, number] | null }> = ({
  location,
}) => {
  const map = useMap();

  useEffect(() => {
    if (location) {
      map.setView(location, 13);
    }
  }, [location, map]);

  return null;
};

// Current Location Marker Component
const CurrentLocationMarker: React.FC<{ position: [number, number] }> = ({
  position,
}) => {
  const currentLocationIcon = L.divIcon({
    className: "current-location-marker",
    html: `
      <div style="
        width: 20px;
        height: 20px;
        background: #3b82f6;
        border: 3px solid #ffffff;
        border-radius: 50%;
        box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
        animation: pulse-location 2s ease-in-out infinite;
      "></div>
      <style>
        @keyframes pulse-location {
          0% { transform: scale(1); box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3); }
          50% { transform: scale(1.1); box-shadow: 0 4px 12px rgba(59, 130, 246, 0.6); }
          100% { transform: scale(1); box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3); }
        }
      </style>
    `,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });

  return (
    <Marker position={position} icon={currentLocationIcon}>
      <Popup>
        <div style={{ textAlign: "center", fontFamily: "Inter, sans-serif" }}>
          <strong style={{ color: "#3b82f6" }}>📍 Your Location</strong>
          <br />
          <small style={{ color: "#666" }}>
            {position[0].toFixed(6)}, {position[1].toFixed(6)}
          </small>
        </div>
      </Popup>
    </Marker>
  );
};

// Main Component Props Interface
interface AdvancedMapPremiumProps {
  sidebarOpen?: boolean;
  isMobile?: boolean;
}

// Main Component
const AdvancedMapPremium: React.FC<AdvancedMapPremiumProps> = ({
  sidebarOpen = false,
  isMobile = false,
}) => {
  const [mode, setMode] = useState<"create" | "view">("view");
  const [waypoints, setWaypoints] = useState<RouteWaypoint[]>([]);
  const [routeGeometry, setRouteGeometry] = useState<[number, number][]>([]);
  const [savedRoutes, setSavedRoutes] = useState<Route[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [sportFilter, setSportFilter] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(false);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(
    null
  );
  const [locationLoading, setLocationLoading] = useState(true);
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [showAlert, setShowAlert] = useState(false);
  const [mapStyle, setMapStyle] = useState<MapStyle>({
    name: "Light",
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: "© OpenStreetMap contributors",
  });

  // Dropdown states
  const [sportDropdownOpen, setSportDropdownOpen] = useState(false);
  const [mapStyleDropdownOpen, setMapStyleDropdownOpen] = useState(false);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (
        !target.closest(".sport-dropdown") &&
        !target.closest(".mapstyle-dropdown")
      ) {
        setSportDropdownOpen(false);
        setMapStyleDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Available map styles with reliable tile sources
  const mapStyles: MapStyle[] = [
    {
      name: "Dark",
      url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
      attribution: "© OpenStreetMap contributors © CARTO",
    },
    {
      name: "Light",
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution: "© OpenStreetMap contributors",
    },
    {
      name: "Satellite",
      url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      attribution: "© Esri",
    },
    {
      name: "Terrain",
      url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
      attribution: "© OpenTopoMap contributors",
    },
  ];

  // Function to show alert
  const showSuccessAlert = useCallback((message: string) => {
    setAlertMessage(message);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 4000); // Hide after 4 seconds
  }, []);

  // Get user's current location
  useEffect(() => {
    const getCurrentLocation = () => {
      setLocationLoading(true);

      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setUserLocation([latitude, longitude]);
            setLocationLoading(false);
            console.log("User location obtained:", latitude, longitude);
          },
          (error) => {
            console.warn("Geolocation error:", error);
            // Fall back to NYC coordinates if geolocation fails
            setUserLocation([40.7829, -73.9654]);
            setLocationLoading(false);

            // Show user-friendly error message
            if (error.code === error.PERMISSION_DENIED) {
              console.log("Location access denied by user");
            } else if (error.code === error.POSITION_UNAVAILABLE) {
              console.log("Location information unavailable");
            } else if (error.code === error.TIMEOUT) {
              console.log("Location request timed out");
            }
          },
          {
            enableHighAccuracy: true,
            timeout: 10000, // 10 seconds
            maximumAge: 300000, // 5 minutes
          }
        );
      } else {
        console.warn("Geolocation not supported");
        setUserLocation([40.7829, -73.9654]);
        setLocationLoading(false);
      }
    };

    getCurrentLocation();
  }, []);

  // Load premium routes
  useEffect(() => {
    setSavedRoutes(PREMIUM_ROUTES);
    // Auto-select the first route to show markers immediately
    if (PREMIUM_ROUTES.length > 0) {
      setSelectedRoute(PREMIUM_ROUTES[0]);
    }
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
      showSuccessAlert("⚠️ Please create a route with at least 2 waypoints");
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
        temperature: Math.round(18 + Math.random() * 10),
        condition: "Clear",
        humidity: Math.round(40 + Math.random() * 30),
      },
    };

    setSavedRoutes((prev) => [newRoute, ...prev]);
    setMode("view");
    setWaypoints([]);
    setRouteGeometry([]);

    showSuccessAlert(
      `✅ Route saved successfully: ${newRoute.stats.distance}km`
    );
  }, [routeGeometry, savedRoutes, showSuccessAlert]);

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
      <GlobalMapStyles $mapStyle={mapStyle.name} />
      <SuccessAlert
        $visible={showAlert}
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{
          opacity: showAlert ? 1 : 0,
          y: showAlert ? 0 : -20,
          scale: showAlert ? 1 : 0.95,
        }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        {alertMessage}
      </SuccessAlert>
      <MapWrapper $sidebarOpen={sidebarOpen} $isMobile={isMobile}>
        <Header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div
            style={{
              textAlign: "center",
              // Removed paddingTop and background for a cleaner header
            }}
          >
            <h1
              style={{
                fontSize: "2.5rem",
                fontWeight: "700",
                color: "#fff",
                margin: "0 0 8px 0",
                letterSpacing: "-1px",
              }}
            >
              Waypoint Premium
            </h1>
            <p
              style={{
                color: "#d1d5db",
                fontSize: "1.1rem",
                margin: 0,
                fontWeight: "400",
              }}
            >
              Professional route tracking with intelligent path optimization
            </p>
          </div>
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

          <DropdownContainer className="sport-dropdown">
            <DropdownTrigger
              $isOpen={sportDropdownOpen}
              onClick={() => setSportDropdownOpen(!sportDropdownOpen)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span>
                {sportFilter === "all" && "🏃‍♂️ All Sports"}
                {sportFilter === "running" && "🏃‍♂️ Running"}
                {sportFilter === "cycling" && "🚴‍♂️ Cycling"}
                {sportFilter === "hiking" && "🥾 Hiking"}
                {sportFilter === "walking" && "🚶‍♂️ Walking"}
              </span>
            </DropdownTrigger>
            <DropdownMenu
              $isOpen={sportDropdownOpen}
              initial={{ opacity: 0, y: -10 }}
              animate={{
                opacity: sportDropdownOpen ? 1 : 0,
                y: sportDropdownOpen ? 0 : -10,
              }}
              transition={{ duration: 0.2 }}
            >
              {[
                { value: "all", label: "🏃‍♂️ All Sports" },
                { value: "running", label: "🏃‍♂️ Running" },
                { value: "cycling", label: "🚴‍♂️ Cycling" },
                { value: "hiking", label: "🥾 Hiking" },
                { value: "walking", label: "🚶‍♂️ Walking" },
              ].map((option) => (
                <DropdownOption
                  key={option.value}
                  $selected={sportFilter === option.value}
                  onClick={() => {
                    setSportFilter(option.value);
                    setSportDropdownOpen(false);
                  }}
                  whileHover={{ x: 2 }}
                >
                  {option.label}
                </DropdownOption>
              ))}
            </DropdownMenu>
          </DropdownContainer>

          <DropdownContainer className="mapstyle-dropdown">
            <DropdownTrigger
              $isOpen={mapStyleDropdownOpen}
              onClick={() => setMapStyleDropdownOpen(!mapStyleDropdownOpen)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span>
                {mapStyle.name === "Light" && "☀️ Light"}
                {mapStyle.name === "Dark" && "🌙 Dark"}
                {mapStyle.name === "Satellite" && "🛰️ Satellite"}
                {mapStyle.name === "Terrain" && "🏔️ Terrain"}
              </span>
            </DropdownTrigger>
            <DropdownMenu
              $isOpen={mapStyleDropdownOpen}
              initial={{ opacity: 0, y: -10 }}
              animate={{
                opacity: mapStyleDropdownOpen ? 1 : 0,
                y: mapStyleDropdownOpen ? 0 : -10,
              }}
              transition={{ duration: 0.2 }}
            >
              {mapStyles.map((style) => (
                <DropdownOption
                  key={style.name}
                  $selected={mapStyle.name === style.name}
                  onClick={() => {
                    setMapStyle(style);
                    setMapStyleDropdownOpen(false);
                  }}
                  whileHover={{ x: 2 }}
                >
                  {style.name === "Light" && "☀️ Light"}
                  {style.name === "Dark" && "🌙 Dark"}
                  {style.name === "Satellite" && "🛰️ Satellite"}
                  {style.name === "Terrain" && "🏔️ Terrain"}
                </DropdownOption>
              ))}
            </DropdownMenu>
          </DropdownContainer>

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

              <AnalyticsContent>
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
                          data={selectedRoute.coordinates.map(
                            (coord, index) => ({
                              distance:
                                (index / selectedRoute.coordinates.length) *
                                selectedRoute.stats.distance,
                              elevation: coord.elevation || 0,
                            })
                          )}
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
              </AnalyticsContent>
            </AnalyticsPanel>
          )}
        </AnimatePresence>

        {/* Route Distance Indicator */}
        <RouteDistanceIndicator
          $visible={mode === "create" && routeGeometry.length > 1}
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: mode === "create" && routeGeometry.length > 1 ? 1 : 0,
            y: mode === "create" && routeGeometry.length > 1 ? 0 : 20,
          }}
          transition={{ duration: 0.3 }}
        >
          📏 Distance: {calculateDistance(routeGeometry).toFixed(2)} km
        </RouteDistanceIndicator>

        {/* Loading Overlay */}
        <AnimatePresence>
          {isLoading && (
            <LoadingOverlay
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div style={{ textAlign: "center", color: "#ffffff" }}>
                <LoadingSpinner />
                <p style={{ marginTop: "16px", fontSize: "1rem" }}>
                  Generating route...
                </p>
              </div>
            </LoadingOverlay>
          )}
        </AnimatePresence>

        <MapErrorBoundary>
          <MapContainer
            center={userLocation || [40.7829, -73.9654]}
            zoom={13}
            style={{
              width: "100%",
              height: "100%",
            }}
            scrollWheelZoom={true}
          >
            <DynamicTileLayer mapStyle={mapStyle} />
            <MapCenter location={userLocation} />

            {/* Show current location marker */}
            {userLocation && !locationLoading && (
              <CurrentLocationMarker position={userLocation} />
            )}

            <RouteCreator
              mode={mode}
              waypoints={waypoints}
              setWaypoints={setWaypoints}
              setRouteGeometry={setRouteGeometry}
              setIsLoading={setIsLoading}
            />

            {/* Current route being created */}
            {mode === "create" && routeGeometry.length > 1 && (
              <Polyline
                positions={routeGeometry}
                color="#ff6b35"
                weight={5}
                opacity={0.9}
                className="creating-route"
                pathOptions={{
                  lineCap: "round",
                  lineJoin: "round",
                }}
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
                color={
                  selectedRoute?.id === route.id
                    ? "#ff6b35"
                    : getSportColor(route.sport)
                }
                weight={selectedRoute?.id === route.id ? 5 : 3}
                opacity={selectedRoute?.id === route.id ? 0.9 : 0.6}
                pathOptions={{
                  lineCap: "round",
                  lineJoin: "round",
                }}
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
        </MapErrorBoundary>
      </MapWrapper>
    </>
  );
};

export default AdvancedMapPremium;
