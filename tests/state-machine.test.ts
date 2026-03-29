/**
 * API contract tests for StateMachine
 *
 * Verifies the public surface: constructor, current/previous getters,
 * is(), isAny(), transition(), onEnter(), onExit(), destroy().
 */
import { describe, expect, test } from 'bun:test';
import StateMachine from '../src/core/state_machine';

enum Phase {
  Menu = 'menu',
  Playing = 'playing',
  Paused = 'paused',
  GameOver = 'gameover',
}

describe('StateMachine', () => {
  describe('constructor', () => {
    test('accepts an initial state', () => {
      const fsm = new StateMachine(Phase.Menu);
      expect(fsm.current).toBe(Phase.Menu);
    });

    test('previous is null before any transition', () => {
      const fsm = new StateMachine(Phase.Menu);
      expect(fsm.previous).toBeNull();
    });
  });

  describe('is()', () => {
    test('returns true when current state matches', () => {
      const fsm = new StateMachine(Phase.Menu);
      expect(fsm.is(Phase.Menu)).toBe(true);
    });

    test('returns false when current state does not match', () => {
      const fsm = new StateMachine(Phase.Menu);
      expect(fsm.is(Phase.Playing)).toBe(false);
    });
  });

  describe('isAny()', () => {
    test('returns true if current state is in the provided list', () => {
      const fsm = new StateMachine(Phase.Playing);
      expect(fsm.isAny(Phase.Playing, Phase.Paused)).toBe(true);
    });

    test('returns false if current state is not in the list', () => {
      const fsm = new StateMachine(Phase.Menu);
      expect(fsm.isAny(Phase.Playing, Phase.Paused)).toBe(false);
    });
  });

  describe('transition()', () => {
    test('returns true when a valid transition occurs', () => {
      const fsm = new StateMachine(Phase.Menu);
      expect(fsm.transition(Phase.Playing)).toBe(true);
    });

    test('updates current state after transition', () => {
      const fsm = new StateMachine(Phase.Menu);
      fsm.transition(Phase.Playing);
      expect(fsm.current).toBe(Phase.Playing);
    });

    test('updates previous state after transition', () => {
      const fsm = new StateMachine(Phase.Menu);
      fsm.transition(Phase.Playing);
      expect(fsm.previous).toBe(Phase.Menu);
    });

    test('returns false when transitioning to the current state', () => {
      const fsm = new StateMachine(Phase.Menu);
      expect(fsm.transition(Phase.Menu)).toBe(false);
    });

    test('does not change current state on a no-op transition', () => {
      const fsm = new StateMachine(Phase.Menu);
      fsm.transition(Phase.Menu);
      expect(fsm.current).toBe(Phase.Menu);
    });

    test('tracks multiple sequential transitions correctly', () => {
      const fsm = new StateMachine(Phase.Menu);
      fsm.transition(Phase.Playing);
      fsm.transition(Phase.Paused);
      expect(fsm.current).toBe(Phase.Paused);
      expect(fsm.previous).toBe(Phase.Playing);
    });
  });

  describe('onEnter()', () => {
    test('fires callback when entering the subscribed state', () => {
      const fsm = new StateMachine(Phase.Menu);
      let called = false;
      fsm.onEnter(Phase.Playing, () => {
        called = true;
      });
      fsm.transition(Phase.Playing);
      expect(called).toBe(true);
    });

    test('does not fire for unrelated transitions', () => {
      const fsm = new StateMachine(Phase.Menu);
      let called = false;
      fsm.onEnter(Phase.GameOver, () => {
        called = true;
      });
      fsm.transition(Phase.Playing);
      expect(called).toBe(false);
    });

    test('returns an unsubscribe function', () => {
      const fsm = new StateMachine(Phase.Menu);
      let count = 0;
      const unsub = fsm.onEnter(Phase.Playing, () => count++);
      fsm.transition(Phase.Playing);
      fsm.transition(Phase.Menu);
      unsub();
      fsm.transition(Phase.Playing);
      expect(count).toBe(1);
    });
  });

  describe('onExit()', () => {
    test('fires callback when exiting the subscribed state', () => {
      const fsm = new StateMachine(Phase.Menu);
      let called = false;
      fsm.onExit(Phase.Menu, () => {
        called = true;
      });
      fsm.transition(Phase.Playing);
      expect(called).toBe(true);
    });

    test('does not fire on a no-op transition', () => {
      const fsm = new StateMachine(Phase.Menu);
      let called = false;
      fsm.onExit(Phase.Menu, () => {
        called = true;
      });
      fsm.transition(Phase.Menu);
      expect(called).toBe(false);
    });

    test('returns an unsubscribe function', () => {
      const fsm = new StateMachine(Phase.Menu);
      let count = 0;
      const unsub = fsm.onExit(Phase.Menu, () => count++);
      fsm.transition(Phase.Playing);
      fsm.transition(Phase.Menu);
      unsub();
      fsm.transition(Phase.Playing);
      expect(count).toBe(1);
    });
  });

  describe('destroy()', () => {
    test('clears all hooks so they no longer fire', () => {
      const fsm = new StateMachine(Phase.Menu);
      let entered = false;
      let exited = false;
      fsm.onEnter(Phase.Playing, () => {
        entered = true;
      });
      fsm.onExit(Phase.Menu, () => {
        exited = true;
      });
      fsm.destroy();
      fsm.transition(Phase.Playing);
      expect(entered).toBe(false);
      expect(exited).toBe(false);
    });
  });
});
