// Import any needed model functions
import { getAllOrganizations, getOrganizationDetails } from '../models/organizations.js';
import { getProjectsByOrganizationId } from '../models/projects.js';
import { getCategoriesByOrganizationId } from '../models/categories.js';

const showOrganizationsPage = async (req, res) => {
    const title = 'Our Partner Organizations';
    let organizations = [];
    let loadError = false;

    try {
        organizations = await getAllOrganizations();
    } catch (error) {
        console.error('Failed to load organizations page:', error);
        loadError = true;
    }

    res.render('organizations', { title, organizations, loadError });
};

// Define any controller functions
const showOrganizationDetailsPage = async (req, res, next) => {
    const organizationId = req.params.id;
    const organizationDetails = await getOrganizationDetails(organizationId);
    if (!organizationDetails) {
        const error = new Error('Organization Not Found');
        error.status = 404;
        return next(error);
    }

    const projects = await getProjectsByOrganizationId(organizationId);
    const categories = await getCategoriesByOrganizationId(organizationId);
    const title = organizationDetails.name;

    res.render('organization', { title, organizationDetails, projects, categories });
};

// Export any controller functions
export { showOrganizationsPage, showOrganizationDetailsPage };