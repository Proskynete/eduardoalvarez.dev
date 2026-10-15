import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Text,
} from "@eduardoalvarez/arrecife";
import { useEffect, useRef, useState } from "react";

import { cookieCategories } from "../../settings/cookies";
import {
  type Consent,
  getConsent,
  isEurope,
  onConsentChange,
  OPEN_PREFERENCES_EVENT,
  setConsent,
} from "../../utils/consent";

/**
 * The first-visit notice and the preferences panel.
 *
 * The notice shows while there is no stored decision. Its buttons depend on the
 * region (`isEurope`): outside Europe statistics are already on, so it informs
 * («Entendido» / «Configurar»); in Europe nothing loads until the visitor
 * accepts, and «Rechazar», «Configurar» and «Aceptar» carry the same weight.
 * It is a small card in a corner: it never blocks scrolling.
 *
 * The panel is arrecife's Dialog (Radix): focus is trapped and returned, Esc
 * closes it. The footer's «./cookies» opens it through `openCookiePreferences`.
 * Applying the decision (loading or switching off GA, dropping the stored
 * theme) is not done here: whoever listens to `onConsentChange` does it.
 */
type Choices = Pick<Consent, "preferences" | "statistics">;

function currentChoices(): Choices {
  const { preferences, statistics } = getConsent();
  return { preferences, statistics };
}

