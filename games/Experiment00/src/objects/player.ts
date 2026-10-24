import type { DeltaTime } from '../../../../src/generic_types';
import type { AssetManager, InputSystem, Vector2 } from '../../../../src/index';
import {
  type CollisionMap,
  FootstepTrailShader,
  GlowShader,
  MapObject,
  type MapObjectContext,
  type Rect,
} from '../../../../src/index';
import { FogLight } from '../behaviors/fog_light';

const SIZE = 16;
const SPEED = 64; // px/s

type Facing = 'down' | 'up' | 'left' | 'right';

/** Where a freshly spawned player starts: centred in a screen, at a z-level. */
export interface PlayerSpawn {
  /** Screen width in world pixels. */
  width: number;
  /** Screen height in world pixels. */
  height: number;
  /** Z-level the player is drawn on; layers above it occlude it. */
  level: number;
}

/**
 * The playable character, bound to the "player" object and driven by its
 * exported state machine. The class turns mapped movement actions into movement,
 * resolves collisions against solid {@link MapObject.colliders}, and drives
 * the FSM so the animation matches direction + moving/idle state.
 *
 * Unlike map placements, the player is owned by the game (not a
 * {@link Screen}) so it survives screen changes; the game repositions it on
 * transitions. Being a {@link MapObject} it already supports shaders — a
 * faint aura is attached in {@link Player.onSpawn} to show it off.
 *
 * State map (authored names): `Down/Up/Left/Right` = walking (Left mirrors
 * the right-walk art), `Idle` = idle facing down, `idle_up` = idle facing up.
 */
export class Player extends MapObject {
  static override readonly type = 'me';

  private readonly input: InputSystem;
  private facing: Facing = 'down';
  private moving = false;

  constructor(ctx: MapObjectContext, input: InputSystem) {
    super(ctx);
    this.input = input;
  }

  /**
   * Builds the persistent player from this class's own prefab, centred in
   * `spawn`.
   *
   * Unlike map placements the player is owned by the game rather than a
   * {@link Screen}, so it is constructed by hand and survives screen changes.
   * The starting animation state is settled by {@link Player.onSpawn}, which
   * plays `Idle`, so no `startStateId` is needed here.
   *
   * @param assets - Catalog holding the prefab and resolving its frames.
   * @param input - Action source driving movement.
   * @param spawn - Screen box to centre in, plus the z-level to draw at.
   * @param services - The shared services bag (the game context).
   * @returns The player, or `null` when the prefab is missing from `assets`.
   *
   * @example
   * ```ts
   * const player = Player.spawn(map.assets, input, { width: 320, height: 256, level: 3 }, ctx);
   * player?.onSpawn();
   * ```
   */
  static spawn(
    assets: AssetManager,
    input: InputSystem,
    spawn: PlayerSpawn,
    services: object,
  ): Player | null {
    const def = assets.objectByName(Player.type);
    if (!def) {
      return null;
    }
    return new Player(
      {
        assets,
        machine: def.machine,
        def,
        properties: def.properties,
        services,
        x: (spawn.width - SIZE) / 2,
        y: (spawn.height - SIZE) / 2,
        level: spawn.level,
      },
      input,
    );
  }

  override onSpawn(): void {
    this.attachShader(
      new FootstepTrailShader({
        color: '#1a1a1a',
        spacing: 6,
        life: 2,
        size: 2,
        offset: 2,
        alpha: 0.25,
      }),
    );
    this.attachShader(
      new GlowShader({
        color: '#9bbc0f',
        radius: 12,
        intensity: 0.25,
        pulseSpeed: 1.2,
        pulseAmount: 0.4,
      }),
    );
    this.play('Idle');
    // A halo in the dither fog — without it the ambient fog hides the world
    // around the character. Centred on the 16px footprint (the sprite grid is
    // 17px). Released again on despawn.
    this.attachBehaviour(
      new FogLight(this, {
        innerRadius: 26,
        ditherRadius: 148,
        offsetX: SIZE / 2,
        offsetY: SIZE / 2,
      }),
    );
  }

  /** The player's world-space collision/footprint box. */
  box(): Rect {
    return { x: this.x, y: this.y, width: SIZE, height: SIZE };
  }

