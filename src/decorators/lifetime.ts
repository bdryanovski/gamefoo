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
export function lifetime<T extends abstract new (...args: any[]) => any>(ctor: T): T {
  let instanceCount = 0;

  const wrapped = class extends (ctor as unknown as new (...args: any[]) => any) {
    private __instanceId: number;
    private __createdAt: number;

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
function formatArgs(args: any[]): string {
  if (args.length === 0) {
    return '';
  }

  const formatted = args.map((arg) => {
    if (arg === null) {
      return 'null';
    }
    if (arg === undefined) {
      return 'undefined';
    }
    if (typeof arg === 'string') {
      return `"${arg}"`;
    }
    if (typeof arg === 'number' || typeof arg === 'boolean') {
      return String(arg);
    }
    if (typeof arg === 'object') {
      try {
        return JSON.stringify(arg);
      } catch {
        return '[Object]';
      }
    }
    return String(arg);
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
