import db from './db.js';

const getAllProjects = async () => {
    const query = `
        SELECT
            projects.id,
            projects.title,
            projects.description,
            projects.location,
            projects.date,
            organization.name AS organization_name
        FROM public.projects AS projects
        JOIN public.organization AS organization
            ON projects.organization_id = organization.organization_id
        ORDER BY projects.date ASC;
    `;

    const result = await db.query(query);
    return result.rows;
};

export { getAllProjects };
