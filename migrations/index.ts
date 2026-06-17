import * as migration_20260606_142749_initial from './20260606_142749_initial';
import * as migration_20260612_045700_news_content_rich_text from './20260612_045700_news_content_rich_text';

export const migrations = [
  {
    up: migration_20260606_142749_initial.up,
    down: migration_20260606_142749_initial.down,
    name: '20260606_142749_initial'
  },
  {
    up: migration_20260612_045700_news_content_rich_text.up,
    down: migration_20260612_045700_news_content_rich_text.down,
    name: '20260612_045700_news_content_rich_text'
  },
];
