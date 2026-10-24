# Input

This folder contains all keyboard, mouse, gamepad, and action-based input. Pick the smallest layer
that fits:

| Layer         | Use it for                                               |
| ------------- | -------------------------------------------------------- |
| `Input`       | Demos, experiments, or code that only needs raw polling. |
| `InputMapper` | Custom actions on top of an existing `Input`.            |
| `InputSystem` | Games registered with the engine; owns both layers.      |

## Primitive: `Input`

`Input` polls keyboard, mouse, and gamepad state. It has no scheme or action knowledge and does not
require the engine.

```ts
import { Input } from 'gamefoo';

const input = new Input({ canvasId: 'game', gameScale: 2 });

function update() {
  input.update();

  if (input.isKeyPressed('space')) player.jump();
  if (input.isKeyDown('a')) player.moveLeft();
  if (input.isMouseButtonPressed(0)) shoot(input.getMousePosition());
}
```

Keys use `KeyboardEvent.key` values and are matched case-insensitively (`'w'`, `'ArrowUp'`,
`'Shift'`, `' '`).

Methods:

- `isKeyDown`, `isKeyPressed`, `isKeyReleased`
- `consume(key)` clears a press edge for the rest of the frame
- `isMouseButtonDown`, `isMouseButtonPressed`, `isMouseButtonReleased`
- `getMousePosition`
- `getGamepad(index)`
- `update`, `reset`, `destroy`

Call `update()` once per frame. When `Input` is registered with the engine, the engine calls it
automatically. `destroy()` removes event listeners.

## Actions: `InputMapper`

An action maps physical inputs to a semantic name. Use `defineScheme` with any action names:

```ts
import { Input, InputMapper, binding, defineScheme } from 'gamefoo';

type Action = 'left' | 'right' | 'jump';

const scheme = defineScheme<Action>({
  name: 'Platformer',
  actions: {
    left: binding(['a', 'arrowleft']),
    right: binding(['d', 'arrowright']),
    jump: binding(['space', 'x'], { button: 0 }),
  },
  directions: {
    up: 'jump',
    down: 'jump',
    left: 'left',
    right: 'right',
  },
});

const input = new Input();
const mapper = new InputMapper(input, scheme);

function update() {
  input.update();

  if (mapper.isActionPressed('jump')) player.jump();
  const direction = mapper.getDirection();
  player.move(direction.x, direction.y);
}
```

Available queries:

- `isAction(name)` — held this frame
- `isActionPressed(name)` — became active this frame
- `isActionReleased(name)` — stopped being active this frame
- `consume(name)` — clears a press edge for the rest of the frame
- `getDirection()` — normalized direction from the scheme directions and the left analog stick
- `getRawDirection()` — `-1`, `0`, or `1` per axis
- `hasDirectionInput()`

Keyboard, mouse, and gamepad all support pressed/released edges. Gamepad axes use the mapper
deadzone (`0.3` by default).

Use `unassignedBinding()` when an action is intentionally absent. This keeps scheme definitions
explicit about which inputs exist:

```ts
import { binding, unassignedBinding } from 'gamefoo';

const scheme = defineScheme({
  name: 'Minimal',
  actions: {
    PRIMARY: binding(['space'], { button: 0 }),
    SECONDARY: unassignedBinding(),
    START: unassignedBinding(),
  },
});
```

### Aliases

Aliases let a game use console-specific names without changing actions:

```ts
const scheme = defineScheme({
  name: 'NES',
  actions: {
    PRIMARY: binding(['x', 'j'], { button: 0 }),
    SECONDARY: binding(['z', 'k'], { button: 1 }),
  },
  aliases: {
    A: 'PRIMARY',
    B: 'SECONDARY',
    JUMP: 'PRIMARY',
  },
});

mapper.isAction('A'); // same as mapper.isAction('PRIMARY')
```

### Extending a scheme

```ts
import { NES_CONTROLS, extendScheme } from 'gamefoo';

const custom = extendScheme(NES_CONTROLS, {
  name: 'NES (Space to jump)',
  actions: {
    PRIMARY: binding(['space'], { button: 0 }),
  },
});
```

## Engine integration: `InputSystem`

`InputSystem` owns an `Input` and an `InputMapper`. Register it once:

```ts
import { InputSystem, NES_CONTROLS } from 'gamefoo';

const input = new InputSystem({
  scheme: NES_CONTROLS,
  canvasId: 'game',
});

engine.use(input);

if (input.isActionPressed('A')) player.jump();
const direction = input.getDirection();
```

`InputSystem` runs at order `0`, so actions are ready before other subsystems. It exposes the same
action methods as `InputMapper`, plus:

- `input` — the raw `Input` primitive
- `mapper` — the current `InputMapper`
- `getScheme`, `setScheme`
- `getDeadzone`, `setDeadzone`
- `getGamepadIndex`, `setGamepadIndex`
- `update`, `destroy`

## Built-in presets

All presets use the same keyboard layout and W3C Standard Gamepad mappings:

```ts
import { CONTROL_SCHEMES, getControlScheme, listControlSchemes } from 'gamefoo';

const scheme = CONTROL_SCHEMES.NES;
const same = getControlScheme('NES');
const names = listControlSchemes();
```

Available presets:

`DEFAULT`, `PICO8`, `TIC80`, `ATARI_2600`, `NES`, `FAMICOM`, `SNES`, `GAMEBOY`, `GBC`, `GBA`, `N64`,
`NDS`, `GENESIS` (`MEGADRIVE` alias), `GAMEGEAR`, `DREAMCAST`, `PS1`, `PSP`, `NEO_GEO`, `C64`,
`PLAYDATE`.

Each preset lists every standard action. Buttons a console does not have use `unassignedBinding()`,
so the supported inputs are visible directly in the definition.

Console-to-preset helpers live in `src/core/consoles/controls.ts`: `getDefaultControls(consoleName)`
and `getControlSchemeName(consoleName)`.

## Gamepad reference

```ts
import { GAMEPAD_AXIS, GAMEPAD_BUTTON, getButtonLabel } from 'gamefoo';

binding([], { button: GAMEPAD_BUTTON.A });
binding([], { axis: GAMEPAD_AXIS.LEFT_STICK_X, axisDirection: 1 });

getButtonLabel(GAMEPAD_BUTTON.A, 'PLAYSTATION'); // '×'
```

Button and axis indices follow the W3C Standard Gamepad layout. Labels are available for `XBOX`,
`PLAYSTATION`, `PLAYSTATION_NAMES`, `NINTENDO`, `GENERIC_RETRO`, and `GENERIC`.

## Migration from the old layout

- `src/core/input.ts` → `src/input/input.ts`
- `src/core/controls/*` → `src/input/*`
- `InputMapper` no longer has `withScheme`, `withOverrides`, or `rebind`. Use `extendScheme` or
  create a new mapper.
- `createScheme`, `mergeSchemes`, and `rebindAction` were removed. Use `defineScheme` and
  `extendScheme`.
- `Input` no longer owns a deadzone. Configure it on `InputMapper` or `InputSystem`.
- Gamepad press/release edges are now tracked, so `isActionPressed` and `isActionReleased` work for
  gamepads as well as keyboards.
