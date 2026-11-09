// Import any needed model functions
import { getAllProjects } from '../models/projects.js';

// Define any controller functions
const showProjectsPage = async (req, res) => {
    let projects = [];
    let loadError = false;

    try {
        projects = await getAllProjects();
    } catch (error) {
        console.error('Failed to load projects page:', error);
        loadError = true;
    }

    const title = 'Service Projects';

    res.render('projects', { title, projects, loadError });
};

// Export any controller functions
export { showProjectsPage };