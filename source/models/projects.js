import db from './db.js';

const getAllProjects = async () => {
      const query = `
        SELECT
          projects.id AS project_id,
          projects.organization_id,
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

const createProject = async (title, description, location, date, organizationId) => {
    const query = `
      INSERT INTO project (title, description, location, date, organization_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING project_id;
    `;

    const queryParams = [title, description, location, date, organizationId];
    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        throw new Error('Failed to create project');
    }

    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log('Created new project with ID:', result.rows[0].project_id);
    }

    return result.rows[0].project_id;
}

const getUpcomingProjects = async (number_of_projects) => {
      const query = `
        SELECT
          projects.id AS project_id,
          projects.title,
          projects.description,
          projects.date,
          projects.location,
          projects.organization_id,
          organization.name AS organization_name
        FROM public.projects AS projects
        JOIN public.organization AS organization
          ON projects.organization_id = organization.organization_id
        WHERE projects.date >= CURRENT_DATE
        ORDER BY projects.date ASC
        LIMIT $1;
      `;

      const result = await db.query(query, [number_of_projects]);
      return result.rows;
};

const getProjectDetails = async (id) => {
      const query = `
        SELECT
          projects.id AS project_id,
          projects.title,
          projects.description,
          projects.date,
          projects.location,
          projects.organization_id,
          organization.name AS organization_name
        FROM public.projects AS projects
        JOIN public.organization AS organization
          ON projects.organization_id = organization.organization_id
        WHERE projects.id = $1;
      `;

      const result = await db.query(query, [id]);
      return result.rows[0] || null;
};

const getProjectById = getProjectDetails;

const getProjectsByOrganizationId = async (organizationId) => {
      const query = `
        SELECT
          id AS project_id,
          organization_id,
          title,
          description,
          location,
          date
        FROM public.projects
        WHERE organization_id = $1
        ORDER BY date;
      `;
      
      const queryParams = [organizationId];
      const result = await db.query(query, queryParams);

      return result.rows;
};

export { getAllProjects, createProject, getUpcomingProjects, getProjectDetails, getProjectById, getProjectsByOrganizationId };
