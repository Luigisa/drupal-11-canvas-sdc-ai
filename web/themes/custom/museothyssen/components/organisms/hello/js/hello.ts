/**
 * @file
 * Behavior del componente museothyssen:hello.
 */

import { pokemonApiClient } from '@services/pokemon-api-client';
import { toggleDataState } from '@utils/dom';
import { jsonToKeyValueLines } from '@utils/json-key-value';

const ONCE_ID = 'museothyssen-hello' as const;

const SELECTORS = {
  root: '.museothyssen-hello',
  toggle: '[data-hello-toggle]',
  subtitle: '.museothyssen-hello__subtitle',
  dittoOutput: '[data-hello-ditto-json]',
} as const;

const POKEMON_NAME = 'ditto' as const;

type AriaExpanded = 'true' | 'false';

const parseAriaExpanded = (value: string | null): boolean => value === 'true';

const toAriaExpanded = (expanded: boolean): AriaExpanded =>
  expanded ? 'true' : 'false';

const formatUnknownError = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
};

const isAbortError = (error: unknown): boolean =>
  error instanceof DOMException && error.name === 'AbortError';

const bindToggleSection = (root: HTMLElement): void => {
  const toggle = root.querySelector<HTMLButtonElement>(SELECTORS.toggle);
  const subtitle = root.querySelector<HTMLElement>(SELECTORS.subtitle);
  if (!toggle || !subtitle) {
    return;
  }

  const handleClick = (): void => {
    const expanded = parseAriaExpanded(toggle.getAttribute('aria-expanded'));
    const nextExpanded = !expanded;
    toggle.setAttribute('aria-expanded', toAriaExpanded(nextExpanded));
    subtitle.hidden = expanded;
    toggleDataState(root, 'subtitle-collapsed', expanded);
  };

  toggle.addEventListener('click', handleClick);
};

const fillDittoJsonPanel = async (
  pre: HTMLPreElement,
  signal: AbortSignal,
): Promise<void> => {
  pre.textContent = 'Cargando…';

  try {
    const payload = await pokemonApiClient.getPokemonByName(POKEMON_NAME, {
      signal,
    });
    const lines = jsonToKeyValueLines(payload);
    pre.textContent = lines.join('\n');
  }
  catch (error: unknown) {
    if (isAbortError(error)) {
      return;
    }
    pre.textContent = `Error: ${formatUnknownError(error)}`;
  }
};

const bindDittoJsonSection = (root: HTMLElement): void => {
  const pre = root.querySelector<HTMLPreElement>(SELECTORS.dittoOutput);
  if (!pre) {
    return;
  }

  const { signal } = new AbortController();
  void fillDittoJsonPanel(pre, signal);
};

const mountHelloRoot = (root: HTMLElement): void => {
  bindToggleSection(root);
  bindDittoJsonSection(root);
};

((Drupal, once) => {
  Drupal.behaviors.museothyssenHello = {
    attach: (context: HTMLElement): void => {
      const roots = once(ONCE_ID, SELECTORS.root, context);
      for (const node of roots) {
        mountHelloRoot(node);
      }
    },
  };
})(Drupal, once);
