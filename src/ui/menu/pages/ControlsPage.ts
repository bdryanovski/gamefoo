/**
 * Controls menu page for control scheme selection and display.
 *
 * @category UI
 * @module ui/menu/pages/ControlsPage
 * @since 0.5.0
 */

import {
  CONTROL_SCHEMES,
  type ControlSchemeName,
  listControlSchemes,
} from '@/core/controls';
import type { ControlScheme } from '@/core/controls/types';
import Button from '../../controls/Button';
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
  /** Initial control scheme name */
  initialScheme?: ControlSchemeName;
  /** Scheme change callback */
  onSchemeChange?: (scheme: ControlScheme, name: ControlSchemeName) => void;
}

/**
 * Controls menu page for selecting control schemes and viewing bindings.
 *
 * @since 0.5.0
 */
export default class ControlsPage extends MenuPage {
  /** Configuration */
  private _config: ControlsPageConfig;

  /** Content layout */
  private _content: VerticalLayout;

  /** Available scheme names */
  private _schemeNames: ControlSchemeName[];

  /** Current scheme index */
  private _currentIndex: number = 0;

  /** Scheme name label */
  private _schemeLabel: Label;

  /** Bindings container */
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
    if (config.initialScheme) {
      const idx = this._schemeNames.indexOf(config.initialScheme);
      if (idx >= 0) this._currentIndex = idx;
    }

    // Create content layout - children fill available width
    this._content = new VerticalLayout({
      spacing: 2,
      padding: 0,
      fillWidth: true,
    });

    // Scheme selector row - centered
    const selectorRow = new HorizontalLayout({
      spacing: 4,
      align: 'center',
      justify: 'center',
    });

    const prevButton = new Button({
      text: '<',
      width: 18,
      height: 14,
      onClick: () => this.prevScheme(),
    });
    selectorRow.addChild(prevButton);

    this._schemeLabel = new Label({
      text: this.getCurrentSchemeName(),
      fontSize: 'default',
    });
    selectorRow.addChild(this._schemeLabel);

    const nextButton = new Button({
      text: '>',
      width: 18,
      height: 14,
      onClick: () => this.nextScheme(),
    });
    selectorRow.addChild(nextButton);

    this._content.addChild(selectorRow);
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
   * Gets current scheme display name.
   */
  private getCurrentSchemeName(): string {
    const name = this._schemeNames[this._currentIndex]!;
    const scheme = CONTROL_SCHEMES[name];
    return scheme.name;
  }

  /**
   * Switches to previous scheme.
   */
  prevScheme(): void {
    this._currentIndex--;
    if (this._currentIndex < 0) {
      this._currentIndex = this._schemeNames.length - 1;
    }
    this.updateDisplay();
    this.notifyChange();
  }

  /**
   * Switches to next scheme.
   */
  nextScheme(): void {
    this._currentIndex++;
    if (this._currentIndex >= this._schemeNames.length) {
      this._currentIndex = 0;
    }
    this.updateDisplay();
    this.notifyChange();
  }

  /**
   * Updates all display elements.
   */
  private updateDisplay(): void {
    this._schemeLabel.text = this.getCurrentSchemeName();
    this.updateBindingsDisplay();
  }

  /**
   * Updates the bindings display for current scheme.
   */
  private updateBindingsDisplay(): void {
    // Clear existing bindings
    this._bindingsLayout.clearChildren();

    const name = this._schemeNames[this._currentIndex]!;
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
      const name = this._schemeNames[this._currentIndex]!;
      const scheme = CONTROL_SCHEMES[name];
      this._config.onSchemeChange(scheme, name);
    }
  }

  /**
   * Gets the currently selected scheme.
   */
  get currentScheme(): ControlScheme {
    const name = this._schemeNames[this._currentIndex]!;
    return CONTROL_SCHEMES[name];
  }

  /**
   * Gets the currently selected scheme name.
   */
  get currentSchemeName(): ControlSchemeName {
    return this._schemeNames[this._currentIndex]!;
  }

  /**
   * Sets the current scheme by name.
   */
  setScheme(name: ControlSchemeName): void {
    const idx = this._schemeNames.indexOf(name);
    if (idx >= 0) {
      this._currentIndex = idx;
      this.updateDisplay();
    }
  }
}
