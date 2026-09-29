#!/usr/bin/env bash
# Decide si Vercel tiene que construir este commit.
#
#   exit 0  -> se salta el build
#   exit 1  -> se construye
#
# Lo configura `ignoreCommand` en vercel.json. Cada deploy se cobra, y un
# commit que solo mueve especificaciones o documentación no cambia un byte
# de lo que se publica.
#
# La regla es una: **ante la duda, construir**. Un build de más cuesta
# centavos; uno de menos deja el sitio con una versión vieja y no se nota
# hasta que alguien la busca.
#
# Fuera de la lista, y por qué importa acá más que en otros proyectos:
#
#   src/       los artículos del blog son .mdx y viven en
#              src/pages/articles/. Por eso la lista nombra rutas una por
#              una y NUNCA un patrón por extensión: un `*.md` ignorado
#              dejaría de publicar artículos.
#   tests/     `build` es `astro check && astro build`, y astro/tsconfigs/base
#              no declara `include`, así que el check abarca los tests. Un
#              error de tipos ahí tiene que romper el build.
#   scripts/   los usa el build.

set -uo pipefail

IGNORABLES='^(openspec/|\.agents/|\.claude/|\.github/|BRAND\.md$|CLAUDE\.md$|README\.md$)'

build() { echo "› construir: $1"; exit 1; }
skip()  { echo "› saltar: $1";    exit 0; }

command -v git >/dev/null 2>&1 || build "no hay git para comparar"

if [ -n "${VERCEL_GIT_PREVIOUS_SHA:-}" ] && git cat-file -e "${VERCEL_GIT_PREVIOUS_SHA}^{commit}" 2>/dev/null; then
  RANGE="${VERCEL_GIT_PREVIOUS_SHA}...HEAD"
elif git rev-parse --verify HEAD^ >/dev/null 2>&1; then
  RANGE="HEAD^...HEAD"
else
  build "no se pudo determinar qué cambió"
fi

CHANGED=$(git diff --name-only "$RANGE" 2>/dev/null)
[ -z "$CHANGED" ] && build "el diff volvió vacío, algo no cuadra"

RELEVANTES=$(echo "$CHANGED" | grep -Ev "$IGNORABLES" || true)

if [ -z "$RELEVANTES" ]; then
  skip "$(echo "$CHANGED" | wc -l | tr -d ' ') archivo(s), todos documentación"
fi

build "$(echo "$RELEVANTES" | head -3 | tr '\n' ' ')"
