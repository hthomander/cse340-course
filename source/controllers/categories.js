import {
    getAllCategories,
    getCategoryById,
    getProjectsByCategoryId
} from '../models/categories.js';

// Define any controller functions
const showCategoriesPage = async (req, res) => {
    let categories = [];
    let loadError = false;

    try {
        categories = await getAllCategories();
    } catch (error) {
        console.error('Failed to load categories page:', error);
        loadError = true;
    }

    const title = 'Service Project Categories';

    res.render('categories', { title, categories, loadError });
};

const showCategoryDetailsPage = async (req, res, next) => {
    const category = await getCategoryById(req.params.id);
    if (!category) {
        const error = new Error('Category Not Found');
        error.status = 404;
        return next(error);
    }

    const projects = await getProjectsByCategoryId(req.params.id);
    const title = category.name;

    res.render('category', { title, category, projects });
};

// Export any controller functions
export { showCategoriesPage, showCategoryDetailsPage };