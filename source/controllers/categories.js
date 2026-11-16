import {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    getProjectsByCategoryId,
    getCategoriesByProjectId,
    updateCategoryAssignments
} from '../models/categories.js';
import { getProjectDetails } from '../models/projects.js';
import { body, validationResult } from 'express-validator';

const categoryValidation = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Category name is required')
        .isLength({ min: 3, max: 100 })
        .withMessage('Category name must be between 3 and 100 characters')
];

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

const showAssignCategoriesForm = async (req, res) => {
    const projectId = req.params.projectId;

    const projectDetails = await getProjectDetails(projectId);
    const categories = await getAllCategories();
    const assignedCategories = await getCategoriesByProjectId(projectId);

    const title = 'Assign Categories to Project';

    res.render('assign-categories', { title, projectId, projectDetails, categories, assignedCategories });
};

const processAssignCategoriesForm = async (req, res) => {
    const projectId = req.params.projectId;
    const selectedCategoryIds = req.body.categoryIds || [];
    
    // Ensure selectedCategoryIds is an array
    const categoryIdsArray = Array.isArray(selectedCategoryIds) ? selectedCategoryIds : [selectedCategoryIds];
    await updateCategoryAssignments(projectId, categoryIdsArray);
    req.flash('success', 'Categories updated successfully.');
    res.redirect(`/project/${projectId}`);
};

const showNewCategoryForm = (req, res) => {
    res.render('new-category', { title: 'Create New Category' });
};

const processNewCategoryForm = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        errors.array().forEach((error) => req.flash('error', error.msg));
        return res.redirect('/new-category');
    }

    await createCategory(req.body.name);
    req.flash('success', 'Category created successfully.');
    res.redirect('/categories');
};

const showEditCategoryForm = async (req, res, next) => {
    const category = await getCategoryById(req.params.id);
    if (!category) {
        const error = new Error('Category Not Found');
        error.status = 404;
        return next(error);
    }

    res.render('edit-category', { title: 'Edit Category', category });
};

const processEditCategoryForm = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        errors.array().forEach((error) => req.flash('error', error.msg));
        return res.redirect(`/edit-category/${req.params.id}`);
    }

    const category = await updateCategory(req.params.id, req.body.name);
    if (!category) {
        const error = new Error('Category Not Found');
        error.status = 404;
        throw error;
    }

    req.flash('success', 'Category updated successfully.');
    res.redirect('/categories');
};

// Export any controller functions
export {
    showCategoriesPage,
    showCategoryDetailsPage,
    showAssignCategoriesForm,
    processAssignCategoriesForm,
    showNewCategoryForm,
    processNewCategoryForm,
    showEditCategoryForm,
    processEditCategoryForm,
    categoryValidation
};