import { NewsletterForm, type NewsletterState } from "@eduardoalvarez/arrecife";
import { Mascot } from "@eduardoalvarez/arrecife/brand";
import { useEffect, useRef, useState } from "react";

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
        body: JSON.stringify({ name: name?.trim(), email: email.trim() }),
      });
      const data: ApiResponse = await response.json();

      if (response.ok && data.success) {
        setMessage(data.message);
        setState("success");
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
    }
  }

  return (
    <div ref={container}>
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
    </div>
  );
}
