# Proposal: Dashboard de Artículos con IA

## Goal

Desarrollo de un dashboard privado para la creación de artículos de blog con capacidades de IA integradas. El sistema permitirá escribir contenido en markdown, generar descripciones SEO automáticamente y crear imágenes de portada usando inteligencia artificial.

## Problem

Actualmente, la creación de artículos requiere múltiples herramientas y pasos manuales para la optimización SEO y generación de imágenes. Se necesita una solución unificada que acelere el flujo de trabajo de creación de contenido.

## Solution

Un dashboard web protegido que integra editor Markdown, previsualización en tiempo real, y herramientas de IA (OpenAI, DALL-E) para asistir en la redacción y generación de assets.

## Goals / Non-goals

### Goals

- **Autenticación y Seguridad**: Ruta privada protegida con autenticación y gestión de sesiones.
- **Editor de Artículos**: Editor Markdown con highlighting y preview.
- **Generación con IA**: SEO, imágenes, etiquetas y títulos generados automáticamente.
- **Gestión de Artículos**: CRUD completo de artículos y manejo de estados (borrador/publicado).
- **Performance**: Tiempo de carga rápido y optimización de imágenes.

### Non-goals

- CMS público para lectores (el foco es el dashboard de administración/creación).
- Gestión de comentarios o interacción social.

## What Changes

Se implementará un nuevo módulo de dashboard en la aplicación existente o como aplicación independiente (según arquitectura actual), incluyendo rutas de API para manejo de IA y base de datos/sistema de archivos para persistencia.

## Capabilities

### New Capabilities

- `user-auth`: Sistema de autenticación con login, logout, protección de rutas y manejo de sesiones seguras.
- `article-editor`: Interfaz de edición de texto enriquecida con soporte Markdown, preview en tiempo real y gestión de metadatos (frontmatter).
- `ai-assistance`: Integración con LLMs (e.g., GPT-4) para generar descripciones SEO, sugerir títulos y etiquetas basándose en el contenido del artículo.
- `ai-image-gen`: Generación de imágenes de portada contextuales utilizando modelos de difusión (e.g., DALL-E 3) y optimización posterior.
- `article-management`: Sistema de gestión de contenidos (CMS) básico para crear, leer, actualizar, eliminar y publicar artículos.

### Modified Capabilities

## Impact

- **Backend**: Nuevos endpoints API para Auth, IA y gestión de contenidos.
- **Frontend**: Nuevas páginas bajo `/dashboard` y componentes de edición.
- **Infraestructura**: Requerimientos de variables de entorno para claves de API (OpenAI, Auth secret).

</template>

<success_criteria>

- Tiempo de creación de artículo < 10 minutos
- Tasa de éxito de generación IA > 95%
- Calidad de descripción SEO (score > 80/100)
- Zero vulnerabilidades de seguridad
- Uptime del dashboard > 99%
  </success_criteria>

<unlocks>
Completing this artifact enables: design, specs
</unlocks>
