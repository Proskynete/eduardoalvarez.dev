import { ArrowLeftIcon } from "./arrow-left";
import { ChevronRightIcon } from "./chevron-right";
import { CloseIcon } from "./close";
import { MenuIcon } from "./menu";
import { PlatformIcon } from "./platform";
import { SearchIcon } from "./search";

/**
 * Los glifos del proyecto.
 *
 * La librería no envía set de iconos a propósito — «Icons are yours, the way
 * they are drawn is not» — así que estos se quedan. Lo que se fue son los
 * duplicados: GitHub, LinkedIn, X, Instagram, RSS, Mail y Newsletter estaban
 * dibujados aquí y también en `@eduardoalvarez/arrecife/social`, que es de
 * donde los toman ahora el footer, la barra de compartir y las tarjetas de
 * invitados. Y los ocho del reproductor —play, pause, volumen, saltos, spinner,
 * reintento— murieron con el reproductor propio: `AudioPlayer` de la librería
 * trae los suyos.
 *
 * Quedan seis, y ninguno de los seis existe en el sistema.
 */
export const Icon = {
  ArrowLeft: ArrowLeftIcon,
  ChevronRight: ChevronRightIcon,
  Close: CloseIcon,
  Menu: MenuIcon,
  Platform: PlatformIcon,
  Search: SearchIcon,
};
