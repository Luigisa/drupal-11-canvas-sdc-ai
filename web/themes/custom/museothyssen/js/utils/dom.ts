/**
 * @file
 * Utilidades DOM compartidas.
 */

/**
 * Alterna un atributo data-* booleano en el elemento.
 */
export function toggleDataState(
  element: HTMLElement,
  name: string,
  active = !element.hasAttribute(`data-${name}`),
): void {
  if (active) {
    element.setAttribute(`data-${name}`, '');
  }
  else {
    element.removeAttribute(`data-${name}`);
  }
}
