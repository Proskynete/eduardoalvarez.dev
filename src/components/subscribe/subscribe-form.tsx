import { NewsletterForm, type NewsletterState } from "@eduardoalvarez/arrecife";
import { Mascot } from "@eduardoalvarez/arrecife/brand";
import { useEffect, useRef, useState } from "react";

import { trackEvent } from "../../utils/analytics";

// The slice of Cloudflare's Turnstile API this form uses. Loaded by script, not npm.
type Turnstile = {
  render(el: HTMLElement, options: { sitekey: string; appearance: "interaction-only" }): string;
  getResponse(widgetId: string): string | undefined;
  reset(widgetId: string): void;
};

declare global {
  interface Window {
    turnstile?: Turnstile;
  }
}

const TURNSTILE_SCRIPT = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
const SITE_KEY = import.meta.env.PUBLIC_TURNSTILE_SITE_KEY;

type ApiResponse = {
  success?: boolean;
  message?: string;
  errors?: { path?: string[]; message: string }[];
};

/**
 * The form lives in React because `NewsletterForm` is what knows how to draw the
 * states — sending, success, error — and the previous version wrote that by hand
 * with `classList.add("hidden")` over six divs.
 *
 * That version also had light mode broken: the fields carried a frozen
 * `bg-[#0b1620]`, the dark value, so on the cream background it was near-black
 * text on a near-black box. The library uses tokens and that disappears.
 */
export function SubscribeForm() {
  const [state, setState] = useState<NewsletterState>("idle");
  const [message, setMessage] = useState<string>();
  const container = useRef<HTMLDivElement>(null);
  const honeypot = useRef<HTMLInputElement>(null);
  const turnstileSlot = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string>(undefined);

  // Turnstile stays invisible unless Cloudflare doubts. Without a site key
  // (unit and e2e tests) the script is not loaded and the API answers 400.
  useEffect(() => {
    if (!SITE_KEY) return;
    const render = () => {
      if (window.turnstile && turnstileSlot.current && !widgetId.current) {
        widgetId.current = window.turnstile.render(turnstileSlot.current, {
          sitekey: SITE_KEY,
          appearance: "interaction-only",
        });
      }
    };
    if (window.turnstile) {
      render();
      return;
    }

    const script =
      document.querySelector<HTMLScriptElement>(`script[src="${TURNSTILE_SCRIPT}"]`) ??
      document.head.appendChild(
        Object.assign(document.createElement("script"), { src: TURNSTILE_SCRIPT, async: true }),
      );
    script.addEventListener("load", render);
    return () => script.removeEventListener("load", render);
  }, []);

  // Success clears itself after 5 seconds, as before: the panel becomes
  // available again instead of pinning the notice to the page.
  useEffect(() => {
    if (state !== "success") return;
    const t = setTimeout(() => setState("idle"), 5000);
    return () => clearTimeout(t);
  }, [state]);

  async function subscribe(email: string, name?: string) {
    setState("sending");
    setMessage(undefined);

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name?.trim(),
          email: email.trim(),
          website: honeypot.current?.value ?? "",
          turnstileToken: widgetId.current ? window.turnstile?.getResponse(widgetId.current) : undefined,
        }),
      });
      const data: ApiResponse = await response.json();

      if (response.ok && data.success) {
        setMessage(data.message);
        setState("success");
        // The conversion that matters on this site. No email or name in the params.
        trackEvent("sign_up", { method: "newsletter" });
        // Clear the fields, as the previous version did: leaving them filled
        // after confirming invites sending the same address twice.
        // `NewsletterForm` does not expose the <form>, so it is found in the tree.
        container.current?.querySelector("form")?.reset();
        return;
      }

      // The API already returns the first Zod error as `message`, so the
      // general notice names which field failed without repeating it below.
      setMessage(data.message ?? "No pude completar la suscripción. Intenta de nuevo.");
      setState("error");
    } catch {
      setMessage("No hay conexión. Revisa tu internet e intenta de nuevo.");
      setState("error");
    } finally {
      // A Turnstile token works once: the next submit needs a fresh one.
      if (widgetId.current) window.turnstile?.reset(widgetId.current);
    }
  }

  return (
    <div ref={container}>
      {/* Honeypot. `NewsletterForm` takes no children, so it sits beside the
          form; bots that fill every input on the page fill it too. */}
      <input
        ref={honeypot}
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="sr-only"
      />
      <NewsletterForm
        title="Artículos sobre desarrollo con IA y Spec-Driven Development"
        description="Una edición al mes, directo a tu correo."
        state={state}
        onSubmitEmail={subscribe}
        nameField
        namePlaceholder="Tu nombre"
        nameInputProps={{ minLength: 2, maxLength: 50 }}
        fieldLabel="Correo"
        placeholder="tu@correo.dev"
        successMessage={message}
        errorMessage={message}
        disclaimer="Sin spam. Una vez al mes, y puedes darte de baja cuando quieras."
        // One mascot per piece (manual § 04): the desk pose is the panel's
        // illustration, so the disclaimer carries no face.
        aside={
          <Mascot
            pose="desk"
            aria-hidden="true"
            width={362}
            height={278}
            loading="lazy"
            decoding="async"
            className="pointer-events-none object-contain object-bottom"
          />
        }
        // The error notice goes as soon as the person edits a field, which the
        // previous version did with a listener per input. `NewsletterForm`
        // exposes no onChange, but it does spread the rest of its props onto
        // its <section>, so the event is caught where it bubbles.
        onInput={() => setState((current) => (current === "error" ? "idle" : current))}
      />
      <div ref={turnstileSlot} />
    </div>
  );
}
