/**
 * Menu page interface and base class.
 *
 * @category UI
 * @module ui/menu/MenuPage
 * @since 0.5.0
 */

import Container from '../core/Container';
import type UIWidget from '../core/UIWidget';

/**
 * Menu page interface.
 *
 * @since 0.5.0
 */
export interface IMenuPage {
  /**
   * Page identifier
   */
  readonly id: string;
  /**
   * Page title (displayed in tab)
   */
  readonly title: string;
  /**
   * Root widget for this page
   */
  readonly root: UIWidget;
  /**
   * Called when page becomes active
   */
  onShow?(): void;
  /**
   * Called when page becomes inactive
   */
  onHide?(): void;
  /**
   * Called to refresh page data
   */
  refresh?(): void;
}

/**
 * Base class for menu pages.
 *
 * @since 0.5.0
 *
 * @example
 * ```ts
 * class MyCustomPage extends MenuPage {
 *   constructor() {
 *     super('custom', 'Custom');
 *     this.buildUI();
 *   }
 *
 *   private buildUI() {
 *     this.root.addChild(new Label({ text: 'Custom Page' }));
 *   }
 * }
 * ```
 */
export default abstract class MenuPage implements IMenuPage {
  /**
   * Page identifier
   */
  readonly id: string;

  /**
   * Page title
   */
  readonly title: string;

  /**
   * Root container for page content
   */
  readonly root: Container;

  /**
   * Creates a new MenuPage.
   *
   * @param id - Page identifier
   * @param title - Page title
   *
   * @since 0.5.0
   */
  constructor(id: string, title: string) {
    this.id = id;
    this.title = title;
    this.root = new Container({
      id: `page_${id}`,
      padding: 4,
    });
  }

  /**
   * Called when page becomes active.
   *
   * @since 0.5.0
   */
  onShow(): void {
    // Override in subclasses
  }

  /**
   * Called when page becomes inactive.
   *
   * @since 0.5.0
   */
  onHide(): void {
    // Override in subclasses
  }

  /**
   * Called to refresh page data.
   *
   * @since 0.5.0
   */
  refresh(): void {
    // Override in subclasses
  }
}
