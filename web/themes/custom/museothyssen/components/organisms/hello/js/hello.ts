/**
 * @file
 * Behavior del componente museothyssen:hello.
 */

import { pokemonApiClient } from '@services/pokemon-api-client';
import { toggleDataState } from '@utils/dom';
import { jsonToKeyValueLines } from '@utils/json-key-value';

function bindHelloToggle(root: HTMLElement): void {
  const toggle = root.querySelector<HTMLButtonElement>('[data-hello-toggle]');
  const subtitle = root.querySelector<HTMLElement>(
    '.museothyssen-hello__subtitle',
  );
  if (!toggle || !subtitle) {
    return;
  }

  toggle.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!expanded));
    subtitle.hidden = expanded;
    toggleDataState(root, 'subtitle-collapsed', expanded);
  });
}

function bindHelloDittoJson(root: HTMLElement): void {
  const pre = root.querySelector<HTMLPreElement>('[data-hello-ditto-json]');
  if (!pre) {
    return;
  }

  pre.textContent = 'Cargando…';

  void pokemonApiClient
    .getPokemonByName('ditto')
    .then((data) => {
      pre.textContent = jsonToKeyValueLines(data).join('\n');
    })
    .catch((error: unknown) => {
      const message = error instanceof Error ? error.message : String(error);
      pre.textContent = `Error: ${message}`;
    });
}

((Drupal, once) => {
  Drupal.behaviors.museothyssenHello = {
    attach(context: HTMLElement): void {
      once('museothyssen-hello', '.museothyssen-hello', context).forEach(
        (root) => {
          bindHelloToggle(root as HTMLElement);
          bindHelloDittoJson(root as HTMLElement);
        },
      );
    },
  };
})(Drupal, once);
