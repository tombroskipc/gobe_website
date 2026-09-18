import * as migration_20260606_142749_initial from './20260606_142749_initial';
import * as migration_20260612_045700_news_content_rich_text from './20260612_045700_news_content_rich_text';
import * as migration_20260716_172600_content_sort_controls from './20260716_172600_content_sort_controls';

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
  {
    up: migration_20260716_172600_content_sort_controls.up,
    down: migration_20260716_172600_content_sort_controls.down,
    name: '20260716_172600_content_sort_controls'
  },
];
