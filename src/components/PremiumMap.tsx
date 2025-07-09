import React, { useEffect, useRef, useState } from "react";

// We'll use vanilla Leaflet instead of react-leaflet to avoid the React errors
declare global {
  interface Window {
    L: any;
    Chart: any;
  }
}

interface RoutePoint {
  lat: number;
  lng: number;
  elevation: number;
  timestamp: Date;
}

interface RouteStats {
  distance: number;
  avgSpeed: number;
  maxSpeed: number;
  elevationGain: number;
  calories: number;
  duration: number;
}

interface WeatherData {
  temp: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  pressure: number;
}

const PremiumMap: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const elevationChartRef = useRef<HTMLCanvasElement>(null);
  const speedChartRef = useRef<HTMLCanvasElement>(null);
  const heartRateChartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<any>(null);
  const speedChartInstanceRef = useRef<any>(null);
  const hrChartInstanceRef = useRef<any>(null);

  const [routePoints, setRoutePoints] = useState<RoutePoint[]>([]);
  const [stats, setStats] = useState<RouteStats>({
    distance: 0,
    avgSpeed: 0,
    maxSpeed: 0,
    elevationGain: 0,
    calories: 0,
    duration: 0,
  });
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [weather, setWeather] = useState<WeatherData>({
    temp: 22,
    condition: "Clear",
    humidity: 65,
    windSpeed: 8,
    pressure: 1013,
  });
  const [currentLocation, setCurrentLocation] = useState<
    [number, number] | null
  >(null);
  const [showWeatherWidget, setShowWeatherWidget] = useState(true);
  const [showPerformanceWidget, setShowPerformanceWidget] = useState(true);
  const [heartRate, setHeartRate] = useState(145);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [mapStyle, setMapStyle] = useState("dark");

  const routeLayerRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const heatmapLayerRef = useRef<any>(null);
  const currentLocationMarkerRef = useRef<any>(null);

  const calculateDistance = (coords: RoutePoint[]): number => {
    if (coords.length < 2) return 0;

    let totalDistance = 0;
    for (let i = 1; i < coords.length; i++) {
      const lat1 = coords[i - 1].lat;
      const lng1 = coords[i - 1].lng;
      const lat2 = coords[i].lat;
      const lng2 = coords[i].lng;

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

  const calculateStats = (points: RoutePoint[]): RouteStats => {
    if (points.length < 2)
      return {
        distance: 0,
        avgSpeed: 0,
        maxSpeed: 0,
        elevationGain: 0,
        calories: 0,
        duration: 0,
      };

    const distance = calculateDistance(points);
    const duration =
      (points[points.length - 1].timestamp.getTime() -
        points[0].timestamp.getTime()) /
      1000 /
      60; // minutes
    const avgSpeed = duration > 0 ? (distance / duration) * 60 : 0; // km/h

    let elevationGain = 0;
    let maxSpeed = 0;

    for (let i = 1; i < points.length; i++) {
      const elevDiff = points[i].elevation - points[i - 1].elevation;
      if (elevDiff > 0) elevationGain += elevDiff;

      const segmentDistance = calculateDistance([points[i - 1], points[i]]);
      const segmentTime =
        (points[i].timestamp.getTime() - points[i - 1].timestamp.getTime()) /
        1000 /
        3600; // hours
      const segmentSpeed = segmentTime > 0 ? segmentDistance / segmentTime : 0;
      maxSpeed = Math.max(maxSpeed, segmentSpeed);
    }

    const calories = distance * 65; // Rough estimate

    return {
      distance: Math.round(distance * 100) / 100,
      avgSpeed: Math.round(avgSpeed * 10) / 10,
      maxSpeed: Math.round(maxSpeed * 10) / 10,
      elevationGain: Math.round(elevationGain),
      calories: Math.round(calories),
      duration: Math.round(duration),
    };
  };

  const simulateWeatherUpdate = () => {
    const conditions = [
      "Clear",
      "Cloudy",
      "Rainy",
      "Sunny",
      "Overcast",
      "Windy",
    ];
    const temps = [18, 19, 20, 21, 22, 23, 24, 25, 26, 27];
    const humidities = [55, 60, 65, 70, 75, 80];
    const windSpeeds = [3, 5, 8, 10, 12, 15];
    const pressures = [1008, 1010, 1013, 1015, 1018, 1020];

    setWeather({
      temp: temps[Math.floor(Math.random() * temps.length)],
      condition: conditions[Math.floor(Math.random() * conditions.length)],
      humidity: humidities[Math.floor(Math.random() * humidities.length)],
      windSpeed: windSpeeds[Math.floor(Math.random() * windSpeeds.length)],
      pressure: pressures[Math.floor(Math.random() * pressures.length)],
    });
  };

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setCurrentLocation([lat, lng]);

          if (mapInstanceRef.current) {
            // Update location marker
            if (currentLocationMarkerRef.current) {
              mapInstanceRef.current.removeLayer(
                currentLocationMarkerRef.current
              );
            }

            currentLocationMarkerRef.current = window.L.marker([lat, lng], {
              icon: window.L.divIcon({
                className: "current-location-marker",
                html: '<div style="background: #10b981; color: white; border-radius: 50%; width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3); animation: pulse 2s infinite;">📍</div>',
                iconSize: [20, 20],
                iconAnchor: [10, 10],
              }),
            }).addTo(mapInstanceRef.current);

            currentLocationMarkerRef.current.bindPopup("📍 Your Location");
            mapInstanceRef.current.setView([lat, lng], 15);
          }
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  };

  const updateCharts = (points: RoutePoint[]) => {
    if (points.length < 2) return;

    // Load Chart.js if not loaded
    if (!window.Chart) {
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/npm/chart.js";
      document.head.appendChild(script);
      script.onload = () => updateCharts(points);
      return;
    }

    // Common chart styling
    const chartColors = {
      primary: "#3b82f6",
      success: "#10b981",
      danger: "#ef4444",
      warning: "#f59e0b",
      info: "#06b6d4",
    };

    const gridColor = "rgba(255,255,255,0.1)";
    const tickColor = "#6b7280";

    // Elevation Chart
    if (elevationChartRef.current) {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }

      const ctx = elevationChartRef.current.getContext("2d");
      chartInstanceRef.current = new window.Chart(ctx, {
        type: "line",
        data: {
          labels: points.map(
            (_, i) => `${((i / points.length) * stats.distance).toFixed(1)}km`
          ),
          datasets: [
            {
              label: "Elevation (m)",
              data: points.map((p) => p.elevation),
              borderColor: chartColors.primary,
              backgroundColor: `${chartColors.primary}20`,
              fill: true,
              tension: 0.4,
              pointRadius: 2,
              pointHoverRadius: 6,
              borderWidth: 3,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: true,
              labels: { color: "#ffffff", font: { size: 12 } },
            },
            tooltip: {
              backgroundColor: "rgba(0,0,0,0.8)",
              titleColor: "#ffffff",
              bodyColor: "#ffffff",
              borderColor: chartColors.primary,
              borderWidth: 1,
            },
          },
          scales: {
            x: {
              grid: { color: gridColor },
              ticks: { color: tickColor, font: { size: 10 } },
            },
            y: {
              grid: { color: gridColor },
              ticks: { color: tickColor, font: { size: 10 } },
            },
          },
        },
      });
    }

    // Speed Chart
    if (speedChartRef.current && points.length > 1) {
      if (speedChartInstanceRef.current) {
        speedChartInstanceRef.current.destroy();
      }

      const speeds: number[] = [];
      for (let i = 1; i < points.length; i++) {
        const distance = calculateDistance([points[i - 1], points[i]]);
        const time =
          (points[i].timestamp.getTime() - points[i - 1].timestamp.getTime()) /
          1000 /
          3600;
        speeds.push(time > 0 ? distance / time : 0);
      }

      const ctx = speedChartRef.current.getContext("2d");
      speedChartInstanceRef.current = new window.Chart(ctx, {
        type: "bar",
        data: {
          labels: speeds.map((_, i) => `Seg ${i + 1}`),
          datasets: [
            {
              label: "Speed (km/h)",
              data: speeds,
              backgroundColor: speeds.map((s) =>
                s > 25
                  ? chartColors.danger
                  : s > 15
                  ? chartColors.warning
                  : chartColors.success
              ),
              borderColor: chartColors.success,
              borderWidth: 1,
              borderRadius: 4,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: true,
              labels: { color: "#ffffff", font: { size: 12 } },
            },
            tooltip: {
              backgroundColor: "rgba(0,0,0,0.8)",
              titleColor: "#ffffff",
              bodyColor: "#ffffff",
              borderColor: chartColors.success,
              borderWidth: 1,
            },
          },
          scales: {
            x: {
              grid: { color: gridColor },
              ticks: { color: tickColor, font: { size: 9 } },
            },
            y: {
              grid: { color: gridColor },
              ticks: { color: tickColor, font: { size: 9 } },
            },
          },
        },
      });
    }

    // Heart Rate Chart (simulated data)
    if (heartRateChartRef.current) {
      if (hrChartInstanceRef.current) {
        hrChartInstanceRef.current.destroy();
      }

      const heartRateData = Array.from(
        { length: Math.min(points.length, 20) },
        (_, i) =>
          heartRate + Math.sin(i * 0.3) * 15 + (Math.random() - 0.5) * 10
      );

      const ctx = heartRateChartRef.current.getContext("2d");
      hrChartInstanceRef.current = new window.Chart(ctx, {
        type: "line",
        data: {
          labels: heartRateData.map((_, i) => `${i + 1}min`),
          datasets: [
            {
              label: "Heart Rate (BPM)",
              data: heartRateData,
              borderColor: chartColors.danger,
              backgroundColor: `${chartColors.danger}20`,
              fill: true,
              tension: 0.4,
              pointRadius: 3,
              pointHoverRadius: 6,
              borderWidth: 3,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: true,
              labels: { color: "#ffffff", font: { size: 12 } },
            },
            tooltip: {
              backgroundColor: "rgba(0,0,0,0.8)",
              titleColor: "#ffffff",
              bodyColor: "#ffffff",
              borderColor: chartColors.danger,
              borderWidth: 1,
            },
          },
          scales: {
            x: {
              grid: { color: gridColor },
              ticks: { color: tickColor, font: { size: 10 } },
            },
            y: {
              grid: { color: gridColor },
              ticks: { color: tickColor, font: { size: 10 } },
              min: 60,
              max: 200,
            },
          },
        },
      });
    }
  };

  const startRecording = () => {
    setIsRecording(true);
    setShowAnalytics(true);

    // Simulate real-time data collection
    const interval = setInterval(() => {
      if (currentLocation) {
        const newPoint: RoutePoint = {
          lat: currentLocation[0] + (Math.random() - 0.5) * 0.001,
          lng: currentLocation[1] + (Math.random() - 0.5) * 0.001,
          elevation: 100 + Math.random() * 50,
          timestamp: new Date(),
        };

        setRoutePoints((prev) => {
          const newPoints = [...prev, newPoint];
          const newStats = calculateStats(newPoints);
          setStats(newStats);
          setTimeout(() => updateRoute(newPoints), 0);
          return newPoints;
        });

        // Update heart rate simulation
        setHeartRate((prev) => {
          const variation = (Math.random() - 0.5) * 20;
          return Math.max(60, Math.min(200, prev + variation));
        });
      }
    }, 2000);

    // Store interval for cleanup
    (window as any).recordingInterval = interval;
  };

  const stopRecording = () => {
    setIsRecording(false);
    if ((window as any).recordingInterval) {
      clearInterval((window as any).recordingInterval);
    }
  };

  const toggleMapStyle = () => {
    if (!mapInstanceRef.current) return;

    const newStyle =
      mapStyle === "dark"
        ? "satellite"
        : mapStyle === "satellite"
        ? "terrain"
        : "dark";
    setMapStyle(newStyle);

    // Clear existing tile layers
    mapInstanceRef.current.eachLayer((layer: any) => {
      if (layer._url) {
        mapInstanceRef.current.removeLayer(layer);
      }
    });

    // Add new tile layer
    let tileUrl = "";
    switch (newStyle) {
      case "satellite":
        tileUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
        break;
      case "terrain":
        tileUrl =
          "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";
        break;
      default:
        tileUrl =
          "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";
    }

    window.L.tileLayer(tileUrl, {
      attribution: "© CartoDB",
      maxZoom: 19,
    }).addTo(mapInstanceRef.current);
  };

  const clearRoute = () => {
    stopRecording();
    setRoutePoints([]);
    setStats({
      distance: 0,
      avgSpeed: 0,
      maxSpeed: 0,
      elevationGain: 0,
      calories: 0,
      duration: 0,
    });
    setShowAnalytics(false);

    // Clear charts
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
      chartInstanceRef.current = null;
    }
    if (speedChartInstanceRef.current) {
      speedChartInstanceRef.current.destroy();
      speedChartInstanceRef.current = null;
    }
    if (hrChartInstanceRef.current) {
      hrChartInstanceRef.current.destroy();
      hrChartInstanceRef.current = null;
    }

    // Clear map layers
    if (routeLayerRef.current && mapInstanceRef.current) {
      mapInstanceRef.current.removeLayer(routeLayerRef.current);
      routeLayerRef.current = null;
    }

    // Clear markers
    markersRef.current.forEach((marker) => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.removeLayer(marker);
      }
    });
    markersRef.current = [];

    // Clear heatmap
    if (heatmapLayerRef.current && mapInstanceRef.current) {
      mapInstanceRef.current.removeLayer(heatmapLayerRef.current);
      heatmapLayerRef.current = null;
    }
  };

  const updateRoute = (points: RoutePoint[]) => {
    if (!mapInstanceRef.current || !window.L) return;

    // Clear existing route
    if (routeLayerRef.current) {
      mapInstanceRef.current.removeLayer(routeLayerRef.current);
    }

    // Clear existing markers
    markersRef.current.forEach((marker) => {
      mapInstanceRef.current.removeLayer(marker);
    });
    markersRef.current = [];

    // Add animated gradient route if more than 1 point
    if (points.length > 1) {
      const coordinates = points.map((p) => [p.lat, p.lng]);

      // Create gradient polyline
      routeLayerRef.current = window.L.polyline(coordinates, {
        color: "#3b82f6",
        weight: 6,
        opacity: 0.8,
        smoothFactor: 1,
        className: "gradient-route",
      }).addTo(mapInstanceRef.current);

      // Add pulsing effect
      const style = document.createElement("style");
      style.textContent = `
        .gradient-route {
          animation: pulse-route 2s ease-in-out infinite;
        }
        @keyframes pulse-route {
          0% { opacity: 0.6; }
          50% { opacity: 1; }
          100% { opacity: 0.6; }
        }
      `;
      document.head.appendChild(style);
    }

    // Add enhanced markers
    if (points.length > 0) {
      // Start marker with animation
      const startMarker = window.L.marker([points[0].lat, points[0].lng], {
        icon: window.L.divIcon({
          className: "custom-marker start-marker",
          html: `<div style="
            background: linear-gradient(135deg, #10b981, #059669);
            color: white;
            border-radius: 50%;
            width: 35px;
            height: 35px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            border: 3px solid white;
            box-shadow: 0 4px 20px rgba(16, 185, 129, 0.4);
            animation: bounce 2s ease-in-out infinite;
          ">🚀</div>`,
          iconSize: [35, 35],
          iconAnchor: [17, 17],
        }),
      }).addTo(mapInstanceRef.current);

      startMarker.bindPopup(`
        <div style="color: #1f2937; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
          <h3 style="margin: 0 0 8px 0; color: #10b981;">🚀 Start Point</h3>
          <p style="margin: 0; font-size: 14px;">
            <strong>Elevation:</strong> ${points[0].elevation.toFixed(1)}m<br>
            <strong>Time:</strong> ${points[0].timestamp.toLocaleTimeString()}
          </p>
        </div>
      `);
      markersRef.current.push(startMarker);

      // End marker (if more than one point)
      if (points.length > 1) {
        const endMarker = window.L.marker(
          [points[points.length - 1].lat, points[points.length - 1].lng],
          {
            icon: window.L.divIcon({
              className: "custom-marker end-marker",
              html: `<div style="
              background: linear-gradient(135deg, #ef4444, #dc2626);
              color: white;
              border-radius: 50%;
              width: 35px;
              height: 35px;
              display: flex;
              align-items: center;
              justify-content: center;
              font-weight: bold;
              border: 3px solid white;
              box-shadow: 0 4px 20px rgba(239, 68, 68, 0.4);
              animation: glow 2s ease-in-out infinite;
            ">🏁</div>`,
              iconSize: [35, 35],
              iconAnchor: [17, 17],
            }),
          }
        ).addTo(mapInstanceRef.current);

        endMarker.bindPopup(`
          <div style="color: #1f2937; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
            <h3 style="margin: 0 0 8px 0; color: #ef4444;">🏁 Finish Point</h3>
            <p style="margin: 0; font-size: 14px;">
              <strong>Distance:</strong> ${stats.distance}km<br>
              <strong>Duration:</strong> ${stats.duration} min<br>
              <strong>Avg Speed:</strong> ${stats.avgSpeed} km/h
            </p>
          </div>
        `);
        markersRef.current.push(endMarker);
      }

      // Add waypoint markers for significant points
      if (points.length > 2) {
        const interval = Math.max(1, Math.floor(points.length / 5));
        for (let i = interval; i < points.length - 1; i += interval) {
          const waypoint = window.L.marker([points[i].lat, points[i].lng], {
            icon: window.L.divIcon({
              className: "waypoint-marker",
              html: `<div style="
                background: rgba(59, 130, 246, 0.9);
                color: white;
                border-radius: 50%;
                width: 20px;
                height: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
                border: 2px solid white;
                box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
                font-size: 10px;
              ">${Math.floor(i / interval)}</div>`,
              iconSize: [20, 20],
              iconAnchor: [10, 10],
            }),
          }).addTo(mapInstanceRef.current);

          waypoint.bindPopup(`
            <div style="color: #1f2937; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
              <h4 style="margin: 0 0 6px 0; color: #3b82f6;">📍 Waypoint ${Math.floor(
                i / interval
              )}</h4>
              <p style="margin: 0; font-size: 12px;">
                <strong>Elevation:</strong> ${points[i].elevation.toFixed(
                  1
                )}m<br>
                <strong>Distance:</strong> ${calculateDistance(
                  points.slice(0, i + 1)
                ).toFixed(2)}km
              </p>
            </div>
          `);
          markersRef.current.push(waypoint);
        }
      }
    }

    // Update heatmap if enabled
    if (showHeatmap && points.length > 3) {
      if (heatmapLayerRef.current) {
        mapInstanceRef.current.removeLayer(heatmapLayerRef.current);
      }

      // Create heatmap data
      const heatData = points.map((p) => [p.lat, p.lng, 0.5]);

      // Note: In a real implementation, you'd load leaflet-heatmap plugin
      // For now, we'll add circle markers to simulate heatmap
      const heatmapGroup = window.L.layerGroup();
      points.forEach((point) => {
        window.L.circle([point.lat, point.lng], {
          radius: 50,
          color: "#3b82f6",
          fillColor: "#3b82f6",
          fillOpacity: 0.1,
          weight: 1,
          opacity: 0.3,
        }).addTo(heatmapGroup);
      });

      heatmapLayerRef.current = heatmapGroup.addTo(mapInstanceRef.current);
    }

    // Update charts
    setTimeout(() => updateCharts(points), 100);
  };

  useEffect(() => {
    // Load Leaflet dynamically
    const loadLeaflet = async () => {
      if (!window.L) {
        // Add Leaflet CSS
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        document.head.appendChild(link);

        // Add Leaflet JS
        const script = document.createElement("script");
        script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
        document.head.appendChild(script);

        // Wait for Leaflet to load
        await new Promise((resolve) => {
          script.onload = resolve;
        });
      }

      if (mapRef.current && window.L && !mapInstanceRef.current) {
        // Initialize map
        mapInstanceRef.current = window.L.map(mapRef.current).setView(
          [45.5017, -73.5673],
          13
        );

        // Add dark tile layer
        window.L.tileLayer(
          "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
          {
            attribution: "© CartoDB",
            maxZoom: 19,
          }
        ).addTo(mapInstanceRef.current);

        // Add click event for route creation
        mapInstanceRef.current.on("click", (e: any) => {
          if (!isRecording) {
            const newPoint: RoutePoint = {
              lat: e.latlng.lat,
              lng: e.latlng.lng,
              elevation: 100 + Math.random() * 100, // Simulated elevation
              timestamp: new Date(),
            };

            setRoutePoints((prev) => {
              const newPoints = [...prev, newPoint];
              const newStats = calculateStats(newPoints);
              setStats(newStats);

              // Auto-show analytics when we have enough points for meaningful data
              if (newPoints.length >= 3) {
                setShowAnalytics(true);
              }

              // Update route on map in next tick
              setTimeout(() => updateRoute(newPoints), 0);

              return newPoints;
            });
          }
        });

        // Get user location
        getUserLocation();
      }
    };

    loadLeaflet().catch(console.error);

    // Update weather periodically
    const weatherInterval = setInterval(simulateWeatherUpdate, 30000);

    // Cleanup
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      clearInterval(weatherInterval);
    };
  }, []);

  // Add custom styles for animations
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      @keyframes bounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
      }
      
      @keyframes glow {
        0%, 100% { box-shadow: 0 4px 20px rgba(239, 68, 68, 0.4); }
        50% { box-shadow: 0 4px 30px rgba(239, 68, 68, 0.8); }
      }
      
      @keyframes pulse {
        0% { opacity: 0.6; }
        50% { opacity: 1; }
        100% { opacity: 0.6; }
      }
      
      .glass-panel {
        backdrop-filter: blur(20px);
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 16px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
      }
      
      .widget-card {
        background: rgba(0, 0, 0, 0.4);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 12px;
        padding: 16px;
        transition: all 0.3s ease;
      }
      
      .widget-card:hover {
        background: rgba(0, 0, 0, 0.6);
        border-color: rgba(255, 255, 255, 0.2);
        transform: translateY(-2px);
      }
      
      .premium-button {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        padding: 12px 24px;
        border-radius: 12px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
      }
      
      .premium-button:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
      }
      
      .metric-card {
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 12px;
        padding: 16px;
        text-align: center;
        backdrop-filter: blur(10px);
      }
      
      .metric-value {
        font-size: 2rem;
        font-weight: 800;
        background: linear-gradient(135deg, #3b82f6, #10b981);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }
      
      .metric-label {
        font-size: 0.875rem;
        color: #9ca3af;
        margin-top: 4px;
      }
    `;
    document.head.appendChild(style);
  }, []);

  return (
    <div
      style={{
        height: "100vh",
        background:
          "linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 50%, #2d1b69 100%)",
        display: "flex",
        flexDirection: "column",
        padding: "20px",
      }}
    >
      {/* Centered Header - matching website style */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
          flexWrap: "wrap",
          gap: "15px",
        }}
      >
        <h1
          style={{
            color: "white",
            margin: 0,
            fontSize: "2rem",
            fontWeight: "800",
            flex: 1,
            textAlign: "center",
          }}
        >
          🗺️ Waypoint Premium
        </h1>

        <div
          style={{
            display: "flex",
            gap: "10px",
            alignItems: "center",
            flexWrap: "wrap",
            position: "absolute",
            right: "20px",
          }}
        >
          {routePoints.length > 0 && (
            <div
              style={{
                color: "white",
                background: "rgba(255, 255, 255, 0.1)",
                padding: "8px 16px",
                borderRadius: "8px",
                fontSize: "14px",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                backdropFilter: "blur(10px)",
              }}
            >
              📏 {stats.distance}km • 📍 {routePoints.length} points
            </div>
          )}

          <button
            onClick={clearRoute}
            style={{
              background:
                routePoints.length > 0
                  ? "linear-gradient(135deg, #ef4444, #dc2626)"
                  : "linear-gradient(135deg, #6b7280, #4b5563)",
              color: "white",
              border: "none",
              padding: "8px 16px",
              borderRadius: "8px",
              cursor: routePoints.length > 0 ? "pointer" : "not-allowed",
              fontSize: "14px",
              fontWeight: "600",
              transition: "all 0.3s ease",
              opacity: routePoints.length > 0 ? 1 : 0.5,
            }}
            disabled={routePoints.length === 0}
          >
            🧹 Clear Route
          </button>
        </div>
      </div>

      {/* Map Container - Full width */}
      <div
        style={{
          flex: 1,
          position: "relative",
          borderRadius: "20px",
          overflow: "hidden",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.5)",
        }}
      >
        <div
          ref={mapRef}
          style={{
            height: "100%",
            width: "100%",
            background: "#1a1a1a",
          }}
        />

        {/* Premium Controls Overlay - Top Left */}
        <div
          style={{
            position: "absolute",
            top: "20px",
            left: "20px",
            display: "flex",
            gap: "10px",
            flexWrap: "wrap",
            zIndex: 1000,
          }}
        >
          <button
            className="premium-button"
            onClick={toggleMapStyle}
            style={{ fontSize: "14px", padding: "10px 16px" }}
          >
            🌍{" "}
            {mapStyle === "dark"
              ? "Satellite"
              : mapStyle === "satellite"
              ? "Terrain"
              : "Dark"}
          </button>

          <button
            className="premium-button"
            onClick={getUserLocation}
            style={{ fontSize: "14px", padding: "10px 16px" }}
          >
            📍 My Location
          </button>

          <button
            className="premium-button"
            onClick={() => setShowHeatmap(!showHeatmap)}
            style={{
              fontSize: "14px",
              padding: "10px 16px",
              background: showHeatmap
                ? "linear-gradient(135deg, #ef4444, #dc2626)"
                : "linear-gradient(135deg, #667eea, #764ba2)",
            }}
          >
            🔥 {showHeatmap ? "Hide" : "Show"} Heatmap
          </button>

          {routePoints.length > 0 && (
            <button
              className="premium-button"
              onClick={() => setShowAnalytics(!showAnalytics)}
              style={{
                fontSize: "14px",
                padding: "10px 16px",
                background: showAnalytics
                  ? "linear-gradient(135deg, #ef4444, #dc2626)"
                  : "linear-gradient(135deg, #f59e0b, #d97706)",
              }}
            >
              📊 {showAnalytics ? "Hide" : "Show"} Analytics
            </button>
          )}
        </div>

        {/* Recording Controls - Top Right */}
        <div
          style={{
            position: "absolute",
            top: "20px",
            right: "20px",
            display: "flex",
            gap: "10px",
            zIndex: 1000,
          }}
        >
          {!isRecording ? (
            <button
              className="premium-button"
              onClick={startRecording}
              style={{
                fontSize: "14px",
                padding: "10px 16px",
                background: "linear-gradient(135deg, #10b981, #059669)",
              }}
            >
              ⏺️ Start Recording
            </button>
          ) : (
            <button
              className="premium-button"
              onClick={stopRecording}
              style={{
                fontSize: "14px",
                padding: "10px 16px",
                background: "linear-gradient(135deg, #ef4444, #dc2626)",
              }}
            >
              ⏹️ Stop Recording
            </button>
          )}
        </div>

        {/* Route Stats Overlay - Top Center */}
        {routePoints.length > 0 && (
          <div
            style={{
              position: "absolute",
              top: "20px",
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              gap: "12px",
              flexWrap: "wrap",
              zIndex: 1000,
            }}
          >
            <div className="metric-card">
              <div className="metric-value">{stats.distance}</div>
              <div className="metric-label">Distance (km)</div>
            </div>
            <div className="metric-card">
              <div className="metric-value">{stats.avgSpeed}</div>
              <div className="metric-label">Avg Speed (km/h)</div>
            </div>
            <div className="metric-card">
              <div className="metric-value">{stats.elevationGain}</div>
              <div className="metric-label">Elevation Gain (m)</div>
            </div>
            <div className="metric-card">
              <div className="metric-value">{stats.calories}</div>
              <div className="metric-label">Calories</div>
            </div>
          </div>
        )}

        {/* Weather Widget - Bottom Left */}
        {showWeatherWidget && (
          <div
            style={{
              position: "absolute",
              bottom: "20px",
              left: "20px",
              width: "280px",
              zIndex: 1000,
            }}
          >
            <div className="widget-card">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "12px",
                }}
              >
                <h3
                  style={{
                    color: "white",
                    margin: 0,
                    fontSize: "1.1rem",
                    fontWeight: "700",
                  }}
                >
                  🌤️ Weather
                </h3>
                <button
                  onClick={() => setShowWeatherWidget(false)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#9ca3af",
                    cursor: "pointer",
                    fontSize: "16px",
                  }}
                >
                  ✕
                </button>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "12px",
                }}
              >
                <div style={{ textAlign: "center" }}>
                  <div
                    style={{
                      fontSize: "2rem",
                      fontWeight: "800",
                      color: "#3b82f6",
                    }}
                  >
                    {weather.temp}°C
                  </div>
                  <div
                    style={{
                      fontSize: "0.875rem",
                      color: "#9ca3af",
                    }}
                  >
                    {weather.condition}
                  </div>
                </div>
                <div style={{ fontSize: "0.875rem", color: "#d1d5db" }}>
                  <div>💧 {weather.humidity}%</div>
                  <div>💨 {weather.windSpeed} km/h</div>
                  <div>🌡️ {weather.pressure} hPa</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Performance Widget - Bottom Right */}
        {showPerformanceWidget && (
          <div
            style={{
              position: "absolute",
              bottom: "20px",
              right: "20px",
              width: "280px",
              zIndex: 1000,
            }}
          >
            <div className="widget-card">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "12px",
                }}
              >
                <h3
                  style={{
                    color: "white",
                    margin: 0,
                    fontSize: "1.1rem",
                    fontWeight: "700",
                  }}
                >
                  💓 Performance
                </h3>
                <button
                  onClick={() => setShowPerformanceWidget(false)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#9ca3af",
                    cursor: "pointer",
                    fontSize: "16px",
                  }}
                >
                  ✕
                </button>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "12px",
                  marginBottom: "12px",
                }}
              >
                <div style={{ textAlign: "center" }}>
                  <div
                    style={{
                      fontSize: "1.5rem",
                      fontWeight: "800",
                      color: "#ef4444",
                    }}
                  >
                    {Math.round(heartRate)}
                  </div>
                  <div
                    style={{
                      fontSize: "0.75rem",
                      color: "#9ca3af",
                    }}
                  >
                    Heart Rate (BPM)
                  </div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div
                    style={{
                      fontSize: "1.5rem",
                      fontWeight: "800",
                      color: "#10b981",
                    }}
                  >
                    {stats.maxSpeed}
                  </div>
                  <div
                    style={{
                      fontSize: "0.75rem",
                      color: "#9ca3af",
                    }}
                  >
                    Max Speed (km/h)
                  </div>
                </div>
              </div>
              {/* Heart Rate Chart */}
              <div style={{ height: "100px" }}>
                <canvas
                  ref={heartRateChartRef}
                  style={{ width: "100%", height: "100%" }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Analytics Panel - Expandable from bottom center */}
        {showAnalytics && routePoints.length > 0 && (
          <div
            style={{
              position: "absolute",
              bottom: "20px",
              left: "50%",
              transform: "translateX(-50%)",
              width: "600px",
              maxWidth: "90vw",
              zIndex: 1000,
            }}
          >
            <div className="widget-card">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "16px",
                }}
              >
                <h3
                  style={{
                    color: "white",
                    margin: 0,
                    fontSize: "1.2rem",
                    fontWeight: "700",
                  }}
                >
                  📊 Analytics Dashboard
                </h3>
                <button
                  onClick={() => setShowAnalytics(false)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#9ca3af",
                    cursor: "pointer",
                    fontSize: "18px",
                  }}
                >
                  ✕
                </button>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "20px",
                }}
              >
                {/* Elevation Chart */}
                <div>
                  <h4
                    style={{
                      color: "#d1d5db",
                      margin: "0 0 8px 0",
                      fontSize: "0.875rem",
                      fontWeight: "600",
                    }}
                  >
                    📈 Elevation Profile
                  </h4>
                  <div style={{ height: "120px" }}>
                    <canvas
                      ref={elevationChartRef}
                      style={{ width: "100%", height: "100%" }}
                    />
                  </div>
                </div>

                {/* Speed Chart */}
                <div>
                  <h4
                    style={{
                      color: "#d1d5db",
                      margin: "0 0 8px 0",
                      fontSize: "0.875rem",
                      fontWeight: "600",
                    }}
                  >
                    🏃 Speed Distribution
                  </h4>
                  <div style={{ height: "120px" }}>
                    <canvas
                      ref={speedChartRef}
                      style={{ width: "100%", height: "100%" }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Instructions */}
      <div
        style={{
          color: "#6b7280",
          textAlign: "center",
          marginTop: "15px",
          fontSize: "14px",
          fontWeight: "500",
        }}
      >
        {isRecording ? (
          <div style={{ color: "#ef4444" }}>
            🔴 Recording in progress... Real-time tracking active
          </div>
        ) : (
          <div>
            🖱️ Click anywhere on the map to create route points • ⏺️ Use record
            mode for real-time tracking • 🔥 Premium route experience
          </div>
        )}
      </div>
    </div>
  );
};

export default PremiumMap;
