// Import any needed model functions
import { getUpcomingProjects, getProjectDetails, createProject } from '../models/projects.js';
import { getCategoriesByProjectId } from '../models/categories.js';
import { getAllOrganizations } from '../models/organizations.js';   

const NUMBER_OF_UPCOMING_PROJECTS = 5;

// Define any controller functions
const showProjectsPage = async (req, res) => {
    let projects = [];
    let loadError = false;

    try {
        projects = await getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS);
    } catch (error) {
        console.error('Failed to load projects page:', error);
        loadError = true;
    }

    const title = 'Upcoming Service Projects';

    res.render('projects', { title, projects, loadError });
};

const showProjectDetailsPage = async (req, res, next) => {
    const project = await getProjectDetails(req.params.id);
    if (!project) {
        const error = new Error('Project Not Found');
        error.status = 404;
        return next(error);
    }

    const categories = await getCategoriesByProjectId(req.params.id);
    const title = project.title;

    res.render('project', { title, project, categories });
};

const showNewProjectForm = async (req, res) => {
    const organizations = await getAllOrganizations();
    const title = 'Add New Project';

    res.render('new-project', { title, organizations });
};

const processNewProjectForm = async (req, res) => {
    const { organizationId, title, description, location, date } = req.body;

    await createProject(title, description, location, date, organizationId);
    req.flash('success', 'Project added successfully!');
    res.redirect('/projects');
};

// Export any controller functions
export { showProjectsPage, showProjectDetailsPage, showNewProjectForm, processNewProjectForm };