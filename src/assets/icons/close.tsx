interface IconProps {
  width?: number;
  height?: number;
  className?: string;
}

export function CloseIcon({ width = 16, height = 16, className }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}

export const CloseIcon_compat = CloseIcon;
