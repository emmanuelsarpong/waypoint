import { useEffect, useState } from "react";

// Hook for managing focus trapping in modals/sidebars
export function useFocusTrap(isActive, containerRef) {
  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const container = containerRef.current;
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTab = (e) => {
      if (e.key !== "Tab") return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    const handleEscape = (e) => {
      if (e.key === "Escape") {
        // Dispatch a custom event that components can listen to
        const escapeEvent = new CustomEvent("modal-escape");
        container.dispatchEvent(escapeEvent);
      }
    };

    document.addEventListener("keydown", handleTab);
    document.addEventListener("keydown", handleEscape);

    // Focus the first element when activated
    if (firstElement) {
      firstElement.focus();
    }

    return () => {
      document.removeEventListener("keydown", handleTab);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isActive, containerRef]);
}

// Hook for managing reduced motion preference
export function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return prefersReducedMotion;
}

// Hook for managing high contrast mode
export function useHighContrast() {
  const [highContrast, setHighContrast] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-contrast: high)");
    setHighContrast(mediaQuery.matches);

    const handleChange = (e) => setHighContrast(e.matches);
    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return highContrast;
}

// Hook for keyboard navigation
export function useKeyboardNavigation() {
  const [keyboardUser, setKeyboardUser] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Tab") {
        setKeyboardUser(true);
      }
    };

    const handleMouseDown = () => {
      setKeyboardUser(false);
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleMouseDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleMouseDown);
    };
  }, []);

  useEffect(() => {
    if (keyboardUser) {
      document.body.classList.add("keyboard-navigation");
    } else {
      document.body.classList.remove("keyboard-navigation");
    }
  }, [keyboardUser]);

  return keyboardUser;
}
