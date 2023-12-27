import { useEffect, useState } from "react";

const ScrollingProgressBar = () => {
  const [state, setState] = useState<number>(0);

  useEffect(() => {
    const onScroll = () => {
      const winScroll =
        document.body.scrollTop || document.documentElement.scrollTop;
      const height =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;

      setState(scrolled);
    };

    window.addEventListener("scroll", onScroll);

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className="top-0 sticky z-50 h-[5px] bg-teal-700 transition-[width]"
      style={{ width: `${state}%` }}
    />
  );
};

export default ScrollingProgressBar;
