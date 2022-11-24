import { useState, useEffect } from "react";

const defaultDimensions = {
  width: 0,
  height: 0,
};

export const useWindowDimensions = () => {
  const [windowDimensions, setWindowDimensions] = useState(defaultDimensions);

  useEffect(() => {
    function handleResize() {
      const { innerWidth: width, innerHeight: height } = window;
      setWindowDimensions({ width, height });
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowDimensions;
};
