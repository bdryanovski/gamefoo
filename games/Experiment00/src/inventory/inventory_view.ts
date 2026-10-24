import type { RenderContext, TextFont } from '../../../../src/index';
import type { Inventory, InventoryEntry } from './inventory';
import type { ItemCatalog } from './items';
import type { Journal, JournalEntry } from './journal';

/** The inventory's top-level sections. More can be appended later. */
export type InventoryTab = 'items' | 'journal';

/** Construction options for {@link InventoryView}. */
export interface InventoryViewOptions {
  /** The player's item bag (left column of the Items section). */
  inventory: Inventory;
  /** The found-journals tracker (the Journal section). */
  journal: Journal;
  /** Turns an item id into a name + message. */
  items: ItemCatalog;
  /** Bitmap font used for all labels and body text. */
  font?: TextFont;
  /** Integer upscale applied to {@link InventoryViewOptions.font}. */
  fontScale?: number;
}

/** One tab in the header strip. */
interface TabDef {
  id: InventoryTab;
  label: string;
}

const TABS: TabDef[] = [
  { id: 'items', label: 'Items' },
  { id: 'journal', label: 'Journal' },
];

/** Colours for the book-like panel. */
const THEME = {
  backdrop: 'rgba(6, 6, 12, 0.75)',
  panel: '#1a1822',
  border: '#cdbb8a',
  pageLeft: '#211f2b',
  pageRight: '#26232f',
  spine: '#403a52',
  tabActive: '#ffe08a',
  tabIdle: '#8a84a0',
  title: '#ffe08a',
  text: '#e8e4d8',
  dim: '#8a84a0',
  highlight: '#3a3350',
  hint: '#8a84a0',
} as const;

/** A single row in the left-hand list. */
interface ListRow {
  label: string;
  dim: boolean;
}

/** Measured geometry for one frame of the overlay, shared by the draw passes. */
interface PanelLayout {
  x: number;
  y: number;
  w: number;
  h: number;
  pad: number;
  lineH: number;
  innerX: number;
  innerW: number;
  leftX: number;
  leftW: number;
  rightX: number;
  rightW: number;
  contentTop: number;
  contentBottom: number;
}

/**
 * The full-screen, book-like inventory overlay. It is a pure view + a small
 * amount of selection state: the game feeds it key events or actions and draws
 * it on top of everything else. It reads its content live from {@link Inventory},
 * {@link ItemCatalog}, and {@link Journal}.
 *
 * ### Layout
 *
 * The panel fills 80% of the surface, centred. A row of tabs runs along the
 * top (`Items`, `Journal`); beneath it every section is split into two
 * columns — a selectable list on the left, its reading pane on the right.
 *
 * ### Input
 *
 * Up/down move the selection, left/right switch tabs, and the inventory action
 * always closes. Keyboard keys and gamepad actions both resolve to these.
 *
 * @example
 * ```ts
 * const view = new InventoryView({ inventory, journal, items, font, fontScale: 2 });
 * // in the game loop:
 * if (view.isOpen) view.handleAction('up');
 * view.render(ctx);
 * ```
 */
export class InventoryView {
  private readonly inventory: Inventory;
  private readonly journal: Journal;
  private readonly items: ItemCatalog;
  private font: TextFont | undefined;
  private fontScale: number;

  private open = false;
  private tabIndex = 0;
  private readonly selection: Record<InventoryTab, number> = { items: 0, journal: 0 };

  constructor(options: InventoryViewOptions) {
    this.inventory = options.inventory;
    this.journal = options.journal;
    this.items = options.items;
    this.font = options.font;
    this.fontScale = options.fontScale ?? 2;
  }

  /** Whether the overlay is currently shown. */
  get isOpen(): boolean {
    return this.open;
  }

  /** The active section. */
  get tab(): InventoryTab {
    return TABS[this.tabIndex]!.id;
  }

  /** Late-binds the bitmap font (loaded after the view is constructed). */
  setFont(font: TextFont | undefined, scale?: number): void {
    this.font = font;
    if (scale !== undefined) {
      this.fontScale = scale;
    }
  }

