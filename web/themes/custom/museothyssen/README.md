# Museo Thyssen (tema)

Tema front con **Single Directory Components (SDC)**, **Storybook** (`storybook-addon-sdc` + Twing), **TypeScript**, **Vite** (`@ueberbit/vite-plugin-drupal`), **Tailwind CSS v4**, **Bun**, `Drupal.behaviors` y `core/once`.

## Prerrequisitos DDEV

Add-on [ddev-bun](https://addons.ddev.com/addons/OpenForgeProject/ddev-bun) (una vez por proyecto):

```bash
ddev add-on get OpenForgeProject/ddev-bun
ddev restart
```

## Estructura

SDC agrupados por **atomic design** (el ID del componente sigue siendo `museothyssen:{nombre}`; solo cambia la ruta en disco):

```
components/
  atoms/{nombre}/          # {nombre}.component.yml, .twig, .css, js/…
  molecules/{nombre}/
  organisms/{nombre}/

js/
  main.ts               # Behaviors globales (fino)
  utils/                # Helpers (no son entrypoints de Vite)
  services/
  types/

css/tailwind.css        # Entrada Tailwind (Vite)

dist/                   # Assets compilados + sub-theme museothyssen_dist
.storybook/             # Storybook + stubs Twing (canvas:image)
.uebertool/             # Metadatos del plugin (tipos, unimport, etc.)
bun.lock                # Lockfile (commitear)
```

El sub-theme oculto **`museothyssen_dist`** (`dist/museothyssen_dist.info.yml`) registra las librerías JS/CSS hasheadas. El tema principal declara `core/drupal`, `core/once` y las librerías globales de `museothyssen_dist`.

## Módulos Drupal

- `uebertool_asset_renderer` — assets del theme sin agregación conflictiva
- `uebertool_twig_loader` — adjunta `museothyssen_dist/sdc--{componente}` al renderizar SDC
- `uebertool_cascade_layer` — capas CSS Drupal + Tailwind

## Patrón JavaScript

Todo JS interactivo usa `Drupal.behaviors` + `once()` (compatible con BigPipe, AJAX, Views AJAX, diálogos):

```ts
((Drupal, once) => {
  Drupal.behaviors.miBehavior = {
    attach(context: HTMLElement) {
      once('mi-id', '.mi-selector', context).forEach((el) => {
        // lógica vanilla
      });
    },
  };
})(Drupal, once);
```

Ejemplo: [`components/organisms/hello/js/hello.ts`](components/organisms/hello/js/hello.ts).

## Comandos (DDEV + Bun)

Ejecutar desde **esta carpeta del theme** (`web/themes/custom/museothyssen`):

```bash
cd web/themes/custom/museothyssen
ddev bun install              # primera vez o tras cambiar package.json (postinstall → uebertool)
ddev bun run dev              # Vite watch + HMR (requiere puerto 5173 en DDEV, ver abajo)
ddev bun run watch            # alias de dev
ddev bun run build            # producción → dist/ (ejecutar al parar dev)
ddev bun run typecheck        # tsc --noEmit
ddev storybook                # Storybook SDC + HMR en :6006 (ver abajo)
ddev front dev                # Vite + Storybook a la vez (recomendado; `ddev front` = lo mismo)
ddev bun run build-storybook  # export estático → storybook-static/
ddev drush cr                 # tras cambios en dist/*.libraries.yml
```

Desde la raíz del proyecto (install):

```bash
ddev bun install --cwd=web/themes/custom/museothyssen
```

Para `run`, usar `cd` al theme o `ddev exec bash -c 'cd web/themes/custom/museothyssen && bun run build'`.

### Modo desarrollo (Vite en `:5173`)

Con `ddev bun run dev`, el plugin ueberbit reescribe `dist/museothyssen_dist.libraries.yml` para cargar TS/CSS desde el servidor Vite (`https://TU_PROYECTO.ddev.site:5173/...`).

Requisitos:

1. En [`.ddev/config.yaml`](../../../.ddev/config.yaml) debe existir `web_extra_exposed_ports` para el puerto 5173 (ya configurado en este repo).
2. Tras cambiar DDEV: `ddev restart`.
3. Dejar `ddev bun run dev` **en ejecución** mientras navegas el sitio.
4. Al **parar** dev, ejecutar `ddev bun run build` y `ddev drush cr` para volver a assets compilados en `dist/`.

Si ves `ERR_CONNECTION_REFUSED` en `:5173`, el servidor Vite no está corriendo o falta `ddev restart` tras añadir el puerto.

Si ves **`Invalid host`** en `:6006`: Storybook 10 exige `core.allowedHosts` en `.storybook/main.ts` (no solo Vite). Reinicia `ddev front dev`. En `:5173` revisa `vite.ddev-server.ts`.

### Storybook (SDC en `:6006`)

Desarrollo de componentes **sin** levantar páginas Drupal. Usa Twing, Tailwind y `Drupal.attachBehaviors` (vía CDN en el addon + behaviors en `components/**/js/*.ts`).

```bash
ddev storybook
# o: cd web/themes/custom/museothyssen && ddev bun run storybook
```

Abrir **solo** **https://TU_PROYECTO.ddev.site:6006** (puerto `storybook` en `.ddev/config.yaml`; tras cambiarlo: `ddev restart`).

No uses la URL del sitio Drupal (`https://TU_PROYECTO.ddev.site`) para Storybook: los assets van por `:6006`, no por `/themes/custom/...`.

El **sitio Drupal** (páginas reales) usa **https://TU_PROYECTO.ddev.site** con Vite en **:5173** mientras corre `ddev front dev` o `ddev front vite`.

| Qué | Cómo |
|-----|------|
| Stories automáticas | `*.component.yml` → addon `storybook-addon-sdc` |
| Variantes | `thirdPartySettings.sdcStorybook.stories` en el YAML del SDC |
| `canvas:image` en Storybook | Stub en `.storybook/stubs/canvas/` (Drupal real usa el módulo `canvas`) |
| Integración en sitio | Paralelo: `ddev bun run dev` (:5173) + contenido Drupal |

**HMR:** Twig, CSS de componente y TS de behaviors se recargan al guardar.

**Anidación `atoms/` / `molecules/` / `organisms/`:** Vite puede emitir imports Twig como `/components/...`; en `.storybook/main.ts` el plugin `museothyssen-storybook-root-twig` las re-mapea al disco. Tras `bun install`, `postinstall` parchea `storybook-addon-sdc` para que `data-component-id` sea `museothyssen:{nombre}` (no `museothyssen:atoms/{nombre}`).

**Limitación:** render arrays de imagen (`#theme`, etc.) no existen en Storybook; usar props objeto con `src` / `examples` o variantes en `sdcStorybook`.

**Una sola terminal** (Vite + Storybook):

```bash
ddev front dev
```

Solo uno de los dos:

```bash
ddev front vite        # :5173
ddev front storybook   # :6006
```

## Nuevo componente SDC

```bash
ddev drush generate single-directory-component
```

Con interacción:

1. Añadir `components/{atoms|molecules|organisms}/{nombre}/js/{nombre}.ts` con un behavior (si hay interactividad).
2. En `{nombre}.component.yml`, `libraryOverrides.dependencies`: `core/drupal`, `core/once` (y otras que necesites).
3. Añadir `thirdPartySettings.sdcStorybook` con `examples` en props y variantes opcionales; comprobar en `ddev storybook`.
4. `ddev bun run build` — genera `dist/...` y la librería `museothyssen_dist/sdc--{nombre}`.

## CSS

- **Tailwind**: editar [`css/tailwind.css`](css/tailwind.css) (`@source` hacia `templates/` y `components/`).
- **Por componente**: `{component}.css` en la raíz del SDC.
- **Salida compilada**: `dist/css/tailwind.*.css` (versionar en git).

`css/global.css` en la raíz del theme es artefacto intermedio del build; no editar (está en `.gitignore`).

## Despliegue

**Opción A (este repo):** commitear `dist/`, `bun.lock` y `.uebertool/` relevante. El servidor no necesita Bun; tras pull, `ddev drush cr` si cambian librerías.

**Opción B:** ignorar `dist/` y ejecutar en CI:

```bash
bun install --frozen-lockfile && bun run build
```

(en `web/themes/custom/museothyssen`, p. ej. con `oven-sh/setup-bun`).

## Base theme

`stable9` (ver `museothyssen.info.yml`).
