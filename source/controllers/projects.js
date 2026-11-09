// Import any needed model functions
import { getAllProjects, getProjectById } from '../models/projects.js';
import { getCategoriesByProjectId } from '../models/categories.js';

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

const showProjectDetailsPage = async (req, res, next) => {
    const project = await getProjectById(req.params.id);
    if (!project) {
        const error = new Error('Project Not Found');
        error.status = 404;
        return next(error);
    }

    const categories = await getCategoriesByProjectId(req.params.id);
    const title = project.title;

    res.render('project', { title, project, categories });
};

// Export any controller functions
export { showProjectsPage, showProjectDetailsPage };