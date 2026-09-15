import mixpanel from 'mixpanel-browser';

/**
 * Flat property values every event payload uses. Mixpanel accepts nested
 * objects, but a flat record keeps events consistent across every sink
 * (Mixpanel, an optional `endpoint`, an optional `forward`).
 */
type Value = string | number | boolean | null;
type Props = Record<string, Value>;

/** localStorage key for the stable anonymous device id. */
const UID_KEY = 'experiment00:uid';
/** localStorage key for a bound known user id (set via {@link Telemetry.identify}). */
const USER_KEY = 'experiment00:user';

/**
 * Mixpanel project token, injected at build time from the `MIX_PANEL` env var
 * (Vercel-provided; `.env.local` locally — never committed). Exposed to client
 * code via the `MIX_PANEL` entry in `vite.config.ts`'s `envPrefix`. When
 * absent (e.g. a build with no token configured) Mixpanel is disabled and the
 * other sinks still receive events.
 */
const MIXPANEL_TOKEN = (import.meta.env.MIX_PANEL as string | undefined)?.trim();

/** True once {@link ensureMixpanel} has successfully initialised the SDK. */
let mixpanelReady = false;

/**
 * Idempotently initialises the Mixpanel browser SDK. Returns whether Mixpanel
 * is usable — `false` when no `MIX_PANEL` token is configured.
 */
function ensureMixpanel(): boolean {
  if (mixpanelReady) return true;
  if (!MIXPANEL_TOKEN) return false;
  mixpanel.init(MIXPANEL_TOKEN, {
    // EU data residency — this project lives on Mixpanel's EU cluster, so
    // ingestion MUST target the EU host (the default routes to US and
    // silently lands in the wrong region).
    api_host: 'https://api-eu.mixpanel.com',
    // Auto-capture page views, clicks, and form interactions on top of the
    // typed gameplay events emitted below.
    autocapture: true,
    // Record 100% of sessions for session replay.
    record_sessions_percent: 100,
    persistence: 'localStorage',
    debug: false,
  });
  mixpanelReady = true;
  return true;
}

/** One emitted event: its name and the full, flat payload sent to every sink. */
export interface TelemetryEvent {
  name: string;
  props: Props;
}

/**
 * Options for {@link Telemetry}.
 */
export interface TelemetryOptions {
  /**
   * A second endpoint the SAME events are POSTed to (via `navigator.sendBeacon`)
   * as JSON. Point it at your own collector / serverless function that appends
   * to a per-user store.
   */
  endpoint?: string;
  /**
   * A custom sink for the SAME events — e.g. forward to PostHog/Amplitude,
   * which support `identify` + per-user timelines:
   * `forward: (e) => posthog.capture(e.name, e.props)`.
   */
  forward?: (event: TelemetryEvent) => void;
}

/**
 * Central analytics for Experiment00.
 *
 * Wraps `mixpanel-browser` and fans every event to up to three sinks: Mixpanel
 * (per-user event timelines), an optional `endpoint` (your own per-user store),
 * and an optional `forward` callback (PostHog/Amplitude/…). Each event is
 * stamped with everything needed to reconstruct **one user's journey**:
 *
 * - `uid` — stable **anonymous device id** (persisted in `localStorage`).
 * - `user` — **known identity** once {@link Telemetry.identify} is called
 *   (defaults to `uid` until then), also persisted.
 * - `sid` — **session id** (per page load).
 * - `seq` — **monotonic counter** within the session, so events sort into order.
 * - `ts` — wall-clock ms; `t` — seconds since boot.
 * - `screen` — the current room.
 *
 * ### Individual-user tracking
 * Mixpanel gives an ordered per-person timeline out of the box: call
 * {@link Telemetry.identify} to bind a known identity, and every later event is
 * attributed to that user. For extra sinks, set `endpoint` (your own store) or
 * `forward` (another product-analytics SDK) — the same stamped events flow there.
 *
 * @example Anonymous (default)
 * ```ts
 * const telemetry = new Telemetry();
 * ```
 *
 * @example Bind a known identity after sign-in
 * ```ts
 * const telemetry = new Telemetry();
 * telemetry.identify(loggedInUser.id, { plan: 'pro' });
 * ```
 *
 * @example Real per-user journeys via your own endpoint
 * ```ts
 * const telemetry = new Telemetry({ endpoint: '/api/telemetry' });
 * ```
 */
export class Telemetry {
  private readonly uid: string;
  private readonly sid: string;
  private userId: string;
  private readonly startedAt: number;
  private seq = 0;
  private screenX = 0;
  private screenY = 0;
  private readonly endpoint?: string;
  private readonly forward?: (event: TelemetryEvent) => void;

  constructor(options: TelemetryOptions = {}) {
    this.uid = readOrCreateUid();
    let storedUser: string | null = null;
    try {
      storedUser = localStorage.getItem(USER_KEY);
    } catch {
      storedUser = null;
    }
    this.userId = storedUser ?? this.uid;
    this.sid = uuid();
    this.startedAt = performance.now();
    this.endpoint = options.endpoint;
    this.forward = options.forward;
    if (ensureMixpanel()) {
      // Attach the stable device id so anonymous sessions are grouped, and
      // adopt any already-bound identity from a previous visit.
      mixpanel.register({ uid: this.uid });
      if (this.userId !== this.uid) {
        mixpanel.identify(this.userId);
      }
    }
    this.emit('session_start');
  }

