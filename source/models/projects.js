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

export { getAllProjects, getProjectsByOrganizationId };
