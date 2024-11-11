import type { SVGProps } from "react";

export const MailIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg width="800px" height="800px" viewBox="0 0 24 24" fill="none" {...props}>
    <path
      d="M4 7.00005L10.2 11.65C11.2667 12.45 12.7333 12.45 13.8 11.65L20 7"
      stroke={props.stroke}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <rect x="3" y="5" width="18" height="14" rx="2" stroke={props.stroke} strokeWidth="2" strokeLinecap="round" />
  </svg>
);
