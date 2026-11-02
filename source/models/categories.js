const db = require('../data/database'); // Adjust path to your database connection module if necessary

/**
 * Retrieves all categories from the database.
 * @returns {Promise<Array>} List of category objects
 */
async function getAllCategories() {
    try {
        const query = 'SELECT * FROM categories ORDER BY name ASC';
        const categories = await db.all(query); // Or db.query(query) depending on your SQL driver (sqlite vs pg)
        return categories;
    } catch (error) {
        console.error('Error retrieving categories:', error);
        throw error;
    }
}

module.exports = {
    getAllCategories
};