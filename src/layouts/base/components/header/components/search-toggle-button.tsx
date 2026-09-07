import { Button } from "@eduardoalvarez/arrecife";

import { Icon } from "../../../../../assets/icons";

interface SearchToggleButtonProps {
  isInputVisible: boolean;
  onToggle: () => void;
}

/**
 * The library ships no icon set on purpose, so the glyph stays ours. What comes
 * from the system is the control: `tertiary` is the variant with no box, which is
 * what a bare glyph in the bar is, and `icon-sm` is the 32×32 square. Both demand
 * an `aria-label`, which this button already had.
 */
export default function SearchToggleButton({ isInputVisible, onToggle }: SearchToggleButtonProps) {
  return (
    <Button
      type="button"
      variant="tertiary"
      size="icon-sm"
      onClick={onToggle}
      className={isInputVisible ? "ml-step-xs" : undefined}
      aria-label={isInputVisible ? "Cerrar la búsqueda" : "Buscar"}
      aria-expanded={isInputVisible}
    >
      {!isInputVisible ? <Icon.Search className="h-5 w-5" /> : <Icon.Close className="h-5 w-5" />}
    </Button>
  );
}
