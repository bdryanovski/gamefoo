import type { AudioSystem, DialogRunner, Input, StateStore } from '../../../src';
import type { Inventory } from './inventory';
import type { Telemetry } from './telemetry';

export interface GameContext {
  readonly input: Input;
  readonly save: StateStore;
  readonly inventory: Inventory;
  readonly telemetry: Telemetry;
  readonly dialog: DialogRunner;
  readonly audio: AudioSystem;
}
