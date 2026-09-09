import { Button } from "@eduardoalvarez/arrecife";
import { Icon } from "@eduardoalvarez/arrecife/icons";
import { MagnifyingGlassIcon, XIcon } from "@phosphor-icons/react";

interface SearchToggleButtonProps {
  isInputVisible: boolean;
  onToggle: () => void;
}

/**
 * The glyphs are Phosphor's, drawn through the library's `Icon`. The two that
 * were here — a circle with a stick, two crossed lines — were hand-drawn at
 * stroke 2 on a 24 grid and sized `h-5 w-5` at the call site, which is the
 * hand-sizing the system replaces: at 1em the glyph takes the size of the text
 * around it and nobody picks a number.
 *
 * What comes from the system is still the control: `tertiary` is the variant
 * with no box, which is what a bare glyph in the bar is, and `icon-sm` is the
 * 32×32 square. Both demand an `aria-label`, which this button already had —
 * so the icons stay decorative and carry no `label` of their own.
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
      <Icon as={isInputVisible ? XIcon : MagnifyingGlassIcon} />
    </Button>
  );
}
