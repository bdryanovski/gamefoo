/**
 * A class decorator that logs instance creation and destruction.
 *
 * Wraps the class constructor to log when instances are created, and
 * injects `Disposable` support to log when they are destroyed.
 *
 * Uses the legacy (experimental) decorator protocol for compatibility with
 * Bun's browser bundler.
 *
 * @category Decorators
 * @since 0.5.0
 *
 * @param constructor - The class constructor to decorate.
 *
 * @returns A new constructor with lifetime logging.
 *
 * @example
 * ```typescript
 * @lifetime
 * class Player {
 *   constructor(id: string, x: number, y: number) {
 *     // ...
 *   }
 * }
 *
 * const p1 = new Player("hero", 100, 200);
 * // Output: ✦ Player #1 created ("hero", 100, 200)
 *
 * p1[Symbol.dispose]();
 * // Output: ✧ Player #1 destroyed (lived 1234ms)
 * ```
 */
/**
 * Any class constructor, abstract or concrete.
 *
 * `any` is deliberate here: a generic class decorator must accept, wrap, and
 * re-dispatch arbitrary constructor signatures. `unknown` cannot express this —
 * it would break the `extends` clause and the `super(...args)` spread below,
 * since neither can be proven to accept an `unknown[]` argument list.
 */
// oxlint-disable-next-line typescript/no-explicit-any
type AnyConstructor = abstract new (...args: any[]) => any;

export function lifetime<T extends AnyConstructor>(ctor: T): T {
  let instanceCount = 0;

  const wrapped = class extends (ctor as unknown as AnyConstructor) {
    private __instanceId: number;
    private __createdAt: number;

    // Re-dispatches an arbitrary argument list to `super`; see {@link AnyConstructor}.
    // oxlint-disable-next-line typescript/no-explicit-any
    constructor(...args: any[]) {
      super(...args);

      instanceCount++;
      this.__instanceId = instanceCount;
      this.__createdAt = Date.now();

      const argsStr = formatArgs(args);
      console.log(`✦ ${ctor.name} #${this.__instanceId} created${argsStr}`);
    }

    [Symbol.dispose](): void {
      const lifespan = Date.now() - this.__createdAt;

      console.log(
        `✧ ${ctor.name} #${this.__instanceId} destroyed (lived ${formatDuration(lifespan)})`,
      );

      // Call parent's dispose if it exists
      if (super[Symbol.dispose]) {
        super[Symbol.dispose]();
      }
    }
  };

  // Preserve the original class name
  Object.defineProperty(wrapped, 'name', { value: ctor.name });

  return wrapped as unknown as T;
}

/**
 * Formats constructor arguments for logging.
 */
function formatArgs(args: unknown[]): string {
  if (args.length === 0) {
    return '';
  }

  const formatted = args.map((arg) => {
    if (arg === null) {
      return 'null';
    }
    // Every remaining `typeof` is listed, so each branch narrows to a concrete
    // type that has a real `toString` — no blind `String(unknown)` fallback.
    switch (typeof arg) {
      case 'undefined':
        return 'undefined';
      case 'string':
        return `"${arg}"`;
      case 'number':
      case 'boolean':
      case 'bigint':
      case 'symbol':
      case 'function':
        return String(arg);
      default:
        // `object`: JSON, with a fallback for circular references.
        try {
          return JSON.stringify(arg);
        } catch {
          return '[Object]';
        }
    }
  });

  return ` (${formatted.join(', ')})`;
}

/**
 * Formats a duration in milliseconds to a human-readable string.
 */
function formatDuration(ms: number): string {
  if (ms < 1000) {
    return `${ms}ms`;
  }
  if (ms < 60000) {
    return `${(ms / 1000).toFixed(1)}s`;
  }
  if (ms < 3600000) {
    return `${(ms / 60000).toFixed(1)}m`;
  }
  return `${(ms / 3600000).toFixed(1)}h`;
}
