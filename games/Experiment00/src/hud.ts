import type { RenderContext } from '../../../src/index';

/**
 * A transient on-screen message with a countdown.
 */
interface Toast {
  text: string;
  remaining: number;
}

// A tiny module-level message bus so any part of the game (screen classes,
// objects, the engine loop) can surface story/UI text without threading a
// reference through everyone. The newest un-expired toast is what renders.
const toasts: Toast[] = [];

/**
 * Queues a message shown for `seconds`. Screen classes call this from their
 * `onEnter` to narrate a room or announce an event.
 */
export function showMessage(text: string, seconds = 2): void {
  toasts.push({ text, remaining: seconds });
}

/**
 * Advances every queued message and drops the expired ones. Call once per
 * frame from the game's `update`.
 */
export function updateMessages(deltaTime: number): void {
  for (const toast of toasts) {
    toast.remaining -= deltaTime;
  }
  while (toasts.length > 0 && (toasts[0]?.remaining ?? 0) <= 0) {
    toasts.shift();
  }
}

/**
 * Draws the newest active message at `(x, y)`. Call from the game's `render`
 * after the world so it sits on top.
 */
export function drawMessages(ctx: RenderContext, x: number, y: number): void {
  const toast = toasts[toasts.length - 1];
  if (!toast) {
    return;
  }
  ctx.drawText(toast.text, x, y, '#ffe9a8');
}

/**
 * Drops every queued message.
 */
export function clearMessages(): void {
  toasts.length = 0;
}
