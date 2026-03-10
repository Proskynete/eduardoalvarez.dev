export function PlayIcon({ width, height, className }: { width?: number; height?: number; className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      width={width}
      height={height}
      className={className}
    >
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}
