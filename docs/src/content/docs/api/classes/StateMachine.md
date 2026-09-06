---
title: 'Class: StateMachine<S>'
---

[**@dryanovski/gamefoo v0.4.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / StateMachine

# Class: StateMachine\<S\>

Defined in: [core/state\_machine.ts:38](https://github.com/bdryanovski/gamefoo/blob/main/src/core/state_machine.ts#L38)

Generic, type-safe finite state machine.

`StateMachine` tracks a current state of type `S` (typically a string
enum), provides convenience checks, and fires lifecycle hooks on
every transition.

## Since

0.3.0

## Examples

**Basic usage with a string enum**

```ts
enum Phase { Menu = "menu", Playing = "playing", GameOver = "gameover" }

const fsm = new StateMachine(Phase.Menu);

fsm.onEnter(Phase.GameOver, () => {
  console.log("Game over!");
});

fsm.transition(Phase.Playing);   // true
fsm.is(Phase.Playing);           // true
fsm.transition(Phase.Playing);   // false — already there
fsm.transition(Phase.GameOver);  // true, logs "Game over!"
fsm.previous;                    // Phase.Playing
```

**Unsubscribing a hook**

```ts
const unsub = fsm.onEnter(Phase.Playing, () => startMusic());
// later…
unsub(); // hook will no longer fire
```

## Type Parameters

| Type Parameter | Description |
| ------ | ------ |
| `S` | The state type. Usually a string enum, but any type that can be used as a `Map` key works. |

## Constructors

### Constructor

```ts
new StateMachine<S>(initial: S): StateMachine<S>;
```

Defined in: [core/state\_machine.ts:53](https://github.com/bdryanovski/gamefoo/blob/main/src/core/state_machine.ts#L53)

Creates a new state machine starting in the given state.

No enter hooks fire for the initial state — it is treated as the
starting point, not a transition.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `initial` | `S` | The state the machine begins in. |

#### Returns

`StateMachine`\<`S`\>

## Properties

| Property | Modifier | Type | Default value | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="_current"></a> `_current` | `private` | `S` | `undefined` | [core/state\_machine.ts:39](https://github.com/bdryanovski/gamefoo/blob/main/src/core/state_machine.ts#L39) |
| <a id="_previous"></a> `_previous` | `private` | `S` \| `null` | `null` | [core/state\_machine.ts:40](https://github.com/bdryanovski/gamefoo/blob/main/src/core/state_machine.ts#L40) |
| <a id="enterhooks"></a> `enterHooks` | `private` | `Map`\<`S`, `Set`\<() => `void`\>\> | `undefined` | [core/state\_machine.ts:42](https://github.com/bdryanovski/gamefoo/blob/main/src/core/state_machine.ts#L42) |
| <a id="exithooks"></a> `exitHooks` | `private` | `Map`\<`S`, `Set`\<() => `void`\>\> | `undefined` | [core/state\_machine.ts:43](https://github.com/bdryanovski/gamefoo/blob/main/src/core/state_machine.ts#L43) |

## Accessors

### current

#### Get Signature

```ts
get current(): S;
```

Defined in: [core/state\_machine.ts:60](https://github.com/bdryanovski/gamefoo/blob/main/src/core/state_machine.ts#L60)

The current state.

##### Returns

`S`

***

### previous

#### Get Signature

```ts
get previous(): S | null;
```

Defined in: [core/state\_machine.ts:68](https://github.com/bdryanovski/gamefoo/blob/main/src/core/state_machine.ts#L68)

The state that was active before the most recent transition,
or `null` if no transition has occurred yet.

##### Returns

`S` \| `null`

## Methods

### destroy()

```ts
destroy(): void;
```

Defined in: [core/state\_machine.ts:170](https://github.com/bdryanovski/gamefoo/blob/main/src/core/state_machine.ts#L170)

Removes all registered hooks. Call this when the state machine is
no longer needed to avoid stale references.

#### Returns

`void`

***

### is()

```ts
is(state: S): boolean;
```

Defined in: [core/state\_machine.ts:75](https://github.com/bdryanovski/gamefoo/blob/main/src/core/state_machine.ts#L75)

Returns `true` if the current state is exactly `state`.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `state` | `S` |

#### Returns

`boolean`

***

### isAny()

```ts
isAny(...states: S[]): boolean;
```

Defined in: [core/state\_machine.ts:89](https://github.com/bdryanovski/gamefoo/blob/main/src/core/state_machine.ts#L89)

Returns `true` if the current state matches any of the given states.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| ...`states` | `S`[] |

#### Returns

`boolean`

#### Example

```ts
if (fsm.isAny(Phase.Playing, Phase.Paused)) {
  // game is active
}
```

***

### onEnter()

```ts
onEnter(state: S, fn: () => void): () => void;
```

Defined in: [core/state\_machine.ts:137](https://github.com/bdryanovski/gamefoo/blob/main/src/core/state_machine.ts#L137)

Registers a callback that fires whenever the machine enters `state`.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `state` | `S` | The state to listen for. |
| `fn` | () => `void` | The callback to invoke on entry. |

#### Returns

An unsubscribe function that removes this hook.

() => `void`

***

### onExit()

```ts
onExit(state: S, fn: () => void): () => void;
```

Defined in: [core/state\_machine.ts:155](https://github.com/bdryanovski/gamefoo/blob/main/src/core/state_machine.ts#L155)

Registers a callback that fires whenever the machine exits `state`.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `state` | `S` | The state to listen for. |
| `fn` | () => `void` | The callback to invoke on exit. |

#### Returns

An unsubscribe function that removes this hook.

() => `void`

***

### transition()

```ts
transition(next: S): boolean;
```

Defined in: [core/state\_machine.ts:103](https://github.com/bdryanovski/gamefoo/blob/main/src/core/state_machine.ts#L103)

Transitions to a new state.

If the machine is already in `next`, this is a no-op and returns
`false`. Otherwise it runs exit hooks for the old state, updates
the current state, then runs enter hooks for the new state.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `next` | `S` | The state to transition to. |

#### Returns

`boolean`

`true` if the transition occurred, `false` if suppressed.
