import { Icon } from "../../../../../assets/icons";

interface SearchToggleButtonProps {
  isInputVisible: boolean;
  onToggle: () => void;
}

export default function SearchToggleButton({ isInputVisible, onToggle }: SearchToggleButtonProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`text-gray-300 hover:text-gray-100 transition-colors duration-200 ${isInputVisible ? "ml-2" : ""}`}
      aria-label="Buscar"
    >
      {!isInputVisible ? <Icon.Search className="h-6 w-6" /> : <Icon.Close className="h-6 w-6" />}
    </button>
  );
}

