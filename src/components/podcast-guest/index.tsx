import { AuthorCard, buttonVariants } from "@eduardoalvarez/arrecife";
import { Icon } from "@eduardoalvarez/arrecife/icons";
import { LinkedinLogo, XLogo } from "@phosphor-icons/react";

export interface Props {
  name: string;
  role: string;
  company?: string;
  linkedin?: string;
  twitter?: string;
  className?: string;
}

/**
 * A podcast guest, drawn by the library's `AuthorCard`.
 *
 * Both podcast pages were building this by hand and building it differently: a
 * 40px circle on the listing, a 56px one on the episode, initials computed with
 * two different `split`/`slice` chains, and the social links styled as pills on
 * one page and as bare glyphs on the other. `AuthorCard` owns the avatar, the
 * initials, the 52px measure and the name/role rhythm; the links go in `action`,
 * which is the slot it opens for exactly this.
 *
 * The glyphs are Phosphor's, drawn through the library's `Icon` — the same two
 * marks the footer and the article sidebar carry, at the same weight.
 *
 * Composed in React because `action` is a `ReactNode`. Nothing hydrates.
 */
export default function PodcastGuest({ name, role, company, linkedin, twitter, className }: Props) {
  const links = [
    ...(linkedin ? [{ label: "LinkedIn", href: linkedin, icon: <Icon as={LinkedinLogo} /> }] : []),
    ...(twitter ? [{ label: "X", href: twitter, icon: <Icon as={XLogo} /> }] : []),
  ];

  return (
    <AuthorCard
      className={className}
      name={name}
      role={company ? `${role} @ ${company}` : role}
      action={links.map(({ label, href, icon }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonVariants({ variant: "secondary", size: "sm" })}
          aria-label={`${label} de ${name}`}
        >
          {icon}
          {label}
        </a>
      ))}
    />
  );
}
