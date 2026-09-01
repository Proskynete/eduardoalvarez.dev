import { Button, type ButtonProps } from "@eduardoalvarez/arrecife";

/**
 * A link that looks like a button, from the library's Button.
 *
 * It exists because `asChild` needs a real React child to clone, and markup
 * written in an .astro file arrives as an Astro render result. Wrapping the
 * anchor here keeps the pages free of hand-written button classes — which is how
 * this site ended up with two different primary buttons, one on the home and a
 * slightly different one on /about, with different ink, padding and radius.
 */
export default function LinkButton({
  href,
  label,
  external = false,
  variant = "primary",
  size,
}: {
  href: string;
  label: string;
  external?: boolean;
  variant?: ButtonProps["variant"];
  size?: ButtonProps["size"];
}) {
  return (
    <Button asChild variant={variant} size={size}>
      <a href={href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
        {label}
      </a>
    </Button>
  );
}
