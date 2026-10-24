import type { ScopedState } from '../../../src/index';
import type { GameContext } from './context';

export function game(services: object | undefined): GameContext | undefined {
  return services as GameContext | undefined;
}

export function saveScope(services: object | undefined, name: string): ScopedState | null {
  return game(services)?.save.scope(name) ?? null;
}
