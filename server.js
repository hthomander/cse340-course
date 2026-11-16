import './source/server.js';
import session from 'express-session';
const SESSION_SECRET = process.env.SESSION_SECRET;

// Set up session management
app.use(session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60 * 60 * 1000 } // Session expires after 1 hour of inactivity
}));