import {
  Button,
  Sheet,
  SheetBody,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  Text,
} from "@eduardoalvarez/arrecife";
import { Logo } from "@eduardoalvarez/arrecife/brand";
import { Icon } from "@eduardoalvarez/arrecife/icons";
import { List } from "@phosphor-icons/react";
import { useState } from "react";

import { trackEvent } from "../../../../../utils/analytics";
import { navItems } from "../constants";

interface MobileProps {
  version?: string;
  pathname: string;
}

/**
 * The drawer is the library's `Sheet` now.
 *
 * What went with it: the focus trap written by hand over `querySelectorAll`, the
 * `Escape` listener, the `aria-modal` div pretending to be a dialog, the
 * `document.body.style.overflow` juggling and the close button. Radix — which is
 * what `Sheet` sits on — does all five, and does them right: the trap follows the
 * DOM order instead of a snapshot taken when the drawer opened, and focus returns
 * to the trigger on close, which the hand-written version never did.
 *
 * The CLI content stays: it is this site's voice, not something the system has an
 * opinion about.
 */
export default function Mobile({ version, pathname }: MobileProps) {
  const [open, setOpen] = useState(false);
  const visibleItems = navItems.filter((item) => item.show);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      {/* `SheetTrigger asChild` y no un `onClick` propio: envuelto por el
          disparador, Radix pone `aria-expanded`, `aria-controls` y `data-state`
          solo, y —lo que importa— devuelve el foco a ESTE botón al cerrar. Con
          un `onClick` suelto el cajón abría igual, pero al salir el foco caía
          en `<body>` y el teclado tenía que recorrer la página entera. */}
      <SheetTrigger asChild>
        <Button variant="tertiary" size="icon-sm" aria-label="Abrir menú de navegación" className="sm:hidden">
          <Icon as={List} />
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="sm:hidden">
        <SheetHeader>
          {/* The isotype comes from the library instead of the hand-inlined SVG
              that carried `#35d6c0` written twice — the one literal hex the
              system forbids, and the reason the mark never followed the theme. */}
          <SheetTitle className="gap-step-sm flex items-center">
            <Logo background="dark" className="light:hidden" />
            <Logo background="light" className="hidden light:inline-flex" />
          </SheetTitle>
        </SheetHeader>

        <SheetBody className="font-mono">
          {/* Claude CLI prompt — easter egg */}
          <div className="gap-step-xs mb-1 flex items-center">
            <Text variant="meta" tone="muted" as="span">
              ~/eduardoalvarez.dev
            </Text>
          </div>

          <div className="gap-step-xs mb-step-lg flex items-start">
            <Text variant="meta" tone="secondary" as="span">
              ¿A dónde quieres navegar?
            </Text>
          </div>

          {/* CLI flags — easter egg */}
          <div className="border-hairline mb-step-lg pl-step-md flex flex-col gap-1.5 border-l">
            <div className="gap-step-sm flex items-center">
              <span className="text-accent text-label w-24 shrink-0">--help</span>
              <Text variant="label" tone="muted" as="span">
                Navegación de la web
              </Text>
            </div>
            <div className="gap-step-sm flex items-center">
              <span className="text-accent text-label w-24 shrink-0">--version</span>
              <Text variant="label" tone="muted" as="span">
                v{version ?? "—"}
              </Text>
            </div>
          </div>

          <nav className="flex flex-col gap-1" aria-label="Navegación móvil">
            {visibleItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={() => {
                    trackEvent("navigation_click", { link: item.name });
                    setOpen(false);
                  }}
                  aria-current={isActive ? "page" : undefined}
                  className={`group gap-step-sm px-step-sm py-step-sm rounded-chip transition-standard focus-ring flex items-start ${
                    isActive
                      ? "text-accent pointer-events-none"
                      : "text-text-secondary hover:bg-surface-raised hover:text-text-primary"
                  }`}
                >
                  <span
                    className={`text-label mt-0.5 shrink-0 ${isActive ? "text-accent" : "text-text-muted group-hover:text-accent"}`}
                  >
                    {isActive ? "◆" : "◇"}
                  </span>

                  <span className="flex flex-col gap-0.5">
                    <span className="text-ui">
                      <Text variant="label" tone={isActive ? "accent" : "muted"} as="span" className="font-mono">
                        ./{item.name.toLowerCase()}
                      </Text>
                    </span>
                    {item.description && (
                      <Text variant="label" tone="muted" as="span" className="font-mono">
                        {item.description}
                      </Text>
                    )}
                  </span>
                </a>
              );
            })}
          </nav>

          {/* Blinking cursor */}
          <div className="text-accent mt-step-lg gap-step-xs flex items-center">
            <span>❯</span>
            <span className="bg-accent rounded-xs ml-1 inline-block h-3 w-1 motion-safe:animate-ping motion-safe:duration-75" />
          </div>
        </SheetBody>

        <SheetFooter className="justify-start">
          <Text variant="meta" tone="muted" as="span" className="select-none">
            cd ~/eduardoalvarez.dev
          </Text>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
