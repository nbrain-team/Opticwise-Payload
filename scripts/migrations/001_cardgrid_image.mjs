/**
 * Adds the `image_id` column (with FK + index) to the CardGrid cards
 * tables — both the live `pages_blocks_card_grid_cards` and the versions
 * `_pages_v_blocks_card_grid_cards`.
 *
 * Matches the field added to `src/blocks/v4/CardGrid.ts` to support optional
 * award logos on the About page card grid.
 *
 * Idempotent: each step uses an existence check so re-runs are safe.
 *
 * NOTE: This migration was originally applied manually on 2026-04-28 via
 * scripts/migrate-cardgrid-image.mjs to recover from a production outage.
 * It is registered here so the migration runner is aware of it going forward
 * (the operations are no-ops on a DB where they've already been applied).
 */

async function colExists(client, table, col) {
  const r = await client.query(
    `SELECT 1 FROM information_schema.columns WHERE table_name=$1 AND column_name=$2`,
    [table, col],
  )
  return r.rowCount > 0
}
async function constraintExists(client, name) {
  const r = await client.query(
    `SELECT 1 FROM information_schema.table_constraints WHERE constraint_name=$1`,
    [name],
  )
  return r.rowCount > 0
}
async function indexExists(client, name) {
  const r = await client.query(`SELECT 1 FROM pg_indexes WHERE indexname=$1`, [name])
  return r.rowCount > 0
}

async function ensureImageColumn(client, log, table, fkName, idxName) {
  if (!(await colExists(client, table, 'image_id'))) {
    log(`+ ${table}.image_id`)
    await client.query(`ALTER TABLE "${table}" ADD COLUMN "image_id" integer`)
  } else {
    log(`✓ ${table}.image_id already exists`)
  }
  if (!(await constraintExists(client, fkName))) {
    log(`+ FK ${fkName} → media(id)`)
    await client.query(
      `ALTER TABLE "${table}" ADD CONSTRAINT "${fkName}"
         FOREIGN KEY ("image_id") REFERENCES "media"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    )
  } else {
    log(`✓ FK ${fkName} already exists`)
  }
  if (!(await indexExists(client, idxName))) {
    log(`+ index ${idxName}`)
    await client.query(`CREATE INDEX "${idxName}" ON "${table}" ("image_id")`)
  } else {
    log(`✓ index ${idxName} already exists`)
  }
}

export async function up({ client, log }) {
  log('live table: pages_blocks_card_grid_cards')
  await ensureImageColumn(
    client,
    log,
    'pages_blocks_card_grid_cards',
    'pages_blocks_card_grid_cards_image_id_media_id_fk',
    'pages_blocks_card_grid_cards_image_idx',
  )

  log('versions table: _pages_v_blocks_card_grid_cards')
  await ensureImageColumn(
    client,
    log,
    '_pages_v_blocks_card_grid_cards',
    '_pages_v_blocks_card_grid_cards_image_id_media_id_fk',
    '_pages_v_blocks_card_grid_cards_image_idx',
  )
}
