/**
 * Reef — syntax highlighting for identity system v1.
 *
 * Follows the design system spec literally: "keywords arena, strings bioluz,
 * comments plankton, identifiers foam", on a hull #0B1524 ground. Four colours
 * on purpose: the system communicates with colour and border, not with chromatic
 * noise. Functions, variables and types all land on foam.
 *
 * Numeric and boolean literals go with the strings in bioluz — the spec does not
 * assign them, and grouping them with strings is the coherent call (both are
 * literals) rather than inventing a fifth colour outside the palette.
 *
 * Contrast on #0B1524, all WCAG AA:
 *   foam 16.42:1 · bioluz 10.05:1 · arena 9.05:1 · plankton 5.43:1
 * Touch a colour, recompute. The previous theme (Monokai) left comments at
 * 3.7:1, below the floor.
 *
 * `mascot.body` (#3E7CB1) is NOT used here: the system restricts it to fills,
 * never text — it measures 4.2:1.
 */

const c = {
  fondo: "#0B1524", // casco — el contorno de la mascota
  espuma: "#EDF4F3", // identificadores, funciones, tipos, variables
  bioluz: "#35D6C0", // literales: strings, números, booleanos
  arena: "#F2A65A", // keywords y control de flujo
  plancton: "#71919C", // comentarios y puntuación
  error: "#E05252",
} as const;

export const reef = {
  name: "reef",
  type: "dark",
  colors: {
    "editor.background": c.fondo,
    "editor.foreground": c.espuma,
  },
  tokenColors: [
    {
      scope: ["comment", "punctuation.definition.comment", "string.comment"],
      settings: { foreground: c.plancton, fontStyle: "italic" },
    },
    {
      scope: [
        "keyword",
        "keyword.control",
        "keyword.operator.new",
        "keyword.operator.expression",
        "storage",
        "storage.type",
        "storage.modifier",
        "meta.import keyword",
        "keyword.control.import",
        "keyword.control.from",
        "variable.language.this",
        "variable.language.super",
      ],
      settings: { foreground: c.arena },
    },
    {
      scope: [
        "string",
        "string.quoted",
        "string.template",
        "punctuation.definition.string",
        "string.regexp",
        "constant.character.escape",
        "constant.numeric",
        "constant.language",
        "constant.language.boolean",
        "constant.language.null",
        "constant.language.undefined",
        "support.constant",
      ],
      settings: { foreground: c.bioluz },
    },
    {
      scope: [
        "entity.name.function",
        "support.function",
        "variable.function",
        "entity.name.type",
        "entity.name.class",
        "entity.name.namespace",
        "entity.other.inherited-class",
        "support.type",
        "support.class",
        "entity.name.tag",
        "variable",
        "variable.other",
        "variable.parameter",
        "meta.object-literal.key",
        "support.variable.property",
        "entity.other.attribute-name",
      ],
      settings: { foreground: c.espuma },
    },
    {
      scope: ["keyword.operator", "punctuation", "meta.brace", "punctuation.separator", "punctuation.terminator"],
      settings: { foreground: c.plancton },
    },
    { scope: ["markup.inserted"], settings: { foreground: c.bioluz } },
    { scope: ["markup.deleted", "invalid", "invalid.illegal"], settings: { foreground: c.error } },
    { scope: ["markup.heading", "entity.name.section"], settings: { foreground: c.arena, fontStyle: "bold" } },
    { scope: ["markup.bold"], settings: { fontStyle: "bold" } },
    { scope: ["markup.italic"], settings: { fontStyle: "italic" } },
  ],
};

export default reef;
