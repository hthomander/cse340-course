import bcrypt from 'bcrypt';
import db from './db.js'

const createUser = async (name, email, passwordHash) => {
    const default_role = 'user';
    const query = `
        INSERT INTO users (name, email, password_hash, role_id) 
        VALUES ($1, $2, $3, (SELECT role_id FROM roles WHERE role_name = $4)) 
        RETURNING user_id
    `;
    const queryParams = [name, email, passwordHash, default_role];
    
    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        throw new Error('Failed to create user');
    }

    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log('Created new user with ID:', result.rows[0].user_id);
    }

    return result.rows[0].user_id;
};

const findUserByEmail = async (email) => {
    const query = `
        SELECT users.user_id, users.name, users.email, users.password_hash,
               users.role_id, roles.role_name
        FROM users
        JOIN roles ON roles.role_id = users.role_id
        WHERE users.email = $1
    `;
    const queryParams = [email];
    
    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        return null;
    }
    
    return result.rows[0];
};

const findAllUsers = async () => {
    const query = `
        SELECT users.user_id, users.name, users.email, roles.role_name
        FROM users
        LEFT JOIN roles ON roles.role_id = users.role_id
        ORDER BY users.name, users.email
    `;

    const result = await db.query(query);
    return result.rows;
};

const findAllRoles = async () => {
    const query = `
        SELECT role_id, role_name
        FROM roles
        ORDER BY role_name
    `;

    const result = await db.query(query);
    return result.rows;
};

const updateUserRole = async (userId, roleName) => {
    const query = `
        UPDATE users
        SET role_id = (SELECT role_id FROM roles WHERE role_name = $2)
        WHERE user_id = $1
          AND EXISTS (SELECT 1 FROM roles WHERE role_name = $2)
        RETURNING user_id
    `;
    const result = await db.query(query, [userId, roleName]);
    return result.rows.length > 0;
};

const promoteUserToAdmin = async (email) => {
    const query = `
        UPDATE users
        SET role_id = (SELECT role_id FROM roles WHERE role_name = 'admin')
        WHERE email = $1
          AND EXISTS (SELECT 1 FROM roles WHERE role_name = 'admin')
        RETURNING name, email
    `;
    const result = await db.query(query, [email]);
    return result.rows[0] || null;
};

const verifyPassword = async (password, passwordHash) => {
    return bcrypt.compare(password, passwordHash);
};

const authenticateUser = async (email, password) => {
    const user = await findUserByEmail(email);

    if (!user || !(await verifyPassword(password, user.password_hash))) {
        return null;
    }

    const { password_hash, ...authenticatedUser } = user;
    return authenticatedUser;
};

export {
    createUser,
    authenticateUser,
    findAllUsers,
    findAllRoles,
    updateUserRole,
    promoteUserToAdmin
};