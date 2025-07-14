import AdvancedMapPremium from "../components/AdvancedMapPremium";

export default function MapPage({ sidebarOpen, isMobile }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        overflow: isMobile ? "visible" : "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <AdvancedMapPremium sidebarOpen={sidebarOpen} isMobile={isMobile} />
    </div>
  );
}
