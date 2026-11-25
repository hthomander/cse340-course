import bcrypt from 'bcrypt';
import { authenticateUser, createUser } from '../models/users.js';

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
        return res.redirect('/');
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

export {
    showUserRegistrationForm,
    processUserRegistrationForm,
    showLoginForm,
    processLoginForm,
    processLogout
};