// Define any controller functions
const showCategoriesPage = async (req, res) => {
    const categories = [
        'Environmental',
        'Educational',
        'Community Service',
        'Health and Wellness'
    ];
    const title = 'Service Project Categories';

    res.render('categories', { title, categories });
};

// Export any controller functions
export { showCategoriesPage };