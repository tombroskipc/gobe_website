import * as migration_20260606_142749_initial from './20260606_142749_initial';

export const migrations = [
  {
    up: migration_20260606_142749_initial.up,
    down: migration_20260606_142749_initial.down,
    name: '20260606_142749_initial'
  },
];
