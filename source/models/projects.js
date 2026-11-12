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

export { getAllProjects, getUpcomingProjects, getProjectDetails, getProjectById, getProjectsByOrganizationId };
