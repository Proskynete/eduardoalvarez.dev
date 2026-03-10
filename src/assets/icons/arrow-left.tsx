import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface IconProps {
  width?: number;
  height?: number;
  className?: string;
}

export function ArrowLeftIcon({ width, height, className }: IconProps) {
  return (
    <FontAwesomeIcon
      icon={faArrowLeft}
      className={className}
      style={!className ? { width: width ?? 16, height: height ?? 16 } : undefined}
    />
  );
}

export const ArrowLeftIcon_compat = ArrowLeftIcon;
