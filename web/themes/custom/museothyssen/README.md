# Museo Thyssen (tema)

Tema front con Single Directory Components y **Tailwind CSS v4**.

## CSS y Tailwind

- **Fuente**: [`css/tailwind.input.css`](css/tailwind.input.css) — `@import "tailwindcss"`, directivas `@source` hacia `templates/` y `components/`, y reglas globales en `@layer base`.
- **Salida compilada**: [`css/global.css`](css/global.css) — **no editar a mano**; se regenera con el build. La librería `global` del tema ya apunta a este archivo en [`museothyssen.libraries.yml`](museothyssen.libraries.yml).

## Comandos (en esta carpeta del tema)

```bash
npm ci
npm run build
```

Desarrollo con recarga al guardar:

```bash
npm run watch
```

Tras cambiar plantillas Twig, CSS de componentes o `tailwind.input.css`, ejecuta `npm run build` (o deja `watch` activo).

## Despliegue

- **Opción A — Versionar CSS compilado**: incluir `css/global.css` en el repositorio. El servidor no necesita Node; tras pull, el sitio sirve el CSS ya generado.
- **Opción B — Solo fuentes**: no versionar `global.css` generado; el pipeline de CI ejecuta `npm ci && npm run build` antes de empaquetar o desplegar. Requiere Node en CI.

Este proyecto sigue por defecto la **opción A** si `global.css` compilado está en git.

## Base theme

`stable9` (ver `museothyssen.info.yml`). Si `preflight` de Tailwind choca con estilos del base theme, revisa la documentación de Tailwind v4 para desactivar o acotar preflight.
