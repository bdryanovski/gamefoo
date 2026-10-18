import { MapSystem } from '../../../../src/index';
import type { RenderContext, Screen } from '../../../../src/index';
import type { GameContext, WorldRef } from '../context';
import { Player } from '../objects/player';
import { Portal } from '../objects/portal';

export interface WorldConfig {
  screenW: number;
  screenH: number;
  /** The world→screen upscale (render sandwich). */
  scale: number;
  /** The z-level the player's overlay renders at (under occluding layers). */
  playerLevel: number;
}

/**
 * The world: a {@link MapSystem} (map ownership, navigation, the scale render
 * sandwich) plus the persistent, game-owned player. It advances the player
 * while the world is live, freezes behind modals, and exposes {@link WorldRef}
 * for the interaction systems. Critters pull the world straight from the
 * shared services bag — the objects ask the services instead of being pushed.
 */
export class WorldSystem extends MapSystem implements WorldRef {
  override readonly id = 'world';

  constructor(
    private readonly ctx: GameContext,
    private readonly worldConfig: WorldConfig,
  ) {
    super();
    this.config = {
      scale: worldConfig.scale,
      overlay: () => this.overlay(),
      isActive: () => this.ctx.flow?.worldActive ?? false,
      isVisible: () => !this.ctx.flow?.has('splash'),
    };
  }

  // --- boot bindings ------------------------------------------------------

  /** Builds the persistent player from the loaded "player" prefab. */
  spawnPlayer(): void {
    const assets = this.assets;
    if (!assets) return;
    const player = Player.spawn(
      assets,
      this.ctx.input,
      {
        width: this.worldConfig.screenW,
        height: this.worldConfig.screenH,
        level: this.worldConfig.playerLevel,
      },
      this.ctx,
    );
    if (!player) return;
    this.ctx.player = player;
    // The player's own fog halo and shaders are attached by `onSpawn` itself.
    player.onSpawn();
    this.current()?.collision.addOccupant(player);
  }

  // --- WorldRef -----------------------------------------------------------

  override navigate(x: number, y: number, placePlayer?: (player: Player) => void): boolean {
    const ok = super.navigate(x, y);
    if (ok) {
      const player = this.ctx.player;
      if (player && placePlayer) placePlayer(player);
    }
    return ok;
  }

  // --- frame hooks --------------------------------------------------------

  protected override onScreenEntered(x: number, y: number, _screen: Screen | undefined): void {
    const player = this.ctx.player;
    if (player) this.current()?.collision.addOccupant(player);
    this.ctx.telemetry.setScreen(x, y);
    this.ctx.telemetry.screenEnter(x, y);
  }

  protected override onBeforeUpdate(deltaTime: number): void {
    // Advance the fog's flicker with the world (it freezes with the fire glow
    // shaders while a modal or screen-cut holds the frame).
    this.ctx.fog?.update(deltaTime);
  }

  protected override onAfterUpdate(deltaTime: number, screen: Screen | undefined): void {
    const player = this.ctx.player;
    if (!player || !screen) return;
    player.update(deltaTime, screen.collision);
    // Screens no longer hand off at their edges — portals are the only exit,
    // so keep the player inside the current screen's bounds.
    player.clampToBounds(this.worldConfig.screenW, this.worldConfig.screenH);
    // A resolved slide can leave the player standing inside a wall; report it
    // so the session analytics can see how often it happens.
    if (player.isStuckInGeometry(screen.collision)) {
      this.ctx.telemetry.playerReset();
    }
  }

  protected override renderOverMap(ctx: RenderContext): void {
    // Door-opening pies draw last, above every map layer, so no wall or pillar
    // hides them.
    for (const portal of this.current()?.objectsByType(Portal) ?? []) {
      portal.renderProgress(ctx);
    }
    // Dither fog: world space, over the map, under the HUD and dialogs.
    this.ctx.fog?.render();
  }

  private overlay(): { level: number; render(ctx: RenderContext): void } | undefined {
    const player = this.ctx.player;
    if (!player) return undefined;
    return { level: this.worldConfig.playerLevel, render: (c): void => player.render(c) };
  }
}
