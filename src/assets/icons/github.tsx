import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface IconProps {
  width?: number;
  height?: number;
  className?: string;
}

export function GithubIcon({ width, height, className }: IconProps) {
  return (
    <FontAwesomeIcon
      icon={faGithub}
      className={className}
      style={!className ? { width: width ?? 20, height: height ?? 20 } : undefined}
    />
  );
}
