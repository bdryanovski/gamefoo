import React, {
  cloneElement,
  isValidElement,
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";

type Side = "top" | "bottom" | "left" | "right";

interface Props {
  /** Primary tooltip text. */
  label: React.ReactNode;
  /** Optional keyboard hint rendered as a dim chip (e.g. "V", "Ctrl+S"). */
  shortcut?: string;
  /** Preferred side; flips automatically when it would overflow the viewport. */
  side?: Side;
  /** Single interactive child the tooltip is anchored to. */
  children: React.ReactElement;
}

interface Placement {
  left: number;
  top: number;
  side: Side;
}

/** A child that may already carry a ref/handlers we must preserve. */
type AnchorProps = Record<string, unknown> & {
  ref?: React.Ref<HTMLElement>;
};

type PointerHandler = ((event: unknown) => void) | undefined;

const SHOW_DELAY = 140;
const GAP = 8;

function opposite(side: Side): Side {
  if (side === "top") return "bottom";
  if (side === "bottom") return "top";
  if (side === "left") return "right";
  return "left";
}

function place(rect: DOMRect, tip: DOMRect, preferred: Side): Placement {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const fits: Record<Side, boolean> = {
    top: rect.top - tip.height - GAP >= 0,
    bottom: rect.bottom + tip.height + GAP <= vh,
    left: rect.left - tip.width - GAP >= 0,
    right: rect.right + tip.width + GAP <= vw,
  };
  const order: Side[] = [preferred, opposite(preferred), "top", "bottom", "right", "left"];
  const side = order.find((s) => fits[s]) ?? preferred;

  let left: number;
  let top: number;
  if (side === "top" || side === "bottom") {
    left = rect.left + rect.width / 2 - tip.width / 2;
    top = side === "top" ? rect.top - tip.height - GAP : rect.bottom + GAP;
  } else {
    left = side === "left" ? rect.left - tip.width - GAP : rect.right + GAP;
    top = rect.top + rect.height / 2 - tip.height / 2;
  }
  left = Math.max(4, Math.min(left, vw - tip.width - 4));
  top = Math.max(4, Math.min(top, vh - tip.height - 4));
  return { left, top, side };
}

export function Tooltip({ label, shortcut, side = "top", children }: Props) {
  const anchorRef = useRef<HTMLElement | null>(null);
  const tipRef = useRef<HTMLDivElement | null>(null);
  const timer = useRef<number | null>(null);
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<Placement>({ left: 0, top: 0, side });

  const show = useCallback(() => {
    clearTimeout(timer.current ?? undefined);
    timer.current = window.setTimeout(() => setOpen(true), SHOW_DELAY);
  }, []);

  const hide = useCallback(() => {
    clearTimeout(timer.current ?? undefined);
    setOpen(false);
  }, []);

  // Measure once mounted, then lock the final (possibly flipped) position.
  useLayoutEffect(() => {
    if (!open || !anchorRef.current || !tipRef.current) return;
    setPos(place(anchorRef.current.getBoundingClientRect(), tipRef.current.getBoundingClientRect(), side));
  }, [open, side]);

  if (!isValidElement(children)) return children;

  const childProps = children.props as AnchorProps;
  const childRef = childProps.ref;
  const setRef = (node: HTMLElement | null) => {
    anchorRef.current = node;
    if (typeof childRef === "function") childRef(node);
    else if (childRef && typeof childRef === "object") {
      (childRef as React.MutableRefObject<HTMLElement | null>).current = node;
    }
  };

  const chain = (own: PointerHandler, mine: () => void) => (event: unknown) => {
    own?.(event);
    mine();
  };

  const trigger = cloneElement(children as React.ReactElement<AnchorProps>, {
    ref: setRef,
    onPointerEnter: chain(childProps.onPointerEnter as PointerHandler, show),
    onPointerLeave: chain(childProps.onPointerLeave as PointerHandler, hide),
    onPointerDown: chain(childProps.onPointerDown as PointerHandler, hide),
    onFocus: chain(childProps.onFocus as PointerHandler, show),
    onBlur: chain(childProps.onBlur as PointerHandler, hide),
  });

  return (
    <>
      {trigger}
      {open &&
        createPortal(
          <div
            ref={tipRef}
            className={`tooltip tooltip--${pos.side}`}
            role="tooltip"
            style={{ left: pos.left, top: pos.top }}
          >
            <span className="tooltip__label">{label}</span>
            {shortcut && <span className="tooltip__kbd">{shortcut}</span>}
          </div>,
          document.body,
        )}
    </>
  );
}
