import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`news\` ADD \`team\` text;`);
  await db.run(sql`ALTER TABLE \`news\` ADD \`display_order\` numeric;`);
  await db.run(sql`ALTER TABLE \`_news_v\` ADD \`version_team\` text;`);
  await db.run(sql`ALTER TABLE \`_news_v\` ADD \`version_display_order\` numeric;`);

  await db.run(sql`ALTER TABLE \`careers\` ADD \`team\` text;`);
  await db.run(sql`ALTER TABLE \`careers\` ADD \`display_order\` numeric;`);
  await db.run(sql`ALTER TABLE \`_careers_v\` ADD \`version_team\` text;`);
  await db.run(sql`ALTER TABLE \`_careers_v\` ADD \`version_display_order\` numeric;`);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`_careers_v\` DROP COLUMN \`version_display_order\`;`);
  await db.run(sql`ALTER TABLE \`_careers_v\` DROP COLUMN \`version_team\`;`);
  await db.run(sql`ALTER TABLE \`careers\` DROP COLUMN \`display_order\`;`);
  await db.run(sql`ALTER TABLE \`careers\` DROP COLUMN \`team\`;`);

  await db.run(sql`ALTER TABLE \`_news_v\` DROP COLUMN \`version_display_order\`;`);
  await db.run(sql`ALTER TABLE \`_news_v\` DROP COLUMN \`version_team\`;`);
  await db.run(sql`ALTER TABLE \`news\` DROP COLUMN \`display_order\`;`);
  await db.run(sql`ALTER TABLE \`news\` DROP COLUMN \`team\`;`);
}
