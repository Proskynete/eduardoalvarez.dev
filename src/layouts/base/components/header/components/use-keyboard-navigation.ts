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

/**
 * Hook personalizado para navegación por teclado en búsqueda
 *
 * Maneja eventos de teclado (ArrowDown, ArrowUp, Enter, Escape)
 * para mejorar la accesibilidad y experiencia de usuario en la búsqueda.
 *
 * @param props - Configuración del hook
 * @param props.isSearchOpen - Indica si el panel de búsqueda está abierto
 * @param props.searchResults - Array de resultados de búsqueda
 * @param props.selectedIndex - Índice del resultado actualmente seleccionado
 * @param props.onArrowDown - Callback cuando se presiona flecha abajo
 * @param props.onArrowUp - Callback cuando se presiona flecha arriba
 * @param props.onEnter - Callback cuando se presiona Enter
 * @param props.onEscape - Callback cuando se presiona Escape
 *
 * @example
 * ```tsx
 * useKeyboardNavigation({
 *   isSearchOpen: true,
 *   searchResults: results,
 *   selectedIndex: 0,
 *   onArrowDown: () => setSelectedIndex(prev => prev + 1),
 *   onArrowUp: () => setSelectedIndex(prev => prev - 1),
 *   onEnter: () => navigateToSelected(),
 *   onEscape: () => closeSearch(),
 * });
 * ```
 *
 * @remarks
 * - Los eventos solo se manejan cuando isSearchOpen es true
 * - Previene el comportamiento por defecto del navegador
 * - Limpia los event listeners al desmontar el componente
 */
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

