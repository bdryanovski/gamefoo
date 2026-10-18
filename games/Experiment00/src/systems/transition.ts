import type { ScreenTransitionShader, SubSystem } from '../../../../src';
import { TRANSITION_IN, TRANSITION_OUT } from '../constants';
import type { GameContext } from '../context';
import { easeInOut } from '../utils';

type Phase = 'idle' | 'out' | 'in';

export class TransitionSystem implements SubSystem {
  readonly id = 'transition';
  readonly order = 70;

  private shader?: ScreenTransitionShader;
  private phase: Phase = 'idle';
  private elapsed = 0;
  private apply?: () => void;

  constructor(private readonly context: GameContext) {}

  /** True while a screen-cut is playing. */
  get active(): boolean {
    return this.phase !== 'idle';
  }

  /** Installs the iris shader instance created during boot. */
  useShader(shader: ScreenTransitionShader): void {
    this.shader = shader;
  }

  /**
   * Starts a screen-cut. No-op while one is already playing. `apply` runs
   * once at the covered midpoint, so the switch hides behind the iris.
   */
  begin(apply: () => void): void {
    if (this.phase !== 'idle') return;
    this.phase = 'out';
    this.elapsed = 0;
    this.apply = apply;
    this.context.flow?.push('transition');
  }

  update(dt: number): void {
    if (this.phase === 'idle') return;
    this.elapsed += dt;
    if (this.phase === 'out') {
      const p = Math.min(1, this.elapsed / TRANSITION_OUT);
      if (this.shader) this.shader.coverage = easeInOut(p);
      if (p >= 1) {
        this.apply?.();
        this.apply = undefined;
        this.phase = 'in';
        this.elapsed = 0;
        if (this.shader) this.shader.coverage = 1;
      }
      return;
    }
    const p = Math.min(1, this.elapsed / TRANSITION_IN);
    if (this.shader) this.shader.coverage = 1 - easeInOut(p);
    if (p >= 1) {
      this.phase = 'idle';
      if (this.shader) this.shader.coverage = 0;
      this.context.flow?.pop('transition');
    }
  }
}