  /** Shows the overlay. */
  show(): void {
    this.open = true;
  }

  /** Hides the overlay. */
  hide(): void {
    this.open = false;
  }

  /** Shows when hidden, hides when shown. */
  toggle(): void {
    this.open = !this.open;
  }

  /**
   * Handles one key. Returns `true` when the key was understood. Esc, the
   * movement keys, and tab switching are all consumed.
   */
  handleKey(event: KeyboardEvent): boolean {
    return this.handleKeyName(event.key);
  }

  /**
   * Handles one key by its {@link KeyboardEvent.key} name (case-insensitive),
   * for callers that poll a key-state API rather than raw events.
   */
  handleKeyName(key: string): boolean {
    switch (key.toLowerCase()) {
      case 'escape':
        return this.handleAction('close');
      case 'arrowup':
      case 'w':
        return this.handleAction('up');
      case 'arrowdown':
      case 's':
        return this.handleAction('down');
      case 'arrowleft':
      case 'a':
        return this.handleAction('left');
      case 'arrowright':
      case 'd':
        return this.handleAction('right');
      default:
        return false;
    }
  }

  /** Handles a semantic navigation action while the overlay is open. */
  handleAction(action: 'up' | 'down' | 'left' | 'right' | 'close'): boolean {
    if (!this.open) {
      return false;
    }
    switch (action) {
      case 'close':
        this.hide();
        return true;
      case 'up':
        this.moveSelection(-1);
        return true;
      case 'down':
        this.moveSelection(1);
        return true;
      case 'left':
        this.moveTab(-1);
        return true;
      case 'right':
        this.moveTab(1);
        return true;
      default:
        return false;
    }
  }

  /** Advances the active tab, wrapping. */
  private moveTab(delta: number): void {
    this.tabIndex = (this.tabIndex + delta + TABS.length) % TABS.length;
  }

  /** Moves the active list's selection, wrapping. No-op on an empty list. */
  private moveSelection(delta: number): void {
    const count = this.rowCount(this.tab);
    if (count <= 0) {
      return;
    }
    this.selection[this.tab] = (this.selection[this.tab]! + delta + count) % count;
  }

  /** Number of selectable rows in `tab`. */
  private rowCount(tab: InventoryTab): number {
    if (tab === 'items') {
      return this.inventory.items().length;
    }
    return this.journal.entries().length;
  }

  /** The rows drawn in the left column for the active tab. */
  private leftRows(tab: InventoryTab): ListRow[] {
    if (tab === 'items') {
      return this.inventory.items().map((entry: InventoryEntry) => ({
        label: `${this.items.get(entry.id).name} x${entry.count}`,
        dim: false,
      }));
    }
    return this.journal.entries().map((entry: JournalEntry) => ({
      label: entry.found
        ? `${this.slotLabel(entry.slot)}  ${entry.title}`
        : `${this.slotLabel(entry.slot)}  ?????? unknown`,
      dim: !entry.found,
    }));
  }

  /** The right-hand reading pane for the currently selected row. */
  private detail(tab: InventoryTab): { title: string; body: string[] } {
    if (tab === 'items') {
      const entries = this.inventory.items();
      const selected = entries[this.selection.items];
      if (!selected) {
        return { title: 'No item selected', body: [] };
      }
      const definition = this.items.get(selected.id);
      const body = definition.message ? definition.message.split('\n') : ['(no description)'];
      return { title: definition.name, body };
    }
    const entries = this.journal.entries();
    const selected = entries[this.selection.journal];
    if (!selected) {
      return { title: 'No entry selected', body: [] };
    }
    if (selected.found) {
      return { title: selected.title, body: selected.body };
    }
    return { title: `${this.slotLabel(selected.slot)}`, body: selected.encrypted };
  }

  /** Zero-padded slot number, e.g. `04`. */
  private slotLabel(slot: number): string {
    return String(slot).padStart(2, '0');
  }

  // ── Rendering ─────────────────────────────────────────────────────────────