  /** Centre point of the footprint — where the player is in the world. */
  center(): Vector2 {
    return { x: this.x + SIZE / 2, y: this.y + SIZE / 2 };
  }

  /** Whether the player moved on the last update — drives footstep audio. */
  isWalking(): boolean {
    return this.moving;
  }

  /** A slightly enlarged box used to reach nearby interactables. */
  interactionBox(): Rect {
    const reach = 6;
    return {
      x: this.x - reach,
      y: this.y - reach,
      width: SIZE + reach * 2,
      height: SIZE + reach * 2,
    };
  }

  /** Teleports the player (used by the game on screen transitions). */
  place(x: number, y: number): void {
    this.x = x;
    this.y = y;
  }

  /** Teleports the player to the centre of a `width`×`height` screen. */
  placeAtCentre(width: number, height: number): void {
    this.place((width - SIZE) / 2, (height - SIZE) / 2);
  }

  /**
   * Teleports the player to `(x, y)`, pulled back inside the screen so the
   * whole sprite stays visible when an authored spawn sits in a border tile.
   */
  placeClamped(x: number, y: number, width: number, height: number): void {
    this.place(Math.max(0, Math.min(width - SIZE, x)), Math.max(0, Math.min(height - SIZE, y)));
  }

  /**
   * Pulls the player back inside the screen bounds, in place. Screens no
   * longer hand off at their edges — portals are the only exit — so the player
   * is kept on-screen after every move.
   */
  clampToBounds(width: number, height: number): void {
    this.placeClamped(this.x, this.y, width, height);
  }

  /**
   * Whether the player is standing in geometry, judged by its foot point: a
   * resolved slide can leave it embedded in a wall or over a pit.
   */
  isStuckInGeometry(collision: CollisionMap): boolean {
    const foot = this.footPoint();
    return !collision.isWalkable(foot.x, foot.y);
  }

  /** Reads the current movement intent from the active scheme, `-1..1` per axis. */
  private readInput(): { x: number; y: number } {
    return this.input.getRawDirection();
  }

  /** Centre-bottom "foot" point, used for the walkable-ground check. */
  private footPoint(): Vector2 {
    return { x: this.x + SIZE / 2, y: this.y + SIZE - 2 };
  }

  /** Picks the FSM state that matches the current facing + moving flag. */
  private desiredState(): string {
    if (this.moving) {
      switch (this.facing) {
        case 'up': {
          return 'Up';
        }
        case 'down': {
          return 'Down';
        }
        case 'left': {
          return 'Left';
        }
        case 'right': {
          return 'Right';
        }
        default: {
          return 'Idle';
        }
      }
    }

    switch (this.facing) {
      case 'up': {
        return 'idle_up';
      }
      case 'down': {
        return 'idle_down';
      }
      case 'left': {
        return 'idle_left';
      }
      case 'right': {
        return 'idle_right';
      }
      default: {
        return 'Idle';
      }
    }
  }

  /**
   * Advances the player: input → movement (resolved against the shared
   * {@link CollisionMap} so it bumps solids and slides along walls) →
   * facing → animation state → base update (animation + shaders).
   *
   * @param deltaTime - Seconds since the previous frame.
   * @param collision - The current screen's collision world (optional).
   */
  // oxlint-disable-next-line max-statements
  override update(deltaTime: DeltaTime, collision?: CollisionMap): void {
    const dir = this.readInput();
    this.moving = dir.x !== 0 || dir.y !== 0;

    let vx = dir.x;
    let vy = dir.y;
    if (vx !== 0 && vy !== 0) {
      vx *= Math.SQRT1_2;
      vy *= Math.SQRT1_2;
    }
    const dx = vx * SPEED * deltaTime;
    const dy = vy * SPEED * deltaTime;
    if (collision) {
      const next = collision.resolve(this.box(), dx, dy, this);
      this.x = next.x;
      this.y = next.y;
    } else {
      this.x += dx;
      this.y += dy;
    }

    if (this.moving) {
      if (dir.x < 0) {
        this.facing = 'left';
      } else if (dir.x > 0) {
        this.facing = 'right';
      } else if (dir.y < 0) {
        this.facing = 'up';
      } else if (dir.y > 0) {
        this.facing = 'down';
      }
    }

    this.play(this.desiredState());
    super.update(deltaTime);
  }
}
