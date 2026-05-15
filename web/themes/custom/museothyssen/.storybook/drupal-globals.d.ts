/**
 * @file
 * Drupal globals cargados por storybook-addon-sdc (previewHead CDN).
 */
declare const Drupal: {
  attachBehaviors: (
    context?: Document | HTMLElement,
    settings?: Record<string, unknown>,
  ) => void;
  behaviors: Record<
    string,
    {
      attach?: (context: HTMLElement) => void;
      detach?: (context: HTMLElement, settings: unknown, trigger: string) => void;
    }
  >;
};

interface Window {
  drupalSettings: Record<string, unknown>;
}
