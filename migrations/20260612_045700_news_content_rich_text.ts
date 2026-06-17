import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`news\` ADD \`content\` text;`);
  await db.run(sql`ALTER TABLE \`_news_v\` ADD \`version_content\` text;`);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`_news_v\` DROP COLUMN \`version_content\`;`);
  await db.run(sql`ALTER TABLE \`news\` DROP COLUMN \`content\`;`);
}
