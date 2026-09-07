/**
 * Controls menu page for control scheme selection and display.
 *
 * @category UI
 * @module ui/menu/pages/ControlsPage
 * @since 0.5.0
 */

import { CONTROL_SCHEMES, type ControlSchemeName, listControlSchemes } from '@/core/controls';
import type { ControlScheme } from '@/core/controls/types';
import Button from '../../controls/Button';
import type { UIInputEvent, UIKeyEvent } from '../../core/types';
import Label from '../../display/Label';
import Separator from '../../display/Separator';
import HorizontalLayout from '../../layouts/HorizontalLayout';
import VerticalLayout from '../../layouts/VerticalLayout';
import MenuPage from '../MenuPage';

/**
 * Controls page configuration.
 *
 * @since 0.5.0
 */
export interface ControlsPageConfig {
  /**
   * Initial control scheme name
   */
  initialScheme?: ControlSchemeName;
  /**
   * Scheme change callback
   */
  onSchemeChange?: (scheme: ControlScheme, name: ControlSchemeName) => void;
}

/**
 * Scheme selector widget that responds to LEFT/RIGHT when focused.
 *
 * @internal
 */
class SchemeSelector extends Button {
  private _schemeNames: ControlSchemeName[];
  private _currentIndex: number = 0;
  private _onSchemeChange: ((index: number) => void) | null = null;

  constructor(config: {
    schemeNames: ControlSchemeName[];
    initialIndex: number;
    onSchemeChange: (index: number) => void;
  }) {
    super({
      text: '',
      width: 120,
      height: 16,
    });
    this._schemeNames = config.schemeNames;
    this._currentIndex = config.initialIndex;
    this._onSchemeChange = config.onSchemeChange;
    this.updateText();
  }

  private updateText(): void {
    const name = this._schemeNames[this._currentIndex]!;
    const scheme = CONTROL_SCHEMES[name];
    this._text = `< ${scheme.name} >`;
  }

  override handleEvent(event: UIInputEvent): boolean {
    if (!this._visible || !this._enabled) {
      return false;
    }

    if (event.type === 'keydown') {
      const keyEvent = event as UIKeyEvent;
      // Handle LEFT/RIGHT for scheme navigation
      if (keyEvent.key === 'ArrowLeft' || keyEvent.code === 'ArrowLeft') {
        this.prevScheme();
        event.consume();
        return true;
      }
      if (keyEvent.key === 'ArrowRight' || keyEvent.code === 'ArrowRight') {
        this.nextScheme();
        event.consume();
        return true;
      }
    }

    return super.handleEvent(event);
  }

  /**
   * Capture LEFT/RIGHT navigation when focused.
   */
  override wantsCaptureHorizontalNav(): boolean {
    return true;
  }

  /**
   * Handle LEFT/RIGHT navigation.
   */
  handleHorizontalNav(direction: 'left' | 'right'): void {
    if (direction === 'left') {
      this.prevScheme();
    } else {
      this.nextScheme();
    }
  }

  prevScheme(): void {
    this._currentIndex--;
    if (this._currentIndex < 0) {
      this._currentIndex = this._schemeNames.length - 1;
    }
    this.updateText();
    this._onSchemeChange?.(this._currentIndex);
  }

  nextScheme(): void {
    this._currentIndex++;
    if (this._currentIndex >= this._schemeNames.length) {
      this._currentIndex = 0;
    }
    this.updateText();
    this._onSchemeChange?.(this._currentIndex);
  }

  get currentIndex(): number {
    return this._currentIndex;
  }

  set currentIndex(value: number) {
    if (value >= 0 && value < this._schemeNames.length) {
      this._currentIndex = value;
      this.updateText();
    }
  }
}

/**
 * Controls menu page for selecting control schemes and viewing bindings.
 *
 * @since 0.5.0
 */
export default class ControlsPage extends MenuPage {
  /**
   * Configuration
   */
  private _config: ControlsPageConfig;

