import React from "react";
import {
  PhotoIcon,
  MapIcon,
  CubeIcon,
  PersonIcon,
  SaveIcon,
  ArrowUndoIcon,
  ScreenSizeIcon,
  CursorIcon,
  GridIcon,
  RectangleWideIcon,
  HandIcon,
  PaintbrushIcon,
  Paintbrush2SparkleIcon,
  EraserIcon,
  PaintBucketIcon,
  EyedropperIcon,
  ArrowMoveIcon,
  EyeIcon,
  EyeOffIcon,
  SquareDragIcon,
  DeleteIcon,
  CancelIcon,
  CheckmarkIcon,
  PencilIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  PlayIcon,
  AddIcon,
  SubtractIcon,
  LayersIcon,
  SettingsIcon,
  CircleIcon,
  SquareIcon,
  TriangleIcon,
  SparkleIcon,
} from "@proicons/react";

/**
 * The single boundary to the icon library. Application code references
 * icons by these semantic names only — never by a vendor component — so the
 * whole set can be re-pointed at a different library by editing this map.
 */
const REGISTRY = {
  "sprite-editor": PhotoIcon,
  "map-editor": MapIcon,
  objects: CubeIcon,
  character: PersonIcon,
  save: SaveIcon,
  undo: ArrowUndoIcon,
  "zoom-reset": ScreenSizeIcon,
  "tool-select": CursorIcon,
  "tool-grid": GridIcon,
  "tool-stream": Paintbrush2SparkleIcon,
  "tool-region": RectangleWideIcon,
  "tool-pan": HandIcon,
  "tool-paint": PaintbrushIcon,
  "tool-erase": EraserIcon,
  "tool-fill": PaintBucketIcon,
  "tool-pick": EyedropperIcon,
  "tool-move": ArrowMoveIcon,
  eye: EyeIcon,
  "eye-off": EyeOffIcon,
  grip: SquareDragIcon,
  delete: DeleteIcon,
  close: CancelIcon,
  check: CheckmarkIcon,
  draw: PencilIcon,
  prev: ChevronLeftIcon,
  next: ChevronRightIcon,
  play: PlayIcon,
  up: ChevronUpIcon,
  down: ChevronDownIcon,
  add: AddIcon,
  subtract: SubtractIcon,
  layers: LayersIcon,
  settings: SettingsIcon,
  "shape-circle": CircleIcon,
  "shape-box": SquareIcon,
  "shape-custom": TriangleIcon,
  sparkle: SparkleIcon,
} as const;

export type IconName = keyof typeof REGISTRY;

interface Props {
  name: IconName;
  /** Pixel size (square). Defaults to 14 to suit the toolbar chrome. */
  size?: number;
  className?: string;
  /** Tooltip; also wraps the icon so the title is exposed to the DOM. */
  title?: string;
  /** Override colour; defaults to `currentColor` so icons inherit text colour. */
  color?: string;
}

export function Icon({ name, size = 14, className, title, color }: Props) {
  const Glyph = REGISTRY[name];
  const svg = (
    <Glyph
      size={size}
      color={color}
      className={`pi-icon${className ? ` ${className}` : ""}`}
      aria-hidden={title ? undefined : true}
    />
  );
  if (!title) return svg;
  return (
    <span className="pi-icon-wrap" title={title}>
      {svg}
    </span>
  );
}
