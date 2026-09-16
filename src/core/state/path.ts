/**
 * Internal dot-path helpers for {@link StateStore}: parsing, deep read /
 * write / delete on a plain JSON tree, structural cloning, path-relation
 * testing, and cheap value equality.
 *
 * Segments are `.`-separated (`"doors.gate1.open"`). A numeric segment
 * indexes into an array only when the parent already is one; missing
 * intermediate containers are always created as objects, so a map keyed by
 * numeric-string ids stays an object rather than a sparse array.
 *
 * @category State
 * @since 0.5.0
 * @internal
 */

import type { StateData, StateValue } from './types';

/**
 * Splits a dot path into its non-empty segments. `""` yields `[]` (the
 * root).
 */
export function splitPath(path: string): string[] {
  return path.split('.').filter((segment) => segment.length > 0);
}

/**
 * Deep-clones a JSON value, preferring the structured-clone algorithm and
 * falling back to a `JSON` round-trip on older runtimes.
 */
export function clone<T>(value: T): T {
  if (typeof structuredClone === 'function') {
    return structuredClone(value);
  }
  return JSON.parse(JSON.stringify(value)) as T;
}

/** Reads a child of an object (by key) or array (by integer index). */
function getChild(node: StateData | StateValue[], segment: string): StateValue | undefined {
  if (Array.isArray(node)) {
    const index = Number(segment);
    return Number.isInteger(index) ? node[index] : undefined;
  }
  return node[segment];
}

/** Writes a child of an object (by key) or array (by integer index). */
function setChild(node: StateData | StateValue[], segment: string, value: StateValue): void {
  if (Array.isArray(node)) {
    const index = Number(segment);
    if (Number.isInteger(index) && index >= 0) {
      node[index] = value;
    }
    return;
  }
  node[segment] = value;
}

/**
 * Reads the value at `segments`, or `undefined` when any link is missing or
 * traverses through a non-container.
 */
export function getIn(root: StateData, segments: string[]): StateValue | undefined {
  let current: StateValue | undefined = root;
  for (const segment of segments) {
    if (current === null || typeof current !== 'object') {
      return undefined;
    }
    current = getChild(current, segment);
  }
  return current;
}

/**
 * Writes `value` at `segments`, creating intermediate containers as needed.
 * `segments` must be non-empty.
 */
export function setIn(root: StateData, segments: string[], value: StateValue): void {
  let node: StateData | StateValue[] = root;
  for (let index = 0; index < segments.length - 1; index += 1) {
    const segment = segments[index]!;
    let child = getChild(node, segment);
    if (child === null || typeof child !== 'object') {
      // Missing intermediates are always objects; a numeric segment only
      // indexes an array when the parent already is one. This keeps maps
      // keyed by numeric-string ids (e.g. `olives.3`) as objects, not sparse
      // arrays. Whole arrays are written wholesale via `set(path, [...])`.
      child = {};
      setChild(node, segment, child);
    }
    node = child as StateData | StateValue[];
  }
  setChild(node, segments[segments.length - 1]!, value);
}

/**
 * Deletes the value at `segments`. Returns whether anything was removed
 * (array elements are spliced out; object keys are deleted).
 */
export function deleteIn(root: StateData, segments: string[]): boolean {
  if (segments.length === 0) {
    return false;
  }
  const parentSegments = segments.slice(0, -1);
  const parent: StateValue | undefined =
    parentSegments.length === 0 ? root : getIn(root, parentSegments);
  const key = segments[segments.length - 1]!;
  if (parent === null || parent === undefined || typeof parent !== 'object') {
    return false;
  }
  if (Array.isArray(parent)) {
    const index = Number(key);
    if (Number.isInteger(index) && index >= 0 && index < parent.length) {
      parent.splice(index, 1);
      return true;
    }
    return false;
  }
  if (Object.hasOwn(parent, key)) {
    delete parent[key];
    return true;
  }
  return false;
}

/**
 * Whether a subscription at `subscribed` should be woken by a change at
 * `changed`. True when the paths are equal, when either is the empty root,
 * or when one is a strict ancestor of the other — so a subscriber on
 * `"doors"` hears `"doors.gate1.open"`, and vice versa.
 */
export function isRelated(subscribed: string, changed: string): boolean {
  if (subscribed === '' || changed === '' || subscribed === changed) {
    return true;
  }
  return changed.startsWith(`${subscribed}.`) || subscribed.startsWith(`${changed}.`);
}

/**
 * Cheap structural equality used to suppress no-op writes. Primitives use
 * `Object.is`; objects/arrays fall back to a `JSON` comparison (adequate
 * for the JSON-shaped values the store holds).
 */
export function sameValue(a: StateValue | undefined, b: StateValue | undefined): boolean {
  if (Object.is(a, b)) {
    return true;
  }
  if (a === null || b === null || typeof a !== 'object' || typeof b !== 'object') {
    return false;
  }
  return JSON.stringify(a) === JSON.stringify(b);
}
