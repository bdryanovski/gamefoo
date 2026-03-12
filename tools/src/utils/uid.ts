let counter = 0;

export function uid(prefix = "id"): string {
  return `${prefix}_${Date.now().toString(36)}_${(counter++).toString(36)}`;
}
