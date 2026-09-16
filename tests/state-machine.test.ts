/**
 * Contract: StateMachine public API
 *
 * Verifies that every public member exists with the correct type.
 * Add a test when a new public method/property is introduced.
 */
import { describe, expect, test } from 'vitest';
import StateMachine from '../src/core/state_machine';

describe('StateMachine', () => {
  const fsm = new StateMachine('a');

  test('current — getter returns the initial state', () => {
    expect(fsm.current).toBe('a');
  });

  test('previous — getter returns null before any transition', () => {
    expect(fsm.previous).toBeNull();
  });

  test('is() — exists and returns boolean', () => {
    expect(typeof fsm.is('a')).toBe('boolean');
  });

  test('isAny() — exists and returns boolean', () => {
    expect(typeof fsm.isAny('a', 'b')).toBe('boolean');
  });

  test('transition() — exists and returns boolean', () => {
    expect(typeof fsm.transition('b')).toBe('boolean');
  });

  test('onEnter() — exists and returns an unsubscribe function', () => {
    const unsub = fsm.onEnter('a', () => {});
    expect(typeof unsub).toBe('function');
  });

  test('onExit() — exists and returns an unsubscribe function', () => {
    const unsub = fsm.onExit('a', () => {});
    expect(typeof unsub).toBe('function');
  });

  test('destroy() — exists and is callable', () => {
    expect(typeof fsm.destroy).toBe('function');
    expect(() => fsm.destroy()).not.toThrow();
  });
});
