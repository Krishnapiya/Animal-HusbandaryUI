CREATE TABLE modules (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  slug VARCHAR(120) NOT NULL UNIQUE,
  display_order INT DEFAULT 0,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE menus (
  id BIGSERIAL PRIMARY KEY,
  module_id BIGINT NOT NULL REFERENCES modules(id),
  parent_id BIGINT NULL REFERENCES menus(id),
  name VARCHAR(120) NOT NULL,
  slug VARCHAR(120) NOT NULL,
  path VARCHAR(255) NOT NULL,
  display_order INT DEFAULT 0,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(module_id, slug)
);

CREATE TABLE permission_actions (
  id BIGSERIAL PRIMARY KEY,
  action_key VARCHAR(20) NOT NULL UNIQUE,
  description VARCHAR(255)
);

INSERT INTO permission_actions (action_key, description) VALUES
  ('list', 'Read/list records'),
  ('save', 'Create/save records'),
  ('edit', 'Update records'),
  ('delete', 'Delete records');

CREATE TABLE role_menu_permissions (
  id BIGSERIAL PRIMARY KEY,
  role_id BIGINT NOT NULL,
  menu_id BIGINT NOT NULL REFERENCES menus(id),
  action_id BIGINT NOT NULL REFERENCES permission_actions(id),
  allowed BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(role_id, menu_id, action_id)
);

CREATE INDEX idx_role_menu_permissions_role ON role_menu_permissions(role_id);
CREATE INDEX idx_menus_module ON menus(module_id);
