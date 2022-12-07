import { useState, useEffect } from "react";

interface Dimensions {
  width?: number;
  height?: number;
}

const defaultDimensions: Dimensions = {
  width: undefined,
  height: undefined,
};

export const useWindowDimensions = () => {
  const [dimensions, setDimensions] = useState<Dimensions>(defaultDimensions);

  useEffect(() => {
    function handleResize() {
      const { innerWidth: width, innerHeight: height } = window;
      setDimensions({ width, height });
    }

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return dimensions;
};
