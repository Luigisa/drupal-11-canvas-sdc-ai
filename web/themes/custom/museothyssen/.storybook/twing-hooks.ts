/**
 * @file
 * Hooks opcionales para vite-plugin-twing-drupal en Storybook.
 *
 * `t`, `create_attribute`, etc. los registra addDrupalExtensions
 * (@christianwiedemann/drupal-twig-extensions). No re-registrar `t` aquí:
 * createSynchronousFunction rompe el filtro → "argument \"\" is required".
 */
export function initEnvironment(): void {
  // Extensiones solo del theme: añadir aquí si hace falta.
}
