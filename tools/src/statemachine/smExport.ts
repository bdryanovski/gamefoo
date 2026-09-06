import type { AppState } from "../types";
import { objectMachines } from "../types";
import { downloadJSON } from "../utils/export";

/**
 * State machines export — name-based so consumers (and re-imports) stay
 * connected to sprites/animations by name.
 *
 * Engine-side contract: the engine holds the machine, sets conditions
 * by name (developer-controlled), and renders the current state's
 * display (sprite or animation).
 */
export function exportStateMachines(state: AppState) {
  const spriteNames = new Map(state.sprites.map((s) => [s.id, s.name]));
  const animNames = new Map(state.animations.map((a) => [a.id, a.name]));

  return {
    meta: {
      version: "1.0",
      tool: "gamefoo-statemachine-editor",
      projectName: state.projectName,
    },
    machines: Object.fromEntries(
      objectMachines(state.objects).map((m) => {
        const stateName = (id: string | null) =>
          (id && m.states.find((s) => s.id === id)?.name) || null;
        return [
          m.name,
          {
            initial: stateName(m.initialStateId),
            states: Object.fromEntries(
              m.states.map((s) => [
                s.name,
                {
                  display:
                    s.display.kind === "sprite"
                      ? {
                          kind: "sprite" as const,
                          sprite: s.display.spriteId
                            ? (spriteNames.get(s.display.spriteId) ?? null)
                            : null,
                        }
                      : {
                          kind: "animation" as const,
                          animation: s.display.animationId
                            ? (animNames.get(s.display.animationId) ?? null)
                            : null,
                        },
                },
              ]),
            ),
            transitions: m.transitions.map((t) => ({
              from: stateName(t.fromStateId) ?? "?",
              to: stateName(t.toStateId) ?? "?",
              condition: t.condition,
            })),
          },
        ];
      }),
    ),
  };
}

export function downloadStateMachinesExport(state: AppState): void {
  const base = state.projectName.replace(/\s+/g, "_").toLowerCase();
  downloadJSON(exportStateMachines(state), `${base}.machines.json`);
}
