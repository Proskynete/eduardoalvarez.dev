import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface IconProps {
  width?: number;
  height?: number;
  className?: string;
  stroke?: string;
}

export function MailIcon({ width, height, className }: IconProps) {
  return (
    <FontAwesomeIcon
      icon={faEnvelope}
      className={className}
      style={!className ? { width: width ?? 16, height: height ?? 16 } : undefined}
    />
  );
}
