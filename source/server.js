import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import { getAllOrganizations } from './models/organizations.js';
import { testConnection } from './models/db.js';


// Define the application environment
const NODE_ENV = process.env.NODE_ENV?.toLowerCase() || 'production';

// Define the port number the server will listen on
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

/**
  * Configure Express middleware
  */

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, '..', 'public')));

// Set EJS as the templating engine
app.set('view engine', 'ejs');

// Tell Express where to find your templates
app.set('views', path.join(__dirname, 'views'));
/**
  * Routes
  */
app.get('/', async (req, res) => {
    const title = 'Home';
    res.render('home', { title });
});

app.get('/organizations', async (req, res) => {
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
});

app.get('/projects', async (req, res) => {
    const title = 'Service Projects';
    res.render('projects', { title });
});

app.get('/categories', async (req, res) => {
    const categories = [
        'Environmental',
        'Educational',
        'Community Service',
        'Health and Wellness'
    ];
    res.render('categories', {
        title: 'Service Project Categories',
        categories
    });
});

app.listen(PORT, async () => {
  try {
    await testConnection();
    console.log(`Server is running at http://127.0.0.1:${PORT}`);
    console.log(`Environment: ${NODE_ENV}`);
  } catch (error) {
    console.error('Error connecting to the database:', error);
  }

  const express = require('express');
const app = express();
const { getAllProjects } = require('./src/models/projects');

// Set view engine
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Service Projects Route
app.get('/projects', async (req, res) => {
  try {
    const projects = await getAllProjects();
    
    // 3. Verify data in console
    console.log("Retrieved Projects:", projects);

    res.render('projects', { projects });
  } catch (err) {
    console.error("Error retrieving projects:", err);
    res.status(500).send("Internal Server Error");
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

});
