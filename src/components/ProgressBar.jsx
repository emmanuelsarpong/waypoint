import { useEffect } from "react";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

NProgress.configure({ showSpinner: false });

export default function ProgressBar({ loading }) {
  useEffect(() => {
    if (loading) NProgress.start();
    else NProgress.done();
    return () => NProgress.done();
  }, [loading]);

  return (
    <style>
      {`
        #nprogress .bar {
          background: linear-gradient(90deg, #ff7eb3, #ff758c, #a29bfe);
          height: 4px;
        }
      `}
    </style>
  );
}
