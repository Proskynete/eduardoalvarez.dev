interface IconProps {
  width?: number;
  height?: number;
  className?: string;
}

export function ArrowLeftIcon({ width = 16, height = 16, className }: IconProps) {
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
      <path d="M19 12H5M12 5l-7 7 7 7" />
    </svg>
  );
}

export const ArrowLeftIcon_compat = ArrowLeftIcon;
