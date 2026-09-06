---
title: 'Class: InputMapper'
---

[**@dryanovski/gamefoo v0.4.0**](../README.md)

***

[@dryanovski/gamefoo](../README.md) / InputMapper

# Class: InputMapper

Defined in: [core/controls/input\_mapper.ts:72](https://github.com/bdryanovski/gamefoo/blob/main/src/core/controls/input_mapper.ts#L72)

Maps raw input to semantic actions using a control scheme.

InputMapper provides a high-level API for querying input based on
actions rather than raw keys. It supports:
- Keyboard input via the Input class
- Gamepad input via the Gamepad API
- Console-specific button aliases
- Runtime scheme customization

## Since

0.5.0

## Examples

**Basic usage**

```ts
import { Input, InputMapper, NES_CONTROLS } from 'gamefoo';

const input = new Input({ canvasId: 'game' });
const mapper = new InputMapper(input, NES_CONTROLS);

// In game loop
input.update(); // Required for "just pressed" detection

if (mapper.isAction('A')) player.jump();        // NES alias
if (mapper.isAction('PRIMARY')) player.jump();  // Generic name

const dir = mapper.getDirection();
player.move(dir.x * speed, dir.y * speed);
```

**Customizing controls**

```ts
// Rebind jump to space
const customMapper = mapper.rebind('PRIMARY', ['space', 'x']);

// Or extend with multiple changes
const custom = mapper.withOverrides({
  actions: { PRIMARY: { keys: ['space'] } },
  aliases: { JUMP: 'PRIMARY' },
});
```

## Constructors

### Constructor

```ts
new InputMapper(
   input: Input, 
   scheme: ControlScheme, 
   options?: InputMapperOptions
): InputMapper;
```

Defined in: [core/controls/input\_mapper.ts:86](https://github.com/bdryanovski/gamefoo/blob/main/src/core/controls/input_mapper.ts#L86)

Creates a new InputMapper with the given input source and control scheme.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `input` | [`Input`](Input.md) | The Input instance to read keyboard/mouse state from |
| `scheme` | [`ControlScheme`](../interfaces/ControlScheme.md) | The control scheme defining action bindings |
| `options?` | [`InputMapperOptions`](../interfaces/InputMapperOptions.md) | Optional configuration (gamepad index, deadzone) |

#### Returns

`InputMapper`

#### Since

0.5.0

## Properties

| Property | Modifier | Type | Defined in |
| ------ | ------ | ------ | ------ |
| <a id="input"></a> `input` | `private` | [`Input`](Input.md) | [core/controls/input\_mapper.ts:73](https://github.com/bdryanovski/gamefoo/blob/main/src/core/controls/input_mapper.ts#L73) |
| <a id="options"></a> `options` | `private` | `Required`\<[`InputMapperOptions`](../interfaces/InputMapperOptions.md)\> | [core/controls/input\_mapper.ts:75](https://github.com/bdryanovski/gamefoo/blob/main/src/core/controls/input_mapper.ts#L75) |
| <a id="scheme"></a> `scheme` | `private` | [`ControlScheme`](../interfaces/ControlScheme.md) | [core/controls/input\_mapper.ts:74](https://github.com/bdryanovski/gamefoo/blob/main/src/core/controls/input_mapper.ts#L74) |

## Methods

### getDeadzone()

```ts
getDeadzone(): number;
```

Defined in: [core/controls/input\_mapper.ts:458](https://github.com/bdryanovski/gamefoo/blob/main/src/core/controls/input_mapper.ts#L458)

Gets the current deadzone value.

#### Returns

`number`

The deadzone threshold (0.0 - 1.0)

#### Since

0.5.0

***

### getDirection()

```ts
getDirection(): {
  x: number;
  y: number;
};
```

Defined in: [core/controls/input\_mapper.ts:279](https://github.com/bdryanovski/gamefoo/blob/main/src/core/controls/input_mapper.ts#L279)

Gets a normalized direction vector from directional inputs.

Returns values in the range -1 to 1 for each axis. Diagonal movement
is normalized so the total magnitude doesn't exceed 1.

Checks both D-pad actions (UP/DOWN/LEFT/RIGHT) and gamepad analog sticks.

#### Returns

```ts
{
  x: number;
  y: number;
}
```

Object with x and y components (-1 to 1)

| Name | Type | Defined in |
| ------ | ------ | ------ |
| `x` | `number` | [core/controls/input\_mapper.ts:279](https://github.com/bdryanovski/gamefoo/blob/main/src/core/controls/input_mapper.ts#L279) |
| `y` | `number` | [core/controls/input\_mapper.ts:279](https://github.com/bdryanovski/gamefoo/blob/main/src/core/controls/input_mapper.ts#L279) |

#### Since

0.5.0

#### Example

```ts
const dir = mapper.getDirection();
player.x += dir.x * speed * deltaTime;
player.y += dir.y * speed * deltaTime;
```

***

### getGamepadIndex()

```ts
getGamepadIndex(): number;
```

Defined in: [core/controls/input\_mapper.ts:480](https://github.com/bdryanovski/gamefoo/blob/main/src/core/controls/input_mapper.ts#L480)

Gets the current gamepad index.

#### Returns

`number`

The gamepad index (0-3)

#### Since

0.5.0

***

### getRawDirection()

```ts
getRawDirection(): {
  x: -1 | 0 | 1;
  y: -1 | 0 | 1;
};
```

Defined in: [core/controls/input\_mapper.ts:340](https://github.com/bdryanovski/gamefoo/blob/main/src/core/controls/input_mapper.ts#L340)

Gets a raw (non-normalized) digital direction.

Returns -1, 0, or 1 for each axis. Useful for grid-based movement
or 8-way directional input.

#### Returns

```ts
{
  x: -1 | 0 | 1;
  y: -1 | 0 | 1;
}
```

Object with x and y components (-1, 0, or 1)

| Name | Type | Defined in |
| ------ | ------ | ------ |
| `x` | `-1` \| `0` \| `1` | [core/controls/input\_mapper.ts:340](https://github.com/bdryanovski/gamefoo/blob/main/src/core/controls/input_mapper.ts#L340) |
| `y` | `-1` \| `0` \| `1` | [core/controls/input\_mapper.ts:340](https://github.com/bdryanovski/gamefoo/blob/main/src/core/controls/input_mapper.ts#L340) |

#### Since

0.5.0

#### Example

```ts
const dir = mapper.getRawDirection();
if (dir.x !== 0 || dir.y !== 0) {
  player.moveOnGrid(dir.x, dir.y);
}
```

***

### getScheme()

```ts
getScheme(): ControlScheme;
```

Defined in: [core/controls/input\_mapper.ts:447](https://github.com/bdryanovski/gamefoo/blob/main/src/core/controls/input_mapper.ts#L447)

Gets the current control scheme.

#### Returns

[`ControlScheme`](../interfaces/ControlScheme.md)

The current ControlScheme (readonly)

#### Since

0.5.0

***

### hasDirectionInput()

```ts
hasDirectionInput(): boolean;
```

Defined in: [core/controls/input\_mapper.ts:366](https://github.com/bdryanovski/gamefoo/blob/main/src/core/controls/input_mapper.ts#L366)

Checks if any directional input is active.

#### Returns

`boolean`

true if any of UP, DOWN, LEFT, or RIGHT is active

#### Since

0.5.0

***

### isAction()

```ts
isAction(action: string): boolean;
```

Defined in: [core/controls/input\_mapper.ts:212](https://github.com/bdryanovski/gamefoo/blob/main/src/core/controls/input_mapper.ts#L212)

Checks if an action is currently held down.

Supports both standard InputAction names and console-specific aliases.
Checks both keyboard and gamepad inputs.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `action` | `string` | The action name or alias to check |

#### Returns

`boolean`

true if the action is currently active

#### Since

0.5.0

#### Example

```ts
// Using generic name
if (mapper.isAction('PRIMARY')) player.jump();

// Using NES-specific alias
if (mapper.isAction('A')) player.jump();

// Using custom alias (if defined)
if (mapper.isAction('JUMP')) player.jump();
```

***

### isActionPressed()

```ts
isActionPressed(action: string): boolean;
```

Defined in: [core/controls/input\_mapper.ts:243](https://github.com/bdryanovski/gamefoo/blob/main/src/core/controls/input_mapper.ts#L243)

Checks if an action was just pressed this frame.

Returns true only on the first frame the action becomes active.
Requires `input.update()` to be called each frame.

Note: Gamepad "just pressed" detection is approximate since the
Gamepad API doesn't provide press events.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `action` | `string` | The action name or alias to check |

#### Returns

`boolean`

true if the action was just pressed

#### Since

0.5.0

#### Example

```ts
// Only trigger once per button press
if (mapper.isActionPressed('PRIMARY')) {
  player.jump(); // Won't repeat while held
}
```

***

### rebind()

```ts
rebind(action: InputAction, keys: string[]): InputMapper;
```

Defined in: [core/controls/input\_mapper.ts:434](https://github.com/bdryanovski/gamefoo/blob/main/src/core/controls/input_mapper.ts#L434)

Creates a new InputMapper with a single action's keys rebound.

Convenience method for simple rebinding without full overrides.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `action` | [`InputAction`](../type-aliases/InputAction.md) | The action to rebind |
| `keys` | `string`[] | New keyboard keys for the action |

#### Returns

`InputMapper`

A new InputMapper with the action rebound

#### Since

0.5.0

#### Example

```ts
// Rebind jump to space only
const custom = mapper.rebind('PRIMARY', ['space']);
```

***

### setDeadzone()

```ts
setDeadzone(value: number): void;
```

Defined in: [core/controls/input\_mapper.ts:469](https://github.com/bdryanovski/gamefoo/blob/main/src/core/controls/input_mapper.ts#L469)

Sets the analog stick deadzone.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | New deadzone threshold (0.0 - 1.0) |

#### Returns

`void`

#### Since

0.5.0

***

### setGamepadIndex()

```ts
setGamepadIndex(index: number): void;
```

Defined in: [core/controls/input\_mapper.ts:491](https://github.com/bdryanovski/gamefoo/blob/main/src/core/controls/input_mapper.ts#L491)

Sets the gamepad index to use.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `index` | `number` | Gamepad index (0-3) |

#### Returns

`void`

#### Since

0.5.0

***

### withOverrides()

```ts
withOverrides(overrides: SchemeOverrides): InputMapper;
```

Defined in: [core/controls/input\_mapper.ts:412](https://github.com/bdryanovski/gamefoo/blob/main/src/core/controls/input_mapper.ts#L412)

Creates a new InputMapper with scheme overrides applied.

Uses [extendScheme](../functions/extendScheme.md) to create a modified scheme, then returns
a new mapper using that scheme.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `overrides` | [`SchemeOverrides`](../interfaces/SchemeOverrides.md) | Modifications to apply to the current scheme |

#### Returns

`InputMapper`

A new InputMapper with the modified scheme

#### Since

0.5.0

#### Example

```ts
const custom = mapper.withOverrides({
  actions: {
    PRIMARY: { keys: ['space', 'x', 'j'] },
  },
  aliases: {
    JUMP: 'PRIMARY',
  },
});
```

***

### withScheme()

```ts
withScheme(scheme: ControlScheme): InputMapper;
```

Defined in: [core/controls/input\_mapper.ts:385](https://github.com/bdryanovski/gamefoo/blob/main/src/core/controls/input_mapper.ts#L385)

Creates a new InputMapper with a different control scheme.

The new mapper shares the same Input instance but uses the new scheme.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `scheme` | [`ControlScheme`](../interfaces/ControlScheme.md) | The new control scheme to use |

#### Returns

`InputMapper`

A new InputMapper with the specified scheme

#### Since

0.5.0

***

### getBinding()

```ts
private getBinding(action: string): ActionBinding | null;
```

Defined in: [core/controls/input\_mapper.ts:119](https://github.com/bdryanovski/gamefoo/blob/main/src/core/controls/input_mapper.ts#L119)

Gets the binding for an action, resolving aliases.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `action` | `string` | Action name or alias |

#### Returns

[`ActionBinding`](../interfaces/ActionBinding.md) \| `null`

The ActionBinding, or null if not found

***

### isGamepadBindingDown()

```ts
private isGamepadBindingDown(binding: ActionBinding): boolean;
```

Defined in: [core/controls/input\_mapper.ts:153](https://github.com/bdryanovski/gamefoo/blob/main/src/core/controls/input_mapper.ts#L153)

Checks if the gamepad binding is active.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `binding` | [`ActionBinding`](../interfaces/ActionBinding.md) | The action binding to check |

#### Returns

`boolean`

true if the gamepad button/axis is active

***

### isKeyBindingDown()

```ts
private isKeyBindingDown(binding: ActionBinding): boolean;
```

Defined in: [core/controls/input\_mapper.ts:133](https://github.com/bdryanovski/gamefoo/blob/main/src/core/controls/input_mapper.ts#L133)

Checks if any of the binding's keys are currently held down.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `binding` | [`ActionBinding`](../interfaces/ActionBinding.md) | The action binding to check |

#### Returns

`boolean`

true if any key in the binding is down

***

### isKeyBindingPressed()

```ts
private isKeyBindingPressed(binding: ActionBinding): boolean;
```

Defined in: [core/controls/input\_mapper.ts:143](https://github.com/bdryanovski/gamefoo/blob/main/src/core/controls/input_mapper.ts#L143)

Checks if any of the binding's keys were just pressed this frame.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `binding` | [`ActionBinding`](../interfaces/ActionBinding.md) | The action binding to check |

#### Returns

`boolean`

true if any key in the binding was just pressed

***

### resolveAction()

```ts
private resolveAction(action: string): InputAction | null;
```

Defined in: [core/controls/input\_mapper.ts:98](https://github.com/bdryanovski/gamefoo/blob/main/src/core/controls/input_mapper.ts#L98)

Resolves an action name to its InputAction, handling aliases.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `action` | `string` | Action name or alias to resolve |

#### Returns

[`InputAction`](../type-aliases/InputAction.md) \| `null`

The resolved InputAction, or null if not found
