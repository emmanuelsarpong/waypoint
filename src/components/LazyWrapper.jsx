import { Suspense } from "react";
import LoadingSpinner from "./LoadingSpinner";
import ErrorBoundary from "./ErrorBoundary";

function LazyWrapper({ children, fallback, className = "" }) {
  return (
    <ErrorBoundary>
      <Suspense
        fallback={
          fallback || (
            <div
              className={`min-h-[200px] flex items-center justify-center ${className}`}
            >
              <LoadingSpinner size="lg" />
            </div>
          )
        }
      >
        {children}
      </Suspense>
    </ErrorBoundary>
  );
}

export default LazyWrapper;
