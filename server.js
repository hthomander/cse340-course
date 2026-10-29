import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// Set view engine to EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Static middleware for public directory (CSS, images)
app.use(express.static(path.join(__dirname, 'public')));

// Home Route
app.get('/', async (req, res) => {
  res.render('home', { title: 'Home' });
});

// Organizations Route
app.get('/organizations', async (req, res) => {
  res.render('organizations', { title: 'Organizations' });
});

// Projects Route
app.get('/projects', async (req, res) => {
  res.render('projects', { title: 'Projects' });
});

// Service Project Categories Route
app.get('/categories', async (req, res) => {
  const categoryList = [
    'Environmental',
    'Educational',
    'Community Service',
    'Health and Wellness'
  ];

  res.render('categories', {
    title: 'Service Project Categories',
    categories: categoryList
  });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
