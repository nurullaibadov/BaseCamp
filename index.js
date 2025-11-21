// // index.js
// const express = require('express');
// const path = require('path');       
// const app = express();
// const PORT = process.env.PORT || 3000;

// app.set('view engine', 'ejs');

// app.set('views', path.join(__dirname, 'views'));

// app.use(express.json());

// app.use(express.static(path.join(__dirname, 'public')));

// app.get('/', (req, res) => {
//   res.render('index', { 
//     title: 'My Awesome Express + EJS App',
//     message: 'Hello from EJS!'
//   });
// });

// app.listen(PORT, () => {
//   console.log(`Server running at http://localhost:${PORT}`);
// });


const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Routes

// Home / Login page
app.get('/', (req, res) => {
  res.render('index', { title: 'Login - MyBasecamp' });
});

// Register page
app.get('/register', (req, res) => {
  res.render('register', { title: 'Register - MyBasecamp' });
});

// Handle registration form
app.post('/users', (req, res) => {
  const { firstname, lastname, email, password } = req.body;
  console.log({ firstname, lastname, email, password });

  // For now, just redirect to login
  res.send('User registered successfully! Go back to <a href="/">Login</a>.');
});

// Handle login form
app.post('/sign_in', (req, res) => {
  const { email, password } = req.body;
  console.log({ email, password });

  // Fake login success
  res.send(`Logged in as ${email}`);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
  