# GameFoo

A lightweight, behavior-based 2D game engine written in TypeScript.

## Installation

```bash
# Using pnpm (recommended)
pnpm add @dryanovski/gamefoo

# Using npm
npm install @dryanovski/gamefoo
```

## Quick Start

### Browser

```typescript
import { Engine, WebRenderer, Player, Control, Input, ObjectSystem } from '@dryanovski/gamefoo';

const renderer = new WebRenderer('game-canvas', 800, 600);
const engine = new Engine(renderer, { backgroundColor: '#1a1a2e' });

class Hero extends Player {
  render(ctx) {
    ctx.fillRect(this.x, this.y, 50, 50, '#5566ff');
  }
}

const player = new Hero('hero', 400, 300, 50, 50);
player.attachBehaviour(new Control(player, new Input()));

engine.use(new ObjectSystem([player]));
engine.setup(() => console.log('Game started!'));
```

## Development

```bash
# Install dependencies
pnpm install

# Run web demos (dev server with HMR)
pnpm run dev

# Run terminal demo
pnpm tsx terminal_demos/basic/index.ts

# Build the library
pnpm run build

# Run tests
pnpm test

# Type checking
pnpm run typecheck

# Lint and format
pnpm run lint
pnpm run format
```

## License

MIT
