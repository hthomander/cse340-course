const db = require('../database'); // Adjust path to your database connection module if needed

/**
 * Retrieves all service projects along with their sponsoring organization names.
 * @returns {Promise<Array>} A promise that resolves to an array of project objects.
 */
function getAllProjects() {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT 
        projects.id,
        projects.title,
        projects.description,
        projects.location,
        projects.date,
        organizations.name AS organization_name
      FROM projects
      JOIN organizations ON projects.organization_id = organizations.id
      ORDER BY projects.date ASC;
    `;

    db.all(query, [], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

module.exports = {
  getAllProjects
};