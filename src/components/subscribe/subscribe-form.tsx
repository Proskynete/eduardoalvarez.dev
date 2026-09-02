import { NewsletterForm, type NewsletterState } from "@eduardoalvarez/arrecife";
import { useEffect, useRef, useState } from "react";

type RespuestaApi = {
  success?: boolean;
  message?: string;
  errors?: { path?: string[]; message: string }[];
};

/**
 * El formulario vive en React porque `NewsletterForm` es el que sabe pintar los
 * estados — enviando, éxito, error — y en la versión anterior eso estaba escrito
 * a mano con `classList.add("hidden")` sobre seis divs.
 *
 * Esa versión además tenía el modo claro roto: los campos llevaban `bg-[#0b1620]`
 * fijo, el valor oscuro, así que sobre el fondo crema quedaba texto casi negro
 * sobre caja casi negra. La librería usa tokens y eso desaparece solo.
 */
export function SubscribeForm() {
  const [estado, setEstado] = useState<NewsletterState>("reposo");
  const [mensaje, setMensaje] = useState<string>();
  const contenedor = useRef<HTMLDivElement>(null);

  // El éxito se borra solo a los 5 segundos, como antes: el panel vuelve a
  // quedar disponible en lugar de dejar el aviso clavado en la página.
  useEffect(() => {
    if (estado !== "exito") return;
    const t = setTimeout(() => setEstado("reposo"), 5000);
    return () => clearTimeout(t);
  }, [estado]);

  async function suscribir(email: string, name?: string) {
    setEstado("enviando");
    setMensaje(undefined);

    try {
      const respuesta = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name?.trim(), email: email.trim() }),
      });
      const datos: RespuestaApi = await respuesta.json();

      if (respuesta.ok && datos.success) {
        setMensaje(datos.message);
        setEstado("exito");
        // Vaciar los campos, como hacía la versión anterior: dejarlos llenos
        // después de confirmar invita a mandar el mismo correo dos veces.
        // `NewsletterForm` no expone el <form>, así que se busca en el árbol.
        contenedor.current?.querySelector("form")?.reset();
        return;
      }

      // La API ya devuelve el primer error de Zod como `message`, así que el
      // aviso general dice cuál de los dos campos falla sin repetirlo debajo.
      setMensaje(datos.message ?? "Error al procesar la suscripción");
      setEstado("error");
    } catch {
      setMensaje("Error de conexión. Por favor, verifica tu internet e intenta de nuevo.");
      setEstado("error");
    }
  }

  return (
    <div ref={contenedor}>
      <NewsletterForm
        title="Artículos sobre liderazgo, plataforma y la era de la IA"
        description="Una edición mensual. Directamente en tu correo, sin intermediarios y sin ruido."
        state={estado}
        onSubmitEmail={suscribir}
        nameField
        namePlaceholder="Tu nombre"
        nameInputProps={{ minLength: 2, maxLength: 50 }}
        fieldLabel="Email"
        placeholder="tu@correo.dev"
        successMessage={mensaje}
        errorMessage={mensaje}
        disclaimer="Sin spam. Solo cuando tengo algo que vale."
        expresion="wink"
        // El aviso de error se va en cuanto la persona corrige el campo, que es lo
        // que hacía la versión anterior con un listener por input. `NewsletterForm`
        // no expone onChange, pero sí reparte el resto de props sobre su <section>,
        // así que el evento se recoge donde burbujea.
        onInput={() => setEstado((actual) => (actual === "error" ? "reposo" : actual))}
        className="md:pr-[330px]"
      />
    </div>
  );
}
