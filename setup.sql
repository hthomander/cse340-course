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

DROP TABLE IF EXISTS projects;
DROP TABLE IF EXISTS organizations;

-- 1. Create Organizations table
CREATE TABLE organizations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT
);

-- 2. Create Projects table with a foreign key constraint
CREATE TABLE projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    organization_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    location TEXT,
    date TEXT,
    FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE
);

-- 3. Insert Sample Organizations (At least 3)
INSERT INTO organizations (id, name, description) VALUES 
(1, 'Community Food Bank', 'Provides meals and groceries to local families in need.'),
(2, 'Green Earth Initiative', 'Focuses on neighborhood cleanups, tree planting, and recycling education.'),
(3, 'Youth Literacy Program', 'Offers after-school tutoring and book distribution for children.');

-- 4. Insert Sample Service Projects (At least 5 per organization = 15+ total)
INSERT INTO projects (organization_id, title, description, location, date) VALUES
-- Community Food Bank Projects (Org 1)
(1, 'Holiday Food Drive', 'Collect and sort non-perishable food items for winter distribution.', 'Main Community Center', '2026-11-20'),
(1, 'Soup Kitchen Volunteer Shift', 'Prep ingredients and serve hot meals to community members.', 'Downtown Shelter Kitchen', '2026-11-25'),
(1, 'Thanksgiving Basket Assembly', 'Pack complete Thanksgiving meal boxes for 200 families.', 'Warehouse B', '2026-11-28'),
(1, 'Weekend Mobile Pantry', 'Distribute fresh produce at the neighborhood park.', 'Westside Park', '2026-12-05'),
(1, 'End-of-Year Inventory Audit', 'Count and organize remaining pantry supplies.', 'Main Community Center', '2026-12-18'),

-- Green Earth Initiative Projects (Org 2)
(2, 'Riverbank Cleanup', 'Remove litter and plastic waste along the local river trail.', 'Riverside Trailhead', '2026-11-22'),
(2, 'Fall Tree Planting', 'Plant 50 native saplings along city sidewalks.', 'City Park East', '2026-11-29'),
(2, 'Community E-Waste Recycling', 'Collect old electronics and batteries for safe disposal.', 'Municipal Parking Lot', '2026-12-06'),
(2, 'Park Winterization', 'Mulch flower beds and protect young shrubs from frost.', 'Central Botanical Gardens', '2026-12-12'),
(2, 'Neighborhood Energy Audit Workshop', 'Teach residents how to reduce home energy waste.', 'Public Library Room 3', '2026-12-15'),

-- Youth Literacy Program Projects (Org 3)
(3, 'After-School Reading Buddies', 'Read one-on-one with elementary students to boost reading fluency.', 'Lincoln Elementary Library', '2026-11-21'),
(3, 'Childrens Book Drive Sorting', 'Sort and categorize donated books by reading level.', 'Community Literacy Center', '2026-11-27'),
(3, 'Weekend Storytime Event', 'Host an interactive storytelling morning for toddlers.', 'City Bookstore', '2026-12-04'),
(3, 'Library Book Shelving Assistance', 'Help organize and shelve new youth acquisitions.', 'Main City Library', '2026-12-11'),
(3, 'Holiday Gift & Book Giveaway', 'Distribute wrapped books to children at the holiday party.', 'Youth Center Gymnasium', '2026-12-20');