  /**
   * Binds a **known identity** to this player (e.g. after sign-in). Persists it
   * so the same person is recognised on their next visit, and stamps every
   * later event with it. `traits` (plan, cohort, …) ride on the `identify`
   * event for your downstream store and become Mixpanel people properties.
   */
  identify(userId: string, traits?: Props): void {
    this.userId = userId;
    try {
      localStorage.setItem(USER_KEY, userId);
    } catch {
      // storage unavailable (private mode) — identity holds for this session.
    }
    if (mixpanelReady) {
      mixpanel.identify(userId);
      if (traits) {
        mixpanel.people.set(traits);
      }
    }
    this.emit('identify', traits);
  }

  /** The current identity — the known `user` id, or the anonymous device id. */
  get currentUser(): string {
    return this.userId;
  }

  /** The anonymous device id, stable across this browser's sessions. */
  get deviceId(): string {
    return this.uid;
  }

  /** The current session id (one per page load). */
  get sessionId(): string {
    return this.sid;
  }

  /**
   * Records the active screen so every later event carries it automatically.
   * Call it whenever the room changes.
   */
  setScreen(x: number, y: number): void {
    this.screenX = x;
    this.screenY = y;
  }

  // ── Lifecycle ──────────────────────────────────────────────────────────

  /** The game began loading its map/assets. */
  gameStart(): void {
    this.emit('game_start');
  }

  /** The game finished loading and is playable. */
  gameLoaded(loadMs: number): void {
    this.emit('game_loaded', { load_ms: Math.round(loadMs) });
  }

  // ── Navigation ─────────────────────────────────────────────────────────

  /** The player entered a screen (initial spawn and every portal arrival). */
  screenEnter(x: number, y: number): void {
    this.emit('screen_enter', { x, y, screen: `${x},${y}` });
  }

  // ── Portals ────────────────────────────────────────────────────────────

  /** A closed door started opening. */
  portalOpen(id: string): void {
    this.emit('portal_open', { portal: id });
  }

  /** An open door was used to travel to another screen. */
  portalTravel(id: string, to: string): void {
    this.emit('portal_travel', { portal: id, to });
  }

  /** A locked door refused to open. */
  portalLocked(id: string): void {
    this.emit('portal_locked', { portal: id });
  }

  // ── Keypad / locks ─────────────────────────────────────────────────────

  /** The 4-digit code entry opened for a locked door. */
  keypadOpen(id: string): void {
    this.emit('keypad_open', { portal: id });
  }

  /** The correct code was entered and the door unlocked. */
  keypadUnlocked(id: string): void {
    this.emit('keypad_unlocked', { portal: id });
  }

  /** The keypad was closed without solving the code. */
  keypadDismissed(id: string): void {
    this.emit('keypad_dismissed', { portal: id });
  }

  // ── Dialogs ────────────────────────────────────────────────────────────

  /** A dialog opened; `source` is what triggered it (sign, chest, king, …). */
  dialogOpen(source: string, ref: string): void {
    this.emit('dialog_open', { source, ref });
  }

  /** The player advanced/confirmed a dialog line or choice. */
  dialogAdvance(): void {
    this.emit('dialog_advance');
  }

  // ── Items ──────────────────────────────────────────────────────────────

  /** A chest was opened; `item` is what it granted (or `"none"`). */
  chestOpen(id: string, item: string | null): void {
    this.emit('chest_open', { chest: id || 'unknown', item: item ?? 'none' });
  }

  /** An olive pickup was collected. */
  olivePickup(id: string): void {
    this.emit('olive_pickup', { olive: id || 'unknown' });
  }

  // ── World ──────────────────────────────────────────────────────────────

  /** A campfire was toggled; `lit` is its new state. */
  campfireToggle(id: string, lit: boolean): void {
    this.emit('campfire_toggle', { campfire: id || 'unknown', lit });
  }

  /** A stalking enemy reached the player and greeted. */
  enemyGreeting(type: string): void {
    this.emit('enemy_greeting', { enemy: type });
  }

  /** The player stepped onto a hazard/non-walkable tile and was reset. */
  playerReset(): void {
    this.emit('player_reset');
  }

  /**
   * Escape hatch for one-off events not covered by a typed method. Prefer the
   * typed methods; this keeps ad-hoc tracking consistent (base context still
   * attached).
   */
  event(name: string, props?: Props): void {
    this.emit(name, props);
  }

  /**
   * Stamps identity + journey context onto `props` and fans the event to every
   * configured sink (Mixpanel, then `endpoint`, then `forward`).
   */
  private emit(name: string, props?: Props): void {
    this.seq += 1;
    const event: TelemetryEvent = {
      name,
      props: {
        uid: this.uid,
        user: this.userId,
        sid: this.sid,
        seq: this.seq,
        ts: Date.now(),
        t: Math.round((performance.now() - this.startedAt) / 1000),
        screen: `${this.screenX},${this.screenY}`,
        ...(props ?? {}),
      },
    };

    if (mixpanelReady) {
      mixpanel.track(event.name, event.props);
    }

    if (
      this.endpoint &&
      typeof navigator !== 'undefined' &&
      typeof navigator.sendBeacon === 'function'
    ) {
      try {
        navigator.sendBeacon(this.endpoint, JSON.stringify(event));
      } catch {
        // best-effort; a dropped analytics beacon must never break gameplay.
      }
    }

    this.forward?.(event);
  }
}

/** A random id (UUID when available). */
function uuid(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
}

/** Reads (or creates and persists) the stable anonymous device id. */
function readOrCreateUid(): string {
  try {
    const existing = localStorage.getItem(UID_KEY);
    if (existing) {
      return existing;
    }
    const id = uuid();
    localStorage.setItem(UID_KEY, id);
    return id;
  } catch {
    return uuid();
  }
}
