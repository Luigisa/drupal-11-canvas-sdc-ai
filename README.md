# drupal-sdc

Drupal 11 (plantilla *recommended-project*), docroot `web`, entorno local con [DDEV](https://ddev.com/). La configuración exportada vive en `config/sync` (definido en `web/sites/default/settings.php`).

## Requisitos

- [Docker](https://docs.docker.com/get-docker/) (Desktop o compatible)
- [DDEV](https://ddev.com/get-started/) instalado en el host

## Clonar y arrancar

En la raíz del repositorio (donde está `composer.json` y la carpeta `.ddev/`):

```bash
git clone <url-del-repo> drupal-sdc
cd drupal-sdc
ddev start
```

Con el proyecto levantado, la URL principal es **https://drupal-sdc.ddev.site** (coincide con `name` en `.ddev/config.yaml`).

## Instalación inicial del código (Composer)

Instala dependencias PHP dentro del contenedor web:

```bash
ddev composer install
```

No hace falta tener Composer en el host si usas siempre `ddev composer`.

## Instalación de Drupal + import de configuración

Base de datos vacía y **primera** puesta en marcha: instala el sitio usando el perfil que coincide con la exportación (`standard`, según `config/sync/core.extension.yml`) y aplica todo lo de `config/sync` en un solo paso con `--existing-config`:

```bash
ddev drush site:install standard \
  --existing-config \
  --account-name=admin \
  --account-pass=admin \
  -y
```

Ajusta usuario y contraseguro del administrador; evita dejar credenciales débiles fuera de local.

Si el sitio **ya** está instalado (por ejemplo tras importar un volcado SQL) y solo quieres alinear configuración con el repo:

```bash
ddev drush config:import -y
ddev drush cache:rebuild
```

Comprueba conflictos antes de forzar en entornos compartidos (`drush config:status`).

### Alternativa: copia de base de datos

Si alguien te pasa un `.sql` o `.sql.gz`:

```bash
ddev import-db --file=ruta/al/dump.sql.gz
ddev drush cache:rebuild
```

Tras eso suele bastar `config:import` solo si el código y el volcado han divergido en configuración.

## Día a día

| Acción | Comando |
|--------|---------|
| Arrancar / parar | `ddev start` / `ddev stop` |
| Drush | `ddev drush <comando>` |
| Enlace único de acceso | `ddev drush uli` |
| Importar config del repo | `ddev drush config:import -y` |
| Exportar config | `ddev drush config:export -y` |
| Actualizar BD tras cambios de módulo | `ddev drush updatedb -y` |

Correo de prueba: [Mailpit](https://ddev.readthedocs.io/en/stable/users/usage/developer-tools/#email-capture-and-review-mailpit) en la URL que indica `ddev describe` (típicamente `https://drupal-sdc.ddev.site:8026`).

## Tema `museothyssen` (Tailwind / Bun)

El frontend del tema custom usa **Bun** + Vite en el contenedor DDEV (add-on [ddev-bun](https://addons.ddev.com/addons/OpenForgeProject/ddev-bun)). Detalle: [web/themes/custom/museothyssen/README.md](web/themes/custom/museothyssen/README.md).

Primera vez en el proyecto:

```bash
ddev add-on get OpenForgeProject/ddev-bun
ddev restart
```

Build y Storybook (Bun en el theme):

```bash
ddev bun install --cwd=web/themes/custom/museothyssen
ddev exec bash -lc "cd web/themes/custom/museothyssen && bun run build"
ddev front dev     # Vite :5173 + Storybook :6006 (front SDC)
ddev storybook     # solo Storybook
```

Detalle Vite (:5173), Storybook (:6006) y flujo SDC: [web/themes/custom/museothyssen/README.md](web/themes/custom/museothyssen/README.md).

## Notas

- `web/sites/default/files/` suele estar en `.gitignore`; Drupal lo crea al instalar o al usar el sitio.
- DDEV incluye `settings.ddev.php` cuando la gestión de ajustes está activa; no subas credenciales reales a `settings.php` en git.

## Referencias

- [DDEV Drupal](https://ddev.readthedocs.io/en/stable/users/quickstart/#drupal)
- [Drush site:install](https://www.drush.org/latest/commands/site_install/)
