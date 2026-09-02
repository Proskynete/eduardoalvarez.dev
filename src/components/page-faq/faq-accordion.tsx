import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@eduardoalvarez/arrecife";

import type { FAQItem } from "../../interfaces";

/**
 * The questions, composed in React because Radix needs real React children to
 * track which item is open. Written in the .astro file they would arrive as
 * Astro render results and the root would have nothing to manage.
 *
 * `type="single"` with `collapsible`: one answer at a time, and it can be closed
 * again. A FAQ where everything opens at once is the list this replaced.
 *
 * The structured data stays in the .astro file. It has to: search engines read
 * the FAQPage schema, and it must describe every question regardless of which
 * one happens to be open.
 */
export default function FaqAccordion({ items }: { items: readonly FAQItem[] }) {
  return (
    <Accordion type="single" collapsible>
      {items.map((item) => (
        <AccordionItem key={item.question} value={item.question}>
          {/* h3 because the section already has an h2 above it. */}
          <AccordionTrigger headingLevel={3}>{item.question}</AccordionTrigger>
          <AccordionContent>{item.answer}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
