/**
 * Quit confirmation menu page.
 *
 * @category UI
 * @module ui/menu/pages/QuitPage
 * @since 0.5.0
 */

import Button from '../../controls/Button';
import Label from '../../display/Label';
import HorizontalLayout from '../../layouts/HorizontalLayout';
import VerticalLayout from '../../layouts/VerticalLayout';
import MenuPage from '../MenuPage';

/**
 * Quit page configuration.
 *
 * @since 0.5.0
 */
export interface QuitPageConfig {
  /** Confirmation message */
  message?: string;
  /** Quit callback */
  onQuit?: () => void;
  /** Cancel callback (returns to game) */
  onCancel?: () => void;
}

/**
 * Quit confirmation page.
 *
 * @since 0.5.0
 */
export default class QuitPage extends MenuPage {
  /** Configuration */
  private _config: QuitPageConfig;

  /**
   * Creates a new QuitPage.
   *
   * @param config - Configuration
   *
   * @since 0.5.0
   */
  constructor(config: QuitPageConfig = {}) {
    super('quit', 'Quit');
    this._config = config;

    const layout = new VerticalLayout({
      spacing: 12,
      padding: 0,
      align: 'center',
      justify: 'center',
    });

    // Message
    const message = config.message ?? 'Are you sure you want to quit?';
    layout.addChild(
      new Label({
        text: message,
        align: 'center',
      }),
    );

    // Buttons
    const buttonRow = new HorizontalLayout({
      spacing: 16,
      align: 'center',
    });

    const yesButton = new Button({
      text: 'Yes, Quit',
      width: 80,
      onClick: () => config.onQuit?.(),
    });
    buttonRow.addChild(yesButton);

    const noButton = new Button({
      text: 'No, Stay',
      width: 80,
      onClick: () => config.onCancel?.(),
    });
    buttonRow.addChild(noButton);

    layout.addChild(buttonRow);

    // Additional hint
    layout.addChild(
      new Label({
        text: 'Press ESC to return to game',
        muted: true,
        fontSize: 'small',
        align: 'center',
      }),
    );

    this.root.addChild(layout);
  }
}
