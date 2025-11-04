import { useEffect } from "react";

interface UseKeyboardNavigationProps {
  isSearchOpen: boolean;
  searchResults: unknown[];
  selectedIndex: number;
  onArrowDown: () => void;
  onArrowUp: () => void;
  onEnter: () => void;
  onEscape: () => void;
}

export function useKeyboardNavigation({
  isSearchOpen,
  searchResults,
  selectedIndex,
  onArrowDown,
  onArrowUp,
  onEnter,
  onEscape,
}: UseKeyboardNavigationProps) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isSearchOpen) return;

      if (event.key === "ArrowDown") {
        event.preventDefault();
        onArrowDown();
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        onArrowUp();
      } else if (event.key === "Enter") {
        event.preventDefault();
        onEnter();
      } else if (event.key === "Escape") {
        event.preventDefault();
        onEscape();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isSearchOpen, searchResults, selectedIndex, onArrowDown, onArrowUp, onEnter, onEscape]);
}

