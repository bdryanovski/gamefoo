export interface LoopConfig {
  fps?: number; // target FPS, default 30
  onTick: (dt: number) => void;
}

export function createTerminalLoop(config: LoopConfig) {
  const fps = config.fps ?? 30;
  const interval = Math.floor(1000 / fps);
  let lastTime = Date.now();
  let handle: ReturnType<typeof setInterval> | null = null;

  const tick = () => {
    const now = Date.now();
    const dt = (now - lastTime) / 1000;
    lastTime = now;
    config.onTick(dt);
  };

  return {
    start() {
      handle = setInterval(tick, interval);
    },
    stop() {
      if (handle !== null) clearInterval(handle);
    },
  };
}

export function createBunLoop(config: LoopConfig) {
  const fps = config.fps ?? 30;
  const targetMs = 1000 / fps;
  let running = false;
  let lastNs = 0;

  const tick = () => {
    if (!running) return;
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
