-- ========================================
-- Organization Table
-- ========================================
CREATE TABLE organization (
    organization_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    logo_filename VARCHAR(255) NOT NULL
);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE
);

-- Create junction table for many-to-many relationship between projects and categories
CREATE TABLE IF NOT EXISTS project_categories (
    project_id INTEGER NOT NULL,
    category_id INTEGER NOT NULL,
    PRIMARY KEY (project_id, category_id),
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

-- Insert at least 3 categories relevant to service projects
INSERT INTO categories (name) VALUES ('Community Outreach');
INSERT INTO categories (name) VALUES ('Environmental Conservation');
INSERT INTO categories (name) VALUES ('Education & Youth');

-- Associate each project with at least one category (adjust IDs based on your existing project IDs)
-- Example assuming project IDs 1, 2, 3, etc. exist in your projects table:
INSERT INTO project_categories (project_id, category_id) VALUES (1, 1);
INSERT INTO project_categories (project_id, category_id) VALUES (2, 2);
INSERT INTO project_categories (project_id, category_id) VALUES (3, 3);
