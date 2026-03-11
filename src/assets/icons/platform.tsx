export function PlatformIcon({
  path,
  width,
  height,
  className,
}: {
  path: string;
  width?: number;
  height?: number;
  className?: string;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      width={width}
      height={height}
      className={className}
    >
      <path d={path} />
    </svg>
  );
}
