import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Homepage from "./pages/Homepage";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Pricing from "./pages/Pricing";
import Product from "./pages/Product";
import NotFound from "./pages/NotFound";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";

function App() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="flex bg-black text-white">
      {/* Sidebar */}
      <Sidebar isScrolled={isScrolled} />

      {/* Main Content */}
      <div
        className={`flex flex-col flex-1 ${
          sidebarOpen ? "ml-[250px]" : "ml-0"
        } transition-all duration-300`}
      >
        {/* Top Bar */}
        <Topbar toggleSidebar={() => setSidebarOpen((prev) => !prev)} />

        {/* Main Content */}
        <main className="mt-[70px] w-full max-w-[1200px] mx-auto px-6">
          <div className="mr-20">
            <Routes>
              <Route path="/" element={<Homepage />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/product" element={<Product />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
