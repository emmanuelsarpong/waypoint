import { useState } from "react";
import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";

function OptimizedImage({
  src,
  alt,
  className = "",
  placeholderColor = "bg-neutral-800",
  blurDataURL,
  priority = false,
  ...props
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
    skip: priority, // Skip intersection observer for priority images
  });

  const shouldLoad = priority || inView;

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setHasError(true);
    setIsLoaded(true);
  };

  return (
    <div
      ref={ref}
      className={`relative overflow-hidden ${className}`}
      {...props}
    >
      {/* Placeholder */}
      <div
        className={`absolute inset-0 ${placeholderColor} ${
          isLoaded ? "opacity-0" : "opacity-100"
        } 
                   transition-opacity duration-300 ease-in-out`}
      >
        {blurDataURL && (
          <img
            src={blurDataURL}
            alt=""
            className="w-full h-full object-cover blur-sm scale-110"
            aria-hidden="true"
          />
        )}
        {!blurDataURL && (
          <div className="absolute inset-0 bg-gradient-to-br from-neutral-700 to-neutral-900 animate-pulse" />
        )}
      </div>

      {/* Main Image */}
      {shouldLoad && !hasError && (
        <motion.img
          src={src}
          alt={alt}
          className={`w-full h-full object-cover transition-opacity duration-300 ease-in-out
                     ${isLoaded ? "opacity-100" : "opacity-0"}`}
          onLoad={handleLoad}
          onError={handleError}
          initial={{ scale: 1.1 }}
          animate={{
            scale: isLoaded ? 1 : 1.1,
            opacity: isLoaded ? 1 : 0,
          }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          loading={priority ? "eager" : "lazy"}
        />
      )}

      {/* Error State */}
      {hasError && (
        <div className="absolute inset-0 bg-neutral-800 flex items-center justify-center">
          <div className="text-neutral-500 text-center">
            <svg
              className="w-8 h-8 mx-auto mb-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-xs">Image failed to load</p>
          </div>
        </div>
      )}

      {/* Loading indicator for priority images */}
      {priority && !isLoaded && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}

export default OptimizedImage;
