import { Icon } from "../../../../../assets/icons";

interface SearchInputProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onFocus: () => void;
  onClear: () => void;
}

export default function SearchInput({ searchQuery, onSearchChange, onFocus, onClear }: SearchInputProps) {
  return (
    <div className="relative flex items-center pr-3 rounded-md bg-transparent border border-gray-700 focus-within:border-primary-600 transition-colors duration-300">
      <div className="relative">
        <input
          type="text"
          placeholder="Buscar artículos..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          onFocus={onFocus}
          className="w-64 bg-transparent border-0 focus:ring-0"
          autoFocus
        />

        {searchQuery && (
          <button
            type="button"
            onClick={onClear}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-100 transition-colors duration-200"
            aria-label="Limpiar búsqueda"
          >
            <Icon.Close className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}

