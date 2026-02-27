interface SearchInputProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onFocus: () => void;
  isSearchOpen?: boolean;
  selectedIndex?: number;
}

export default function SearchInput({
  searchQuery,
  onSearchChange,
  onFocus,
  isSearchOpen = false,
  selectedIndex = -1,
}: SearchInputProps) {
  return (
    <div className="relative flex items-center px-3 rounded-md bg-transparent border border-surface-border focus-within:border-accent transition-colors duration-300">
      <input
        type="text"
        placeholder="Buscar artículos..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        onFocus={onFocus}
        className="w-64 bg-transparent border-0 focus:ring-0 focus:outline-none text-text-primary placeholder:text-text-muted"
        autoFocus
        role="combobox"
        aria-label="Buscar artículos"
        aria-expanded={isSearchOpen}
        aria-controls="search-results"
        aria-activedescendant={selectedIndex >= 0 ? `result-${selectedIndex}` : undefined}
        aria-autocomplete="list"
      />
    </div>
  );
}
