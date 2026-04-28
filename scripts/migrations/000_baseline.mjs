/**
 * Baseline: marks all pre-2026-04-28 schema as already-applied.
 *
 * Before this migration runner existed, schema changes were either:
 *   - applied automatically by Payload's `db.push: true` (only in dev), or
 *   - patched manually via one-off scripts in `scripts/` (e.g. migrate-bill-fixes.mjs,
 *     migrate-cardgrid-image.mjs).
 *
 * This baseline is intentionally a no-op: just records that the runner has been
 * initialized so subsequent migrations can layer on top. It does NOT attempt to
 * re-create existing tables/columns — those are already present in production.
 */
export async function up({ log }) {
  log('Baseline marker — no schema changes applied. Future migrations will layer on top.')
}
