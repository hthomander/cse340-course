import bcrypt from 'bcrypt';
import {
    authenticateUser,
    createUser,
    findAllUsers,
    findAllRoles,
    updateUserRole
} from '../models/users.js';

const showUserRegistrationForm = (req, res) => {
    res.render('register', { title: 'Register' });
};

const showLoginForm = (req, res) => {
    if (req.query.loggedOut === '1') {
        req.flash('success', 'You have logged out successfully.');
    }

    res.render('login', { title: 'Login' });
};

const processLoginForm = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        const user = await authenticateUser(email, password);

        if (!user) {
            req.flash('error', 'Login failed. Check your email and password.');
            return res.redirect('/login');
        }

        req.session.user = user;
        req.flash('success', 'Login successful.');
        console.log('User logged in:', user);
        return res.redirect('/dashboard');
    } catch (error) {
        return next(error);
    }
};

const processLogout = (req, res, next) => {
    req.session.destroy((error) => {
        if (error) {
            return next(error);
        }

        return res.redirect('/login?loggedOut=1');
    });
};

const processUserRegistrationForm = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Hash the password before storing it
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // Create the user in the database
        const userId = await createUser(name, email, passwordHash);

        // Redirect to the home page after successful registration
        req.flash('success', 'Registration successful! Please log in.');
        res.redirect('/');
    } catch (error) {
        console.error('Error registering user:', error);
        req.flash('error', 'An error occurred during registration. Please try again.');
        res.redirect('/register');
    }
};

const requireLogin = (req, res, next) => {
    if (!req.session || !req.session.user) {
        req.flash('error', 'You must be logged in to access that page.');
        return res.redirect('/login');
    }
    next();
};

const requireRole = (role) => (req, res, next) => {
    if (!req.session || !req.session.user) {
        req.flash('error', 'You must be logged in to access that page.');
        return res.redirect('/login');
    }

    if (req.session.user.role_name !== role) {
        req.flash('error', 'You do not have permission to access that page.');
        return res.redirect('/dashboard');
    }

    return next();
};

const showDashboard = (req, res) => {
    const user = req.session.user;
    res.render('dashboard', { 
        title: 'Dashboard',
        name: user.name,
        email: user.email
    });
};

const showUsersPage = async (req, res, next) => {
    try {
        const [users, roles] = await Promise.all([findAllUsers(), findAllRoles()]);
        return res.render('users', { title: 'Registered Users', users, roles });
    } catch (error) {
        return next(error);
    }
};

const processUserRoleForm = async (req, res, next) => {
    const userId = Number(req.params.userId);
    const { role_name: roleName } = req.body;

    try {
        if (!Number.isSafeInteger(userId) || userId < 1) {
            req.flash('error', 'The selected user is invalid.');
            return res.redirect('/users');
        }

        const roles = await findAllRoles();
        if (!roles.some((role) => role.role_name === roleName)) {
            req.flash('error', 'Select a valid role.');
            return res.redirect('/users');
        }

        const updated = await updateUserRole(userId, roleName);
        if (!updated) {
            req.flash('error', 'The selected user could not be found.');
            return res.redirect('/users');
        }

        if (req.session.user.user_id === userId) {
            req.session.user.role_name = roleName;
        }

        req.flash('success', 'User role updated successfully.');
        return res.redirect(
            req.session.user.user_id === userId && roleName !== 'admin'
                ? '/dashboard'
                : '/users'
        );
    } catch (error) {
        return next(error);
    }
};

export {
    showUserRegistrationForm,
    processUserRegistrationForm,
    showLoginForm,
    processLoginForm,
    processLogout,
    requireLogin,
    requireRole,
    showDashboard,
    showUsersPage,
    processUserRoleForm
};