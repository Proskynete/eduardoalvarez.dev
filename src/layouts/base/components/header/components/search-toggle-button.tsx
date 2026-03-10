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
      className={`text-text-secondary hover:text-text-primary transition-colors duration-200 ${isInputVisible ? "ml-2" : ""}`}
      aria-label="Buscar"
    >
      {!isInputVisible ? <Icon.Search className="h-5 w-5" /> : <Icon.Close className="h-5 w-5" />}
    </button>
  );
}