  /**
   * Content layout
   */
  private _content: VerticalLayout;

  /**
   * Available scheme names
   */
  private _schemeNames: ControlSchemeName[];

  /**
   * Scheme selector
   */
  private _schemeSelector: SchemeSelector;

  /**
   * Bindings container
   */
  private _bindingsLayout: VerticalLayout;

  /**
   * Creates a new ControlsPage.
   *
   * @param config - Configuration
   *
   * @since 0.5.0
   */
  constructor(config: ControlsPageConfig = {}) {
    super('controls', 'Ctrl');
    this._config = config;

    // Get available schemes
    this._schemeNames = listControlSchemes();

    // Find initial index
    let initialIndex = 0;
    if (config.initialScheme) {
      const idx = this._schemeNames.indexOf(config.initialScheme);
      if (idx !== -1) {
        initialIndex = idx;
      }
    }

    // Create content layout - children fill available width
    this._content = new VerticalLayout({
      spacing: 4,
      padding: 0,
      fillWidth: true,
    });

    // Scheme selector (single widget, use LEFT/RIGHT to change)
    this._schemeSelector = new SchemeSelector({
      schemeNames: this._schemeNames,
      initialIndex,
      onSchemeChange: (_index) => {
        this.updateBindingsDisplay();
        this.notifyChange();
      },
    });
    this._content.addChild(this._schemeSelector);

    // Separator
    this._content.addChild(new Separator({}));

    // Bindings display - children fill width for space-between to work
    this._bindingsLayout = new VerticalLayout({
      spacing: 1,
      padding: 0,
      fillWidth: true,
    });
    this._content.addChild(this._bindingsLayout);

    // Build initial bindings display
    this.updateBindingsDisplay();

    this.root.addChild(this._content);
  }

  /**
   * Updates the bindings display for current scheme.
   */
  private updateBindingsDisplay(): void {
    // Clear existing bindings
    this._bindingsLayout.clearChildren();

    const name = this._schemeNames[this._schemeSelector.currentIndex]!;
    const scheme = CONTROL_SCHEMES[name];

    // Show ALL key bindings
    const actions = Object.entries(scheme.actions);

    for (const [actionName, binding] of actions) {
      // Get the key bindings
      const keys = binding.keys ?? [];
      const keyDisplay =
        keys.length > 0
          ? keys
              .slice(0, 2)
              .map((k) => k.toUpperCase())
              .join('/')
          : '-';

      // Create row with space-between to put action left, key right
      const row = new HorizontalLayout({
        justify: 'space-between',
        align: 'center',
      });

      // Action name (left aligned)
      row.addChild(
        new Label({
          text: actionName,
          fontSize: 'small',
        }),
      );

      // Key binding (right side)
      row.addChild(
        new Label({
          text: keyDisplay,
          fontSize: 'small',
          muted: true,
        }),
      );

      this._bindingsLayout.addChild(row);
    }
  }

  /**
   * Notifies about scheme change.
   */
  private notifyChange(): void {
    if (this._config.onSchemeChange) {
      const name = this._schemeNames[this._schemeSelector.currentIndex]!;
      const scheme = CONTROL_SCHEMES[name];
      this._config.onSchemeChange(scheme, name);
    }
  }

  /**
   * Gets the currently selected scheme.
   */
  get currentScheme(): ControlScheme {
    const name = this._schemeNames[this._schemeSelector.currentIndex]!;
    return CONTROL_SCHEMES[name];
  }

  /**
   * Gets the currently selected scheme name.
   */
  get currentSchemeName(): ControlSchemeName {
    return this._schemeNames[this._schemeSelector.currentIndex]!;
  }

  /**
   * Sets the current scheme by name.
   */
  setScheme(name: ControlSchemeName): void {
    const idx = this._schemeNames.indexOf(name);
    if (idx !== -1) {
      this._schemeSelector.currentIndex = idx;
      this.updateBindingsDisplay();
    }
  }
}
