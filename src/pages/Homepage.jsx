import heroImage from "../assets/AdobeStock_466481959.jpeg";
import Button from "../components/Button";

function Homepage() {
  return (
    <div
      className="hero-section flex flex-col items-center justify-center text-center"
      style={{
        backgroundImage: `url(${heroImage})`,
        backgroundSize: "cover", 
        backgroundPosition: "center", 
        backgroundRepeat: "no-repeat", 
        backgroundColor: "black", 
        height: "500px", 
        borderRadius: "5px", 
        overflow: "hidden", 
        margin: "0 30px 0 0", 
        backdropFilter: "blur(15px)", 
        WebkitBackdropFilter: "blur(15px)", 
        border: "none",
      }}
    >
      <h1 className="text-4xl font-bold text-white mb-4">
        Track the Path. Master the Journey.
      </h1>
      <p className="text-lg text-neutral-300 mb-6">
        Waypoint helps you log your outdoor runs, walks, and rides—so you can
        move with purpose.
      </p>
      <Button
        onClick={() => console.log("Get Started clicked")}
        className="bg-white text-black px-6 py-3 rounded-md hover:bg-neutral-200"
      >
        Get Started
      </Button>
    </div>
  );
}

export default Homepage;