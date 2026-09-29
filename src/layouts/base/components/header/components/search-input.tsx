import { Input } from "@eduardoalvarez/arrecife";

interface SearchInputProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onFocus: () => void;
  isSearchOpen?: boolean;
  selectedIndex?: number;
}

/**
 * The field is the library's `Input`. The wrapper div that hand-drew the border
 * and the focus ring is gone with it — `Input` already carries the control
 * height, the radius, the hairline and the bioluz ring, and it follows the theme,
 * which the hand-written `border-border` on a transparent ground did not.
 *
 * The combobox attributes stay here: they describe THIS widget's relationship
 * with its listbox, and the library takes no opinion on them.
 */
export default function SearchInput({
  searchQuery,
  onSearchChange,
  onFocus,
  isSearchOpen = false,
  selectedIndex = -1,
}: SearchInputProps) {
  return (
    <Input
      type="text"
      placeholder="Buscar artículos..."
      value={searchQuery}
      onChange={(e) => onSearchChange(e.target.value)}
      onFocus={onFocus}
      className="w-64"
      autoFocus
      role="combobox"
      aria-label="Buscar artículos"
      aria-expanded={isSearchOpen}
      aria-controls="search-results"
      aria-activedescendant={selectedIndex >= 0 ? `result-${selectedIndex}` : undefined}
      aria-autocomplete="list"
    />
  );
}
