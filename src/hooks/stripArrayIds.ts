import type { GlobalBeforeChangeHook } from "payload";

/**
 * Workaround for Payload v3.82.x Postgres adapter bug:
 *
 * When updating a global that contains array fields, Payload sends the
 * existing array-item IDs back in the payload (that's what the admin UI
 * does on every save). The Drizzle/Postgres adapter then attempts to
 * INSERT those rows on top of the already-existing rows with the same
 * (_parent_id, id) tuple, hitting the unique-index constraint and
 * returning a 400 with "Value must be unique" / "_parent_id, id".
 *
 * Saves WITHOUT IDs work because Payload generates fresh IDs that can
 * never collide. So we recursively strip every `id` field from incoming
 * array items before the write reaches the adapter. Payload then mints
 * fresh IDs server-side and the INSERT succeeds.
 *
 * Side effect: array-item IDs change on every save. That's fine for
 * Navigation/Footer/SiteSettings — nothing in the codebase or DB
 * references those IDs as foreign keys.
 *
 * Remove this hook once we upgrade Payload past the version that fixes
 * the underlying delete-then-insert bug for global arrays.
 */
function stripIdsRecursive(value: unknown): void {
  if (!value || typeof value !== "object") return;
  if (Array.isArray(value)) {
    for (const item of value) stripIdsRecursive(item);
    return;
  }
  const obj = value as Record<string, unknown>;
  if ("id" in obj) delete obj.id;
  for (const key of Object.keys(obj)) {
    const v = obj[key];
    if (v && typeof v === "object") stripIdsRecursive(v);
  }
}

export const stripArrayIdsBeforeChange: GlobalBeforeChangeHook = ({
  data,
}) => {
  if (data && typeof data === "object") {
    for (const key of Object.keys(data)) {
      stripIdsRecursive((data as Record<string, unknown>)[key]);
    }
  }
  return data;
};
