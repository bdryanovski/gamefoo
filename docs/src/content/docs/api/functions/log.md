---
title: 'Function: log()'
---

[**@dryanovski/gamefoo v0.3.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / log

# Function: log()

```ts
function log(
   target: object, 
   propertyKey: string | symbol, 
   descriptor: PropertyDescriptor): PropertyDescriptor;
```

Defined in: [decorators/log.ts:32](https://github.com/bdryanovski/gamefoo/blob/main/src/decorators/log.ts#L32)

A method decorator that logs the method name, arguments, and return value.

Uses the legacy (experimental) decorator protocol for compatibility with
Bun's browser bundler.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `target` | `object` | The prototype of the class (instance method) or the constructor (static method). |
| `propertyKey` | `string` \| `symbol` | The name of the decorated method. |
| `descriptor` | `PropertyDescriptor` | The property descriptor for the method. |

## Returns

`PropertyDescriptor`

The modified property descriptor with logging behaviour.

## Since

0.2.0

## Example

```typescript
class Example {
 @log
 myMethod(arg1: string, arg2: number) {
  return `${arg1} - ${arg2}`;
 }
}

const example = new Example();
example.myMethod('test', 42);
 Output:
 ▶ myMethod(["test", 42])
 ◀ myMethod → "test - 42"
```
