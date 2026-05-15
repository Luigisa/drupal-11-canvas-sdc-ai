/**
 * @file
 * Behaviors globales del theme (mantener fino; lógica por componente en SDC).
 */

((Drupal, once) => {
  Drupal.behaviors.museothyssenGlobal = {
    attach(context: HTMLElement): void {
      once('museothyssen-skip-link', '.skip-link', context).forEach((link) => {
        link.addEventListener('click', () => {
          const target = document.querySelector<HTMLElement>(
            link.getAttribute('href') ?? '',
          );
          target?.focus();
        });
      });
    },
  };
})(Drupal, once);
