/**
 * @file
 * Tipos mínimos para Drupal.behaviors y once en el theme.
 */

interface DrupalBehavior {
  attach?: (context: HTMLElement, settings?: DrupalSettings) => void;
  detach?: (
    context: HTMLElement,
    settings?: DrupalSettings,
    trigger?: string,
  ) => void;
}

interface DrupalStatic {
  behaviors: Record<string, DrupalBehavior>;
}

interface DrupalSettings {
  [key: string]: unknown;
}

declare const Drupal: DrupalStatic;

declare function once(
  id: string,
  selector: string,
  context?: Element | Document,
): NodeListOf<HTMLElement>;

declare function once(
  id: string,
  elements: Element | NodeListOf<Element> | Element[],
): Element[];
