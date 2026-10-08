import React from "react";
import type {
  AppAction,
  AnimationDef,
  CollisionLayerDef,
  GameObjectDef,
  SpriteRegion,
} from "../types";
import { objectPixelSize, stateCollisions, stateHasOwnCollisions } from "../types";
import { CollisionEditor } from "../components/CollisionEditor";
import { drawObjectLayers } from "./composition";
import { uid } from "../utils/uid";

/**
 * Per-state collision editing for a game object, with the initial/idle-state
 * inheritance rules — the single source of truth shared by the Object
 * Explorer, the Character Editor and the map's floating placement inspector.
 *
 * Edits write the object definition (`collisionsByState`), so every placed
 * instance of the object on every map is affected.
 */
export function ObjectCollisionEditor({
  object,
  stateId,
  layers,
  dispatch,
  spriteById,
  animById,
  imageMap,
}: {
  object: GameObjectDef;
  /** The machine state whose collisions are edited. Null renders nothing. */
  stateId: string | null;
  layers: CollisionLayerDef[];
  dispatch: React.Dispatch<AppAction>;
  spriteById: Map<string, SpriteRegion>;
  animById: Map<string, AnimationDef>;
  imageMap: Map<string, HTMLImageElement>;
}) {
  if (!stateId) return null;

  const idleStateId = object.machine.initialStateId;
  const isIdleState = stateId === idleStateId;
  const inherited = !isIdleState && !stateHasOwnCollisions(object, stateId);
  const effective = stateCollisions(object, stateId);
  const stateName =
    object.machine.states.find((s) => s.id === stateId)?.name ?? "—";

  const setCollisions = (vols: typeof effective) =>
    dispatch({
      type: "UPDATE_OBJECT",
      id: object.id,
      updates: {
        collisionsByState: { ...object.collisionsByState, [stateId]: vols },
      },
    });

  const resetToIdle = () => {
    const cbs = { ...object.collisionsByState };
    delete cbs[stateId];
    dispatch({ type: "UPDATE_OBJECT", id: object.id, updates: { collisionsByState: cbs } });
  };

  const { width, height } = objectPixelSize(object.grid);

  return (
    <div className="section">
      <div className="section-title">
        <span>Collisions — {stateName}{inherited ? " (inherits idle)" : ""}</span>
        {!isIdleState &&
          (inherited ? (
            <button
              className="btn btn-sm"
              title="Copy idle collisions to edit them just for this state"
              onClick={() => setCollisions(effective.map((c) => ({ ...c, id: uid("col") })))}
            >
              Override
            </button>
          ) : (
            <button
              className="btn btn-sm"
              title="Discard this state's collisions and inherit idle"
              onClick={resetToIdle}
            >
              Reset to idle
            </button>
          ))}
      </div>
      {inherited && (
        <div className="text-xs text-dim" style={{ padding: "0 4px 4px" }}>
          This state uses the idle collisions. Click Override to change them here.
        </div>
      )}
      <CollisionEditor
        key={stateId}
        width={width}
        height={height}
        collisions={effective}
        layers={layers}
        onChange={setCollisions}
        dispatch={dispatch}
        drawBackdrop={(ctx, scale) =>
          drawObjectLayers(
            ctx,
            object.layersByState[stateId] ?? [],
            object.grid.cell,
            spriteById,
            animById,
            imageMap,
            scale,
            () => 1,
          )
        }
      />
    </div>
  );
}
