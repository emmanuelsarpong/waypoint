import AdvancedMapPremium from "../components/AdvancedMapPremium";

export default function MapPage({ sidebarOpen, isMobile }) {
  return (
    <div
      style={{
        width: "100%",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <AdvancedMapPremium sidebarOpen={sidebarOpen} isMobile={isMobile} />
    </div>
  );
}
