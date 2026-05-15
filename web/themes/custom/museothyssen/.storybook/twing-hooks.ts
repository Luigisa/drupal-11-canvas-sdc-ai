/**
 * @file
 * Extensiones Twing para paridad con Twig de Drupal en Storybook.
 */
// @ts-nocheck — firmas TwingCallableArgument no alinean con el wrapper de hooks.
import { createSynchronousFunction } from 'twing';

/**
 * Mock ligero de Drupal Attribute para create_attribute().
 */
function createAttributeFunction(
  _context: unknown,
  attributes: Record<string, string> = {},
) {
  const bag = { ...attributes };
  return {
    addClass(...classes: string[]) {
      const current = bag.class ? `${bag.class} ` : '';
      bag.class = `${current}${classes.join(' ')}`.trim();
      return this;
    },
    setAttribute(name: string, value: string) {
      bag[name] = value;
      return this;
    },
    toString() {
      return Object.entries(bag)
        .map(([key, value]) => ` ${key}="${value}"`)
        .join('');
    },
  };
}

/**
 * Filtro |t — devuelve la cadena sin traducir en Storybook.
 */
function translateFilter(_context: unknown, value: string) {
  return value ?? '';
}

export function initEnvironment(twingEnvironment: {
  addFunction: (fn: ReturnType<typeof createSynchronousFunction>) => void;
  addFilter: (fn: ReturnType<typeof createSynchronousFunction>) => void;
}): void {
  twingEnvironment.addFunction(
    createSynchronousFunction(
      'create_attribute',
      createAttributeFunction,
      ['attributes'],
    ),
  );
  twingEnvironment.addFilter(
    createSynchronousFunction('t', translateFilter, ['value']),
  );
}
