import db from './db.js';

const getAllCategories = async () => {
    const query = `
        SELECT id AS category_id, name
        FROM public.categories
        ORDER BY name;
    `;

    const result = await db.query(query);
    return result.rows;
};

const getCategoryById = async (categoryId) => {
    const query = `
        SELECT id AS category_id, name
        FROM public.categories
        WHERE id = $1;
    `;

    const result = await db.query(query, [categoryId]);
    return result.rows[0] || null;
};

const getCategoriesByProjectId = async (projectId) => {
    const query = `
        SELECT categories.id AS category_id, categories.name
        FROM public.categories AS categories
        JOIN public.project_categories AS project_categories
          ON project_categories.category_id = categories.id
        WHERE project_categories.project_id = $1
        ORDER BY categories.name;
    `;

    const result = await db.query(query, [projectId]);
    return result.rows;
};

const getCategoriesByOrganizationId = async (organizationId) => {
    const query = `
        SELECT DISTINCT categories.id AS category_id, categories.name
        FROM public.categories AS categories
        JOIN public.project_categories AS project_categories
          ON project_categories.category_id = categories.id
        JOIN public.projects AS projects
          ON projects.id = project_categories.project_id
        WHERE projects.organization_id = $1
        ORDER BY categories.name;
    `;

    const result = await db.query(query, [organizationId]);
    return result.rows;
};

const getProjectsByCategoryId = async (categoryId) => {
    const query = `
        SELECT
          projects.id AS project_id,
          projects.title,
          projects.description,
          projects.location,
          projects.date
        FROM public.projects AS projects
        JOIN public.project_categories AS project_categories
          ON project_categories.project_id = projects.id
        WHERE project_categories.category_id = $1
        ORDER BY projects.date ASC;
    `;

    const result = await db.query(query, [categoryId]);
    return result.rows;
};

export {
    getAllCategories,
    getCategoryById,
    getCategoriesByProjectId,
    getCategoriesByOrganizationId,
    getProjectsByCategoryId
};
