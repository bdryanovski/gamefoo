// The terminal loop targets the Bun runtime; declare the subset of its
// global API we use so type-checking does not depend on ambient Bun types.
declare const Bun: { nanoseconds(): number };

export function createBunLoop(config: { fps?: number; onTick: (dt: number) => void }) {
  const fps = config.fps ?? 30;
  const targetMs = 1000 / fps;
  let running = false;
  let lastNs = 0;

  const tick = () => {
    if (!running) {
      return;
    }
    const nowNs = Bun.nanoseconds();
    const dt = (nowNs - lastNs) / 1e9;
    lastNs = nowNs;
    config.onTick(dt);
    const elapsed = (Bun.nanoseconds() - nowNs) / 1e6;
    const sleep = Math.max(0, targetMs - elapsed);
    setTimeout(tick, sleep);
  };

  return {
    start() {
      running = true;
      lastNs = Bun.nanoseconds();
      tick();
    },
    stop() {
      running = false;
    },
  };
}
