import { Avatar, AvatarFallback, Text } from "@eduardoalvarez/arrecife";

import { initials } from "../../utils/podcasts";

export interface Props {
  guests: readonly { name: string }[];
}

/**
 * Los invitados del panel de escucha: cara e iniciales, nada más. Las tarjetas
 * con rol, empresa y enlaces siguen siendo `PodcastGuest`, más abajo; esto sólo
 * dice quién habla, que es lo que hace falta para decidir si le das al play.
 *
 * Compuesto en React y no en la plantilla `.astro` porque `Avatar` es de Radix
 * y `AvatarFallback` lee su contexto. En un `.astro` cada componente React se
 * renderiza como su propia raíz —los hijos cruzan como slot de Astro, no como
 * `children` de React— así que el contexto no llega y el fallback revienta con
 * «`AvatarFallback` must be used within `Avatar`». Es el mismo motivo por el
 * que el pie del sitio y las tarjetas de invitado viven en `.tsx`.
 *
 * No hidrata: Astro lo renderiza a HTML estático.
 */
export default function PodcastGuestChips({ guests }: Props) {
  if (guests.length === 0) return null;

  return (
    <div className="gap-step-sm flex flex-wrap items-center">
      {guests.map((guest) => (
        <span key={guest.name} className="gap-step-xs flex items-center">
          <Avatar size="sm">
            <AvatarFallback>{initials(guest.name)}</AvatarFallback>
          </Avatar>
          <Text variant="label" tone="secondary" as="span">
            {guest.name}
          </Text>
        </span>
      ))}
    </div>
  );
}
