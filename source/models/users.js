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

export { createUser, authenticateUser, findAllUsers };