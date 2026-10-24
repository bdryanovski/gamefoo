import type { MapObject } from '../../../src/index';
import type { GameContext } from './context';
import { resolveDialogText } from './dialog_text';

/** A trimmed property value, treating the `"0"` sentinel and blanks as unset. */
function readProperty(object: MapObject, key: string): string | null {
  const value = object.getProperty(key)?.trim();
  return value && value !== '0' ? value : null;
}

/**
 * Reads an interactable's authored reward properties and grants them:
 *
 * - `item_id` (or legacy `item`) adds to the bag and registers its name +
 *   message (`item_name`, `message`) in the item catalog.
 * - `journal_id` discovers a journal entry named by `journal_name`, whose body
 *   is the object's `message` dialog resolved to plain lines.
 *
 * Returns whether anything was granted, so a chest can show an "empty" toast
 * when it was not.
 */
export function harvest(context: GameContext, object: MapObject): boolean {
  const itemId = readProperty(object, 'item_id') ?? readProperty(object, 'item');
  const journalId = readProperty(object, 'journal_id');
  if (!itemId && !journalId) {
    return false;
  }

  const text = resolveDialogText(context.dialogs, readProperty(object, 'message'));

  if (itemId) {
    const name = readProperty(object, 'item_name') ?? itemId;
    context.items.register({ id: itemId, name, message: text.join('\n') || undefined });
    context.inventory.add(itemId);
    context.hud?.show(`Found ${name}`, 1.6);
  }

  if (journalId) {
    const name = readProperty(object, 'journal_name') ?? journalId;
    if (context.journal.discover(journalId, name, text)) {
      context.hud?.show(`Journal entry: ${name}`, 1.8);
    }
  }

  return true;
}
