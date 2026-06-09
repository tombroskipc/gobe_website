UPDATE _careers_v
SET latest = 0
WHERE latest = 1;

DELETE FROM _careers_v_version_responsibilities
WHERE _parent_id IN (
  SELECT id FROM _careers_v WHERE parent_id IN (SELECT id FROM careers)
);

DELETE FROM _careers_v_version_requirements
WHERE _parent_id IN (
  SELECT id FROM _careers_v WHERE parent_id IN (SELECT id FROM careers)
);

DELETE FROM _careers_v_version_benefits
WHERE _parent_id IN (
  SELECT id FROM _careers_v WHERE parent_id IN (SELECT id FROM careers)
);

DELETE FROM _careers_v
WHERE parent_id IN (SELECT id FROM careers);

INSERT INTO _careers_v (
  parent_id,
  version_title,
  version_slug,
  version_status,
  version_tag,
  version_published_at,
  version_date_label,
  version_department,
  version_employment_type,
  version_location,
  version_quantity,
  version_excerpt,
  version_lark_url,
  version_apply_url,
  version_description,
  version_working_time,
  version_notes,
  version_updated_at,
  version_created_at,
  version__status,
  created_at,
  updated_at,
  latest,
  autosave
)
SELECT
  id,
  title,
  slug,
  status,
  tag,
  published_at,
  date_label,
  department,
  employment_type,
  location,
  quantity,
  excerpt,
  lark_url,
  apply_url,
  description,
  working_time,
  notes,
  updated_at,
  created_at,
  _status,
  created_at,
  updated_at,
  1,
  0
FROM careers
WHERE _status = 'published';

INSERT INTO _careers_v_version_responsibilities (_order, _parent_id, text, _uuid)
SELECT item._order, version.id, item.text, item.id
FROM careers_responsibilities AS item
JOIN _careers_v AS version
  ON version.parent_id = item._parent_id
WHERE version.latest = 1;

INSERT INTO _careers_v_version_requirements (_order, _parent_id, text, _uuid)
SELECT item._order, version.id, item.text, item.id
FROM careers_requirements AS item
JOIN _careers_v AS version
  ON version.parent_id = item._parent_id
WHERE version.latest = 1;

INSERT INTO _careers_v_version_benefits (_order, _parent_id, text, _uuid)
SELECT item._order, version.id, item.text, item.id
FROM careers_benefits AS item
JOIN _careers_v AS version
  ON version.parent_id = item._parent_id
WHERE version.latest = 1;
