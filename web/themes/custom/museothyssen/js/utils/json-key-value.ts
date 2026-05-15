/**
 * @file
 * Convierte JSON anidado en líneas `clave.anidada = valor` (notación por puntos).
 */

function primitiveDisplay(value: unknown): string {
  if (value === undefined) {
    return 'undefined';
  }
  if (value === null) {
    return 'null';
  }
  return JSON.stringify(value);
}

/**
 * Aplana un valor JSON a líneas legibles tipo clave = valor.
 */
export function jsonToKeyValueLines(value: unknown, prefix = ''): string[] {
  if (value === null || typeof value !== 'object') {
    const label = prefix || '(root)';
    return [`${label} = ${primitiveDisplay(value)}`];
  }

  if (Array.isArray(value)) {
    if (value.length === 0) {
      const label = prefix || '(root)';
      return [`${label} = []`];
    }
    return value.flatMap((item, index) => {
      const key = prefix ? `${prefix}.${index}` : String(index);
      return jsonToKeyValueLines(item, key);
    });
  }

  const entries = Object.entries(value as Record<string, unknown>);
  if (entries.length === 0) {
    const label = prefix || '(root)';
    return [`${label} = {}`];
  }

  return entries.flatMap(([k, v]) => {
    const key = prefix ? `${prefix}.${k}` : k;
    return jsonToKeyValueLines(v, key);
  });
}