  /** Draws the overlay. No-op while hidden. Call last, in screen space. */
  render(ctx: RenderContext): void {
    if (!this.open) {
      return;
    }
    const panelW = Math.round(ctx.width * 0.8);
    const panelH = Math.round(ctx.height * 0.8);
    const x = Math.round((ctx.width - panelW) / 2);
    const y = Math.round((ctx.height - panelH) / 2);

    ctx.fillRect(0, 0, ctx.width, ctx.height, THEME.backdrop);
    ctx.fillRect(x, y, panelW, panelH, THEME.panel);
    ctx.strokeRect(x, y, panelW, panelH, THEME.border);

    if (this.font) {
      this.renderBody(ctx, x, y, panelW, panelH);
    } else {
      this.renderFallback(ctx, x, y, panelW, panelH);
    }
  }

  /** Font-aware layout: metrics derived from the loaded bitmap font. */
  private renderBody(
    ctx: RenderContext,
    x: number,
    y: number,
    panelW: number,
    panelH: number,
  ): void {
    const layout = this.panelLayout(x, y, panelW, panelH);
    this.drawPages(ctx, layout);
    this.drawTabs(ctx, layout);
    this.drawList(ctx, layout, this.leftRows(this.tab));
    this.drawDetail(ctx, layout, this.detail(this.tab));
    ctx.drawLine(
      layout.innerX,
      layout.contentBottom + layout.pad / 2,
      layout.innerX + layout.innerW,
      layout.contentBottom + layout.pad / 2,
      THEME.spine,
    );
    this.drawLine(
      ctx,
      'W/S navigate   A/D section   Esc close',
      layout.innerX,
      layout.contentBottom + layout.lineH,
      THEME.hint,
    );
  }

  /** Measures the panel, its columns, and the content band for one frame. */
  private panelLayout(x: number, y: number, panelW: number, panelH: number): PanelLayout {
    const lineH = (this.font?.lineHeight ?? 8) * this.fontScale;
    const pad = Math.round(lineH * 0.75);
    const innerX = x + pad;
    const innerW = panelW - pad * 2;
    const gap = pad;
    const leftW = Math.round((innerW - gap) * 0.46);
    const rightW = innerW - gap - leftW;
    return {
      x,
      y,
      w: panelW,
      h: panelH,
      pad,
      lineH,
      innerX,
      innerW,
      leftX: innerX,
      leftW,
      rightX: innerX + leftW + gap,
      rightW,
      contentTop: y + pad + lineH * 2,
      contentBottom: y + panelH - pad - lineH * 2,
    };
  }

  /** Canvas-font fallback: the whole overlay collapses to simple text lines. */
  private renderFallback(
    ctx: RenderContext,
    x: number,
    y: number,
    panelW: number,
    panelH: number,
  ): void {
    const pad = 18;
    const lineH = 18;
    const tabRow = TABS.map((t) => (t.id === this.tab ? `[${t.label}]` : ` ${t.label} `)).join(
      '  ',
    );
    ctx.drawText(tabRow, x + pad, y + pad, THEME.title);
    const rows = this.leftRows(this.tab);
    rows.forEach((row, index) => {
      ctx.drawText(
        row.label,
        x + pad,
        y + pad + lineH * 2 + index * lineH,
        row.dim ? THEME.dim : THEME.text,
      );
    });
    const detail = this.detail(this.tab);
    ctx.drawText(detail.title, x + panelW / 2, y + pad + lineH * 2, THEME.title);
    const bodyText = detail.body.join(' ');
    ctx.drawText(bodyText.slice(0, 90), x + panelW / 2, y + pad + lineH * 3, THEME.text);
    ctx.drawText('Esc close', x + pad, y + panelH - pad - lineH, THEME.hint);
  }

  /** Fills the two "pages" and the centre spine of the open book. */
  private drawPages(ctx: RenderContext, layout: PanelLayout): void {
    const x = layout.x + layout.pad / 2;
    const y = layout.contentTop - layout.pad;
    const height = layout.contentBottom - layout.contentTop + layout.pad * 2;
    const spineX = layout.innerX + layout.leftW + layout.pad / 2;
    ctx.fillRect(x, y, spineX - x, height, THEME.pageLeft);
    ctx.fillRect(spineX, y, x + (layout.w - layout.pad) - spineX, height, THEME.pageRight);
    ctx.drawLine(spineX, y, spineX, y + height, THEME.spine);
  }