export default function CookiePreferences() {
  // Rendered on the server with nothing showing; the decision is read on mount.
  const [noticeOpen, setNoticeOpen] = useState(false);
  const [europe, setEurope] = useState(true);
  const [panelOpen, setPanelOpen] = useState(false);
  const [choices, setChoices] = useState<Choices>({ preferences: true, statistics: false });
  // Radix returns focus to a DialogTrigger, and this panel has none: it opens
  // from the notice or from the footer. So the opener is kept by hand.
  const opener = useRef<HTMLElement | null>(null);

  const openPanel = () => {
    opener.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setChoices(currentChoices());
    setPanelOpen(true);
  };

  const restoreFocus = (event: Event) => {
    event.preventDefault();
    // The opener may be gone (the notice closes once there is a decision).
    const target = opener.current?.isConnected ? opener.current : document.getElementById("main-content");
    target?.focus();
  };

  useEffect(() => {
    const consent = getConsent();
    setEurope(isEurope());
    setNoticeOpen(!consent.decided);

    window.addEventListener(OPEN_PREFERENCES_EVENT, openPanel);
    const unsubscribe = onConsentChange(() => setNoticeOpen(false));
    return () => {
      window.removeEventListener(OPEN_PREFERENCES_EVENT, openPanel);
      unsubscribe();
    };
  }, []);

  const decide = (consent: Choices) => {
    setConsent(consent);
    setNoticeOpen(false);
    setPanelOpen(false);
  };

  return (
    <>
      {noticeOpen && (
        <div hidden={panelOpen} className="inset-x-4 bottom-4 sm:left-auto sm:right-4 sm:max-w-sm fixed z-50">
          <section
            role="region"
            aria-labelledby="cookie-notice-title"
            className="gap-step-sm rounded-card border-hairline bg-surface p-step-md shadow-standard flex flex-col border"
          >
            <Text as="h2" variant="ui" id="cookie-notice-title" className="font-display font-bold">
              {europe ? "¿Puedo medir tu visita?" : "Mido las visitas"}
            </Text>
            <Text as="p" variant="meta" tone="secondary">
              {europe
                ? "Uso Google Analytics para saber qué se lee y cómo llega la gente hasta aquí. Deja cookies, así que solo lo activo si aceptas. Puedes cambiar de opinión cuando quieras desde «./cookies», al pie de la página."
                : "Uso Google Analytics para saber qué se lee y así mejorar el sitio. Puedes cambiarlo cuando quieras desde «./cookies», al pie de la página."}
            </Text>
            <div className="gap-step-sm flex flex-wrap">
              {europe ? (
                <>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => decide({ preferences: false, statistics: false })}
                  >
                    Rechazar
                  </Button>
                  <Button variant="secondary" size="sm" onClick={openPanel}>
                    Configurar
                  </Button>
                  <Button variant="secondary" size="sm" onClick={() => decide({ preferences: true, statistics: true })}>
                    Aceptar
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="secondary" size="sm" onClick={openPanel}>
                    Configurar
                  </Button>
                  <Button variant="secondary" size="sm" onClick={() => decide({ preferences: true, statistics: true })}>
                    Entendido
                  </Button>
                </>
              )}
            </div>
          </section>
        </div>
      )}

      <Dialog open={panelOpen} onOpenChange={setPanelOpen}>
        <DialogContent className="max-h-svh overflow-y-auto" onCloseAutoFocus={restoreFocus}>
          <DialogHeader>
            <DialogTitle>Preferencias de cookies</DialogTitle>
            <DialogDescription>
              Elige qué guardo en tu navegador. Las necesarias siempre están activas; las demás, como prefieras.
            </DialogDescription>
          </DialogHeader>

          <div className="gap-step-md flex flex-col">
            {cookieCategories.map((category) => {
              const optional = category.id !== "necessary";
              const checked = optional ? choices[category.id as keyof Choices] : true;
              const switchId = `cookie-category-${category.id}`;
              return (
                <section
                  key={category.id}
                  aria-labelledby={`${switchId}-title`}
                  className="gap-step-xs border-hairline pt-step-sm flex flex-col border-t"
                >
                  <div className="gap-step-sm flex items-center justify-between">
                    <Text as="h3" variant="ui" id={`${switchId}-title`} className="font-bold">
                      <label htmlFor={switchId}>{category.title}</label>
                    </Text>
                    <div className="gap-step-xs flex items-center">
                      {!optional && (
                        <Text as="span" variant="meta" tone="secondary" id={`${switchId}-state`}>
                          Siempre activas
                        </Text>
                      )}
                      <Switch
                        id={switchId}
                        checked={checked}
                        disabled={!optional}
                        aria-describedby={optional ? `${switchId}-description` : `${switchId}-state`}
                        onCheckedChange={(value) =>
                          optional && setChoices((current) => ({ ...current, [category.id]: value }))
                        }
                      />
                    </div>
                  </div>
                  <Text as="p" variant="meta" tone="secondary" id={`${switchId}-description`}>
                    {category.description}
                  </Text>
                  <Accordion type="multiple">
                    <AccordionItem value={category.id}>
                      <AccordionTrigger headingLevel={4} className="py-step-xs text-meta text-text-secondary">
                        Ver qué se guarda ({category.items.length})
                      </AccordionTrigger>
                      <AccordionContent>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Nombre</TableHead>
                              <TableHead>Proveedor</TableHead>
                              <TableHead>Propósito</TableHead>
                              <TableHead>Duración</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {category.items.map((item) => (
                              <TableRow key={item.name}>
                                <TableCell>
                                  <code>{item.name}</code>
                                  <Text as="span" variant="meta" tone="muted" className="block">
                                    {item.storage}
                                  </Text>
                                </TableCell>
                                <TableCell>{item.provider}</TableCell>
                                <TableCell>{item.purpose}</TableCell>
                                <TableCell>{item.duration}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </section>
              );
            })}
          </div>

          <DialogFooter className="gap-step-sm flex flex-wrap">
            <Button variant="secondary" size="sm" onClick={() => decide({ preferences: false, statistics: false })}>
              Rechazar opcionales
            </Button>
            <Button variant="secondary" size="sm" onClick={() => decide(choices)}>
              Guardar selección
            </Button>
            <Button variant="secondary" size="sm" onClick={() => decide({ preferences: true, statistics: true })}>
              Aceptar todas
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
