import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`users_sessions\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`created_at\` text,
  	\`expires_at\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`users_sessions_order_idx\` ON \`users_sessions\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`users_sessions_parent_id_idx\` ON \`users_sessions\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`users\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`email\` text NOT NULL,
  	\`reset_password_token\` text,
  	\`reset_password_expiration\` text,
  	\`salt\` text,
  	\`hash\` text,
  	\`login_attempts\` numeric DEFAULT 0,
  	\`lock_until\` text
  );
  `)
  await db.run(sql`CREATE INDEX \`users_updated_at_idx\` ON \`users\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`users_created_at_idx\` ON \`users\` (\`created_at\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`users_email_idx\` ON \`users\` (\`email\`);`)
  await db.run(sql`CREATE TABLE \`media\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`alt\` text NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`url\` text,
  	\`thumbnail_u_r_l\` text,
  	\`filename\` text,
  	\`mime_type\` text,
  	\`filesize\` numeric,
  	\`width\` numeric,
  	\`height\` numeric,
  	\`focal_x\` numeric,
  	\`focal_y\` numeric
  );
  `)
  await db.run(sql`CREATE INDEX \`media_updated_at_idx\` ON \`media\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`media_created_at_idx\` ON \`media\` (\`created_at\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`media_filename_idx\` ON \`media\` (\`filename\`);`)
  await db.run(sql`CREATE TABLE \`news_blocks_lead\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`kicker\` text DEFAULT 'Tin tức GoBeyond',
  	\`heading\` text,
  	\`body\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`news\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`news_blocks_lead_order_idx\` ON \`news_blocks_lead\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`news_blocks_lead_parent_id_idx\` ON \`news_blocks_lead\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`news_blocks_lead_path_idx\` ON \`news_blocks_lead\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`news_blocks_body_copy\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`content\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`news\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`news_blocks_body_copy_order_idx\` ON \`news_blocks_body_copy\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`news_blocks_body_copy_parent_id_idx\` ON \`news_blocks_body_copy\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`news_blocks_body_copy_path_idx\` ON \`news_blocks_body_copy\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`news_blocks_feature_image\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`image_id\` integer,
  	\`caption\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`news\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`news_blocks_feature_image_order_idx\` ON \`news_blocks_feature_image\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`news_blocks_feature_image_parent_id_idx\` ON \`news_blocks_feature_image\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`news_blocks_feature_image_path_idx\` ON \`news_blocks_feature_image\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`news_blocks_feature_image_image_idx\` ON \`news_blocks_feature_image\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`news_blocks_pull_quote\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`quote\` text,
  	\`attribution\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`news\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`news_blocks_pull_quote_order_idx\` ON \`news_blocks_pull_quote\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`news_blocks_pull_quote_parent_id_idx\` ON \`news_blocks_pull_quote\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`news_blocks_pull_quote_path_idx\` ON \`news_blocks_pull_quote\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`news_blocks_stats_grid_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`value\` text,
  	\`label\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`news_blocks_stats_grid\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`news_blocks_stats_grid_items_order_idx\` ON \`news_blocks_stats_grid_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`news_blocks_stats_grid_items_parent_id_idx\` ON \`news_blocks_stats_grid_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`news_blocks_stats_grid\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`news\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`news_blocks_stats_grid_order_idx\` ON \`news_blocks_stats_grid\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`news_blocks_stats_grid_parent_id_idx\` ON \`news_blocks_stats_grid\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`news_blocks_stats_grid_path_idx\` ON \`news_blocks_stats_grid\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`news_blocks_checklist_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`text\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`news_blocks_checklist\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`news_blocks_checklist_items_order_idx\` ON \`news_blocks_checklist_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`news_blocks_checklist_items_parent_id_idx\` ON \`news_blocks_checklist_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`news_blocks_checklist\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`heading\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`news\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`news_blocks_checklist_order_idx\` ON \`news_blocks_checklist\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`news_blocks_checklist_parent_id_idx\` ON \`news_blocks_checklist\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`news_blocks_checklist_path_idx\` ON \`news_blocks_checklist\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`news_blocks_cta\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`heading\` text,
  	\`body\` text,
  	\`label\` text DEFAULT 'Liên hệ GoBeyond',
  	\`href\` text DEFAULT '/#contact',
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`news\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`news_blocks_cta_order_idx\` ON \`news_blocks_cta\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`news_blocks_cta_parent_id_idx\` ON \`news_blocks_cta\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`news_blocks_cta_path_idx\` ON \`news_blocks_cta\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`news_blocks_reusable_cta\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`cta_id\` integer,
  	\`block_name\` text,
  	FOREIGN KEY (\`cta_id\`) REFERENCES \`reusable_ctas\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`news\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`news_blocks_reusable_cta_order_idx\` ON \`news_blocks_reusable_cta\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`news_blocks_reusable_cta_parent_id_idx\` ON \`news_blocks_reusable_cta\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`news_blocks_reusable_cta_path_idx\` ON \`news_blocks_reusable_cta\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`news_blocks_reusable_cta_cta_idx\` ON \`news_blocks_reusable_cta\` (\`cta_id\`);`)
  await db.run(sql`CREATE TABLE \`news\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`slug\` text,
  	\`status\` text DEFAULT 'draft',
  	\`tag\` text DEFAULT 'news',
  	\`template\` text DEFAULT 'standard',
  	\`published_at\` text,
  	\`excerpt\` text,
  	\`hero_image_id\` integer,
  	\`notes\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`_status\` text DEFAULT 'draft',
  	FOREIGN KEY (\`hero_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`news_slug_idx\` ON \`news\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`news_hero_image_idx\` ON \`news\` (\`hero_image_id\`);`)
  await db.run(sql`CREATE INDEX \`news_updated_at_idx\` ON \`news\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`news_created_at_idx\` ON \`news\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`news__status_idx\` ON \`news\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`_news_v_blocks_lead\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`kicker\` text DEFAULT 'Tin tức GoBeyond',
  	\`heading\` text,
  	\`body\` text,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_news_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_news_v_blocks_lead_order_idx\` ON \`_news_v_blocks_lead\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_news_v_blocks_lead_parent_id_idx\` ON \`_news_v_blocks_lead\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_news_v_blocks_lead_path_idx\` ON \`_news_v_blocks_lead\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_news_v_blocks_body_copy\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`content\` text,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_news_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_news_v_blocks_body_copy_order_idx\` ON \`_news_v_blocks_body_copy\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_news_v_blocks_body_copy_parent_id_idx\` ON \`_news_v_blocks_body_copy\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_news_v_blocks_body_copy_path_idx\` ON \`_news_v_blocks_body_copy\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_news_v_blocks_feature_image\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`image_id\` integer,
  	\`caption\` text,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_news_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_news_v_blocks_feature_image_order_idx\` ON \`_news_v_blocks_feature_image\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_news_v_blocks_feature_image_parent_id_idx\` ON \`_news_v_blocks_feature_image\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_news_v_blocks_feature_image_path_idx\` ON \`_news_v_blocks_feature_image\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`_news_v_blocks_feature_image_image_idx\` ON \`_news_v_blocks_feature_image\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`_news_v_blocks_pull_quote\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`quote\` text,
  	\`attribution\` text,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_news_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_news_v_blocks_pull_quote_order_idx\` ON \`_news_v_blocks_pull_quote\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_news_v_blocks_pull_quote_parent_id_idx\` ON \`_news_v_blocks_pull_quote\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_news_v_blocks_pull_quote_path_idx\` ON \`_news_v_blocks_pull_quote\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_news_v_blocks_stats_grid_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`value\` text,
  	\`label\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_news_v_blocks_stats_grid\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_news_v_blocks_stats_grid_items_order_idx\` ON \`_news_v_blocks_stats_grid_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_news_v_blocks_stats_grid_items_parent_id_idx\` ON \`_news_v_blocks_stats_grid_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_news_v_blocks_stats_grid\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_news_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_news_v_blocks_stats_grid_order_idx\` ON \`_news_v_blocks_stats_grid\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_news_v_blocks_stats_grid_parent_id_idx\` ON \`_news_v_blocks_stats_grid\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_news_v_blocks_stats_grid_path_idx\` ON \`_news_v_blocks_stats_grid\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_news_v_blocks_checklist_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`text\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_news_v_blocks_checklist\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_news_v_blocks_checklist_items_order_idx\` ON \`_news_v_blocks_checklist_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_news_v_blocks_checklist_items_parent_id_idx\` ON \`_news_v_blocks_checklist_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_news_v_blocks_checklist\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`heading\` text,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_news_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_news_v_blocks_checklist_order_idx\` ON \`_news_v_blocks_checklist\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_news_v_blocks_checklist_parent_id_idx\` ON \`_news_v_blocks_checklist\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_news_v_blocks_checklist_path_idx\` ON \`_news_v_blocks_checklist\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_news_v_blocks_cta\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`heading\` text,
  	\`body\` text,
  	\`label\` text DEFAULT 'Liên hệ GoBeyond',
  	\`href\` text DEFAULT '/#contact',
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_news_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_news_v_blocks_cta_order_idx\` ON \`_news_v_blocks_cta\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_news_v_blocks_cta_parent_id_idx\` ON \`_news_v_blocks_cta\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_news_v_blocks_cta_path_idx\` ON \`_news_v_blocks_cta\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_news_v_blocks_reusable_cta\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`cta_id\` integer,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`cta_id\`) REFERENCES \`reusable_ctas\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_news_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_news_v_blocks_reusable_cta_order_idx\` ON \`_news_v_blocks_reusable_cta\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_news_v_blocks_reusable_cta_parent_id_idx\` ON \`_news_v_blocks_reusable_cta\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_news_v_blocks_reusable_cta_path_idx\` ON \`_news_v_blocks_reusable_cta\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`_news_v_blocks_reusable_cta_cta_idx\` ON \`_news_v_blocks_reusable_cta\` (\`cta_id\`);`)
  await db.run(sql`CREATE TABLE \`_news_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`parent_id\` integer,
  	\`version_title\` text,
  	\`version_slug\` text,
  	\`version_status\` text DEFAULT 'draft',
  	\`version_tag\` text DEFAULT 'news',
  	\`version_template\` text DEFAULT 'standard',
  	\`version_published_at\` text,
  	\`version_excerpt\` text,
  	\`version_hero_image_id\` integer,
  	\`version_notes\` text,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`snapshot\` integer,
  	\`published_locale\` text,
  	\`latest\` integer,
  	\`autosave\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`news\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_hero_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_news_v_parent_idx\` ON \`_news_v\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_news_v_version_version_slug_idx\` ON \`_news_v\` (\`version_slug\`);`)
  await db.run(sql`CREATE INDEX \`_news_v_version_version_hero_image_idx\` ON \`_news_v\` (\`version_hero_image_id\`);`)
  await db.run(sql`CREATE INDEX \`_news_v_version_version_updated_at_idx\` ON \`_news_v\` (\`version_updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_news_v_version_version_created_at_idx\` ON \`_news_v\` (\`version_created_at\`);`)
  await db.run(sql`CREATE INDEX \`_news_v_version_version__status_idx\` ON \`_news_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_news_v_created_at_idx\` ON \`_news_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_news_v_updated_at_idx\` ON \`_news_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_news_v_snapshot_idx\` ON \`_news_v\` (\`snapshot\`);`)
  await db.run(sql`CREATE INDEX \`_news_v_published_locale_idx\` ON \`_news_v\` (\`published_locale\`);`)
  await db.run(sql`CREATE INDEX \`_news_v_latest_idx\` ON \`_news_v\` (\`latest\`);`)
  await db.run(sql`CREATE INDEX \`_news_v_autosave_idx\` ON \`_news_v\` (\`autosave\`);`)
  await db.run(sql`CREATE TABLE \`careers_responsibilities\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`text\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`careers\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`careers_responsibilities_order_idx\` ON \`careers_responsibilities\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`careers_responsibilities_parent_id_idx\` ON \`careers_responsibilities\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`careers_requirements\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`text\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`careers\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`careers_requirements_order_idx\` ON \`careers_requirements\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`careers_requirements_parent_id_idx\` ON \`careers_requirements\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`careers_benefits\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`text\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`careers\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`careers_benefits_order_idx\` ON \`careers_benefits\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`careers_benefits_parent_id_idx\` ON \`careers_benefits\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`careers\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`slug\` text,
  	\`status\` text DEFAULT 'draft',
  	\`tag\` text DEFAULT 'hiring',
  	\`published_at\` text,
  	\`date_label\` text DEFAULT '2026',
  	\`department\` text DEFAULT 'Thương mại điện tử',
  	\`employment_type\` text DEFAULT 'Toàn thời gian',
  	\`location\` text DEFAULT 'St Moritz, 1014 Đường Phạm Văn Đồng, TP. Hồ Chí Minh',
  	\`quantity\` text DEFAULT '01',
  	\`excerpt\` text,
  	\`lark_url\` text,
  	\`apply_url\` text DEFAULT 'mailto:tuyendung@gobe.asia',
  	\`description\` text,
  	\`working_time\` text DEFAULT '8:00-17:30, tu thu 2 den thu 6, thu 7 remote. Nghi trua: 12:00-13:30.',
  	\`notes\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`_status\` text DEFAULT 'draft'
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`careers_slug_idx\` ON \`careers\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`careers_updated_at_idx\` ON \`careers\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`careers_created_at_idx\` ON \`careers\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`careers__status_idx\` ON \`careers\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`_careers_v_version_responsibilities\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`text\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_careers_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_careers_v_version_responsibilities_order_idx\` ON \`_careers_v_version_responsibilities\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_careers_v_version_responsibilities_parent_id_idx\` ON \`_careers_v_version_responsibilities\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_careers_v_version_requirements\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`text\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_careers_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_careers_v_version_requirements_order_idx\` ON \`_careers_v_version_requirements\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_careers_v_version_requirements_parent_id_idx\` ON \`_careers_v_version_requirements\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_careers_v_version_benefits\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`text\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_careers_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_careers_v_version_benefits_order_idx\` ON \`_careers_v_version_benefits\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_careers_v_version_benefits_parent_id_idx\` ON \`_careers_v_version_benefits\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_careers_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`parent_id\` integer,
  	\`version_title\` text,
  	\`version_slug\` text,
  	\`version_status\` text DEFAULT 'draft',
  	\`version_tag\` text DEFAULT 'hiring',
  	\`version_published_at\` text,
  	\`version_date_label\` text DEFAULT '2026',
  	\`version_department\` text DEFAULT 'Thương mại điện tử',
  	\`version_employment_type\` text DEFAULT 'Toàn thời gian',
  	\`version_location\` text DEFAULT 'St Moritz, 1014 Đường Phạm Văn Đồng, TP. Hồ Chí Minh',
  	\`version_quantity\` text DEFAULT '01',
  	\`version_excerpt\` text,
  	\`version_lark_url\` text,
  	\`version_apply_url\` text DEFAULT 'mailto:tuyendung@gobe.asia',
  	\`version_description\` text,
  	\`version_working_time\` text DEFAULT '8:00-17:30, tu thu 2 den thu 6, thu 7 remote. Nghi trua: 12:00-13:30.',
  	\`version_notes\` text,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`snapshot\` integer,
  	\`published_locale\` text,
  	\`latest\` integer,
  	\`autosave\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`careers\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_careers_v_parent_idx\` ON \`_careers_v\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_careers_v_version_version_slug_idx\` ON \`_careers_v\` (\`version_slug\`);`)
  await db.run(sql`CREATE INDEX \`_careers_v_version_version_updated_at_idx\` ON \`_careers_v\` (\`version_updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_careers_v_version_version_created_at_idx\` ON \`_careers_v\` (\`version_created_at\`);`)
  await db.run(sql`CREATE INDEX \`_careers_v_version_version__status_idx\` ON \`_careers_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_careers_v_created_at_idx\` ON \`_careers_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_careers_v_updated_at_idx\` ON \`_careers_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_careers_v_snapshot_idx\` ON \`_careers_v\` (\`snapshot\`);`)
  await db.run(sql`CREATE INDEX \`_careers_v_published_locale_idx\` ON \`_careers_v\` (\`published_locale\`);`)
  await db.run(sql`CREATE INDEX \`_careers_v_latest_idx\` ON \`_careers_v\` (\`latest\`);`)
  await db.run(sql`CREATE INDEX \`_careers_v_autosave_idx\` ON \`_careers_v\` (\`autosave\`);`)
  await db.run(sql`CREATE TABLE \`reusable_ctas\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`heading\` text NOT NULL,
  	\`body\` text,
  	\`label\` text DEFAULT 'Liên hệ GoBeyond' NOT NULL,
  	\`href\` text DEFAULT '/#contact' NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`reusable_ctas_updated_at_idx\` ON \`reusable_ctas\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`reusable_ctas_created_at_idx\` ON \`reusable_ctas\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`payload_kv\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`key\` text NOT NULL,
  	\`data\` text NOT NULL
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`payload_kv_key_idx\` ON \`payload_kv\` (\`key\`);`)
  await db.run(sql`CREATE TABLE \`payload_locked_documents\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`global_slug\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_global_slug_idx\` ON \`payload_locked_documents\` (\`global_slug\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_updated_at_idx\` ON \`payload_locked_documents\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_created_at_idx\` ON \`payload_locked_documents\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`payload_locked_documents_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`users_id\` integer,
  	\`media_id\` integer,
  	\`news_id\` integer,
  	\`careers_id\` integer,
  	\`reusable_ctas_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_locked_documents\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`news_id\`) REFERENCES \`news\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`careers_id\`) REFERENCES \`careers\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`reusable_ctas_id\`) REFERENCES \`reusable_ctas\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_order_idx\` ON \`payload_locked_documents_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_parent_idx\` ON \`payload_locked_documents_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_path_idx\` ON \`payload_locked_documents_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_users_id_idx\` ON \`payload_locked_documents_rels\` (\`users_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_media_id_idx\` ON \`payload_locked_documents_rels\` (\`media_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_news_id_idx\` ON \`payload_locked_documents_rels\` (\`news_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_careers_id_idx\` ON \`payload_locked_documents_rels\` (\`careers_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_reusable_ctas_id_idx\` ON \`payload_locked_documents_rels\` (\`reusable_ctas_id\`);`)
  await db.run(sql`CREATE TABLE \`payload_preferences\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`key\` text,
  	\`value\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_preferences_key_idx\` ON \`payload_preferences\` (\`key\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_updated_at_idx\` ON \`payload_preferences\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_created_at_idx\` ON \`payload_preferences\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`payload_preferences_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`users_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_preferences\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_preferences_rels_order_idx\` ON \`payload_preferences_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_rels_parent_idx\` ON \`payload_preferences_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_rels_path_idx\` ON \`payload_preferences_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_rels_users_id_idx\` ON \`payload_preferences_rels\` (\`users_id\`);`)
  await db.run(sql`CREATE TABLE \`payload_migrations\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text,
  	\`batch\` numeric,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_migrations_updated_at_idx\` ON \`payload_migrations\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`payload_migrations_created_at_idx\` ON \`payload_migrations\` (\`created_at\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`users_sessions\`;`)
  await db.run(sql`DROP TABLE \`users\`;`)
  await db.run(sql`DROP TABLE \`media\`;`)
  await db.run(sql`DROP TABLE \`news_blocks_lead\`;`)
  await db.run(sql`DROP TABLE \`news_blocks_body_copy\`;`)
  await db.run(sql`DROP TABLE \`news_blocks_feature_image\`;`)
  await db.run(sql`DROP TABLE \`news_blocks_pull_quote\`;`)
  await db.run(sql`DROP TABLE \`news_blocks_stats_grid_items\`;`)
  await db.run(sql`DROP TABLE \`news_blocks_stats_grid\`;`)
  await db.run(sql`DROP TABLE \`news_blocks_checklist_items\`;`)
  await db.run(sql`DROP TABLE \`news_blocks_checklist\`;`)
  await db.run(sql`DROP TABLE \`news_blocks_cta\`;`)
  await db.run(sql`DROP TABLE \`news_blocks_reusable_cta\`;`)
  await db.run(sql`DROP TABLE \`news\`;`)
  await db.run(sql`DROP TABLE \`_news_v_blocks_lead\`;`)
  await db.run(sql`DROP TABLE \`_news_v_blocks_body_copy\`;`)
  await db.run(sql`DROP TABLE \`_news_v_blocks_feature_image\`;`)
  await db.run(sql`DROP TABLE \`_news_v_blocks_pull_quote\`;`)
  await db.run(sql`DROP TABLE \`_news_v_blocks_stats_grid_items\`;`)
  await db.run(sql`DROP TABLE \`_news_v_blocks_stats_grid\`;`)
  await db.run(sql`DROP TABLE \`_news_v_blocks_checklist_items\`;`)
  await db.run(sql`DROP TABLE \`_news_v_blocks_checklist\`;`)
  await db.run(sql`DROP TABLE \`_news_v_blocks_cta\`;`)
  await db.run(sql`DROP TABLE \`_news_v_blocks_reusable_cta\`;`)
  await db.run(sql`DROP TABLE \`_news_v\`;`)
  await db.run(sql`DROP TABLE \`careers_responsibilities\`;`)
  await db.run(sql`DROP TABLE \`careers_requirements\`;`)
  await db.run(sql`DROP TABLE \`careers_benefits\`;`)
  await db.run(sql`DROP TABLE \`careers\`;`)
  await db.run(sql`DROP TABLE \`_careers_v_version_responsibilities\`;`)
  await db.run(sql`DROP TABLE \`_careers_v_version_requirements\`;`)
  await db.run(sql`DROP TABLE \`_careers_v_version_benefits\`;`)
  await db.run(sql`DROP TABLE \`_careers_v\`;`)
  await db.run(sql`DROP TABLE \`reusable_ctas\`;`)
  await db.run(sql`DROP TABLE \`payload_kv\`;`)
  await db.run(sql`DROP TABLE \`payload_locked_documents\`;`)
  await db.run(sql`DROP TABLE \`payload_locked_documents_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_preferences\`;`)
  await db.run(sql`DROP TABLE \`payload_preferences_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_migrations\`;`)
}