  /** Draws the tab strip and its active underline. */
  private drawTabs(ctx: RenderContext, layout: PanelLayout): void {
    let cursor = layout.innerX;
    for (let i = 0; i < TABS.length; i++) {
      const label = TABS[i]!.label;
      const active = i === this.tabIndex;
      this.drawLine(
        ctx,
        label,
        cursor,
        layout.y + layout.pad,
        active ? THEME.tabActive : THEME.tabIdle,
      );
      const w = this.measure(label);
      if (active) {
        ctx.fillRect(cursor, layout.y + layout.pad + layout.lineH, w, 2, THEME.tabActive);
      }
      cursor += w + layout.lineH;
    }
  }

  /** Draws the selectable list, scrolled to keep the selection visible. */
  private drawList(ctx: RenderContext, layout: PanelLayout, rows: ListRow[]): void {
    const { leftX: x, contentTop: top, contentBottom: bottom, leftW: width, lineH } = layout;
    if (rows.length === 0) {
      this.drawLine(ctx, this.emptyLabel(), x, top, THEME.dim);
      return;
    }
    const visible = Math.max(1, Math.floor((bottom - top) / lineH));
    const selected = this.selection[this.tab]!;
    const maxOffset = Math.max(0, rows.length - visible);
    const offset = Math.min(Math.max(0, selected - visible + 1), maxOffset);
    for (let i = 0; i < visible && offset + i < rows.length; i++) {
      const row = rows[offset + i]!;
      const rowY = top + i * lineH;
      const isSelected = offset + i === selected;
      if (isSelected) {
        ctx.fillRect(x - 4, rowY, width + 8, lineH, THEME.highlight);
      }
      this.drawLine(ctx, row.label, x, rowY, this.rowColor(isSelected, row.dim));
    }
  }

  /** The text colour for a list row: selected > dim > normal. */
  private rowColor(isSelected: boolean, dim: boolean): string {
    if (isSelected) {
      return THEME.title;
    }
    if (dim) {
      return THEME.dim;
    }
    return THEME.text;
  }

  /** Draws the reading pane: a title, a gap, then wrapped body text. */
  private drawDetail(
    ctx: RenderContext,
    layout: PanelLayout,
    detail: { title: string; body: string[] },
  ): void {
    let cursorY = layout.contentTop;
    this.drawLine(ctx, detail.title, layout.rightX, cursorY, THEME.title);
    cursorY += Math.round(layout.lineH * 1.6);
    for (const paragraph of detail.body) {
      for (const line of this.wrap(paragraph, layout.rightW)) {
        if (cursorY + layout.lineH > layout.contentBottom) {
          return;
        }
        this.drawLine(ctx, line, layout.rightX, cursorY, THEME.text);
        cursorY += layout.lineH;
      }
    }
  }

  /** Placeholder shown when the active list is empty. */
  private emptyLabel(): string {
    if (this.tab === 'items') {
      return '(no items yet)';
    }
    return '(no journal entries found)';
  }

  /** Greedy word-wrap to `maxWidth`, in pixels of the active font. */
  private wrap(text: string, maxWidth: number): string[] {
    const words = text.split(' ');
    const lines: string[] = [];
    let line = '';
    for (const word of words) {
      const trial = line ? `${line} ${word}` : word;
      if (line && this.measure(trial) > maxWidth) {
        lines.push(line);
        line = word;
      } else {
        line = trial;
      }
    }
    lines.push(line);
    return lines;
  }

  /** Draws one line with the bitmap font, or falls back to the canvas font. */
  private drawLine(ctx: RenderContext, text: string, x: number, y: number, color: string): void {
    if (this.font) {
      this.font.render(ctx, text, x, y, color, this.fontScale);
      return;
    }
    ctx.drawText(text, x, y, color);
  }

  /** Width of `text` in the active font (approximated without one). */
  private measure(text: string): number {
    if (this.font) {
      return this.font.measure(text, this.fontScale);
    }
    return text.length * 8 * this.fontScale;
  }
}
