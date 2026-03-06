/**
 * A method decorator that logs the method name, arguments, and return value.
 *
 * Uses the legacy (experimental) decorator protocol for compatibility with
 * Bun's browser bundler.
 *
 * @category Decorators
 * @since 0.2.0
 *
 * @param target    - The prototype of the class (instance method) or the constructor (static method).
 * @param propertyKey - The name of the decorated method.
 * @param descriptor  - The property descriptor for the method.
 *
 * @returns The modified property descriptor with logging behaviour.
 *
 * @example
 * ```typescript
 * class Example {
 *  @log
 *  myMethod(arg1: string, arg2: number) {
 *   return `${arg1} - ${arg2}`;
 *  }
 * }
 *
 * const example = new Example();
 * example.myMethod('test', 42);
 *  Output:
 *  ▶ myMethod(["test", 42])
 *  ◀ myMethod → "test - 42"
 * ```
 */
export function log(target: object, propertyKey: string | symbol, descriptor: PropertyDescriptor): PropertyDescriptor {
  const originalMethod = descriptor.value;

  const prefix = `${target.constructor.name || "anonymous"}.${String(propertyKey)}`;

  descriptor.value = function (this: unknown, ...args: unknown[]) {
    console.log(`▶ ${prefix}(${JSON.stringify(args)})`);
    const result = originalMethod.apply(this, args);
    console.log(`◀ ${prefix} →`, result);
    return result;
  };

  return descriptor;
}
