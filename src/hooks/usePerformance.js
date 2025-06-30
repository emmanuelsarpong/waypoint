import { useEffect } from "react";

// Performance monitoring hook
export function usePerformanceMonitoring() {
  useEffect(() => {
    // Web Vitals monitoring
    if ("PerformanceObserver" in window) {
      // Largest Contentful Paint (LCP)
      const lcpObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          console.log("LCP:", entry.startTime);
          // In production, send to analytics
        }
      });
      lcpObserver.observe({ entryTypes: ["largest-contentful-paint"] });

      // First Input Delay (FID)
      const fidObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          console.log("FID:", entry.processingStart - entry.startTime);
          // In production, send to analytics
        }
      });
      fidObserver.observe({ entryTypes: ["first-input"] });

      // Cumulative Layout Shift (CLS)
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) {
            console.log("CLS:", entry.value);
            // In production, send to analytics
          }
        }
      });
      clsObserver.observe({ entryTypes: ["layout-shift"] });

      return () => {
        lcpObserver.disconnect();
        fidObserver.disconnect();
        clsObserver.disconnect();
      };
    }
  }, []);
}

// Resource loading performance
export function useResourcePerformance() {
  useEffect(() => {
    window.addEventListener("load", () => {
      // Navigation timing
      const navigation = performance.getEntriesByType("navigation")[0];
      if (navigation) {
        console.log(
          "Page Load Time:",
          navigation.loadEventEnd - navigation.fetchStart
        );
        console.log(
          "DOM Content Loaded:",
          navigation.domContentLoadedEventEnd - navigation.fetchStart
        );
        console.log(
          "First Byte:",
          navigation.responseStart - navigation.fetchStart
        );
      }

      // Resource timing
      const resources = performance.getEntriesByType("resource");
      resources.forEach((resource) => {
        if (resource.name.includes(".js") || resource.name.includes(".css")) {
          console.log(`${resource.name}: ${resource.duration}ms`);
        }
      });
    });
  }, []);
}

// Memory usage monitoring
export function useMemoryMonitoring() {
  useEffect(() => {
    if ("memory" in performance) {
      const logMemory = () => {
        const memory = performance.memory;
        console.log("Memory Usage:", {
          used: Math.round(memory.usedJSHeapSize / 1048576) + " MB",
          total: Math.round(memory.totalJSHeapSize / 1048576) + " MB",
          limit: Math.round(memory.jsHeapSizeLimit / 1048576) + " MB",
        });
      };

      logMemory();
      const interval = setInterval(logMemory, 30000); // Log every 30 seconds

      return () => clearInterval(interval);
    }
  }, []);
}
