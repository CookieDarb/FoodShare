const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const path = require('path'); // Ensure you have this imported
const session = require('express-session');
var cors=require('cors');
const app = express();
const port = 3000;



// Middleware
app.use(bodyParser.json());
app.use('/scripts',express.static(path.join(__dirname, 'scripts')));
app.use('/static',express.static(path.join(__dirname, 'static')));
app.use('/templates',express.static(path.join(__dirname, 'templates')));
app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: 'process.env.SESSION_SECRET', resave: false, saveUninitialized: true }));
app.use(cors());

// MySQL Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'foodshare'
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL database.');
});

// API Endpoints
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Serve login and register pages
app.get('/templates/login.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'templates', 'login.html'));
});

app.get('/templates/register.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'templates', 'register.html'));
});

// Serve the dashboard pages
app.get('/templates/restaurant_dashboard.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'templates', 'restaurant_dashboard.html'));
});

app.get('/templates/ngo_dashboard.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'templates', 'ngo_dashboard.html'));
});

// Serve add post page
app.get('/templates/addpost.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'templates', 'addpost.html'));
});

// Registration Endpoint
app.post('/api/register', (req, res) => {
    const { name, email, password, role } = req.body;

    // Add input validation for the role
    if (!['restaurant', 'ngo'].includes(role)) {
        return res.status(400).json({message:'Invalid role specified.'});
    }

    // Hash the password before storing
    bcrypt.hash(password, 10, (err, hash) => {
        if (err) return res.status(500).send('Error hashing password');

        const query = 'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)';
        db.query(query, [name, email, hash, role], (err, results) => {
            if (err) {
                return res.status(500).send('Error registering user: ' + err);
            }
            // Store user information in session
            req.session.user = { id: results.insertId, email, role }; // Save relevant info

            // Redirect based on role
            if (role === 'restaurant') {
                res.redirect('/templates/restaurant_dashboard.html');
            } else {
                res.redirect('/templates/ngo_dashboard.html');
            }
        });
    });
});

// Login Endpoint
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    const query = 'SELECT * FROM users WHERE email = ?';
    db.query(query, [email], (err, results) => {
        if (err) return res.status(500).send(err);
        if (results.length > 0) {
            // Compare the plain text password with the hashed password
            bcrypt.compare(password, results[0].password, (err, isMatch) => {
                if (err) return res.status(500).send(err);
                if (isMatch) {
                    // Store user information in session
                    req.session.user = { id: results[0].id, email, role: results[0].role }; // Save relevant info
                    
                    // Redirect based on role
                    if (results[0].role === 'restaurant') {
                        res.redirect('/templates/restaurant_dashboard.html');
                    } else {
                        res.redirect('/templates/ngo_dashboard.html');
                    }
                } else {
                    res.status(401).send('Invalid credentials');
                }
            });
        } else {
            res.status(401).send('Invalid credentials');
        }
    });
});


// Food post addition
app.post('/api/food/add', (req, res) => {
    const { food_title, meal_quantity, expiry, contact_details } = req.body;
    console.log(food_title,meal_quantity,expiry,contact_details);
    // Get the restaurant_id from the session
    const restaurant_id = req.session.user.id; // Automatically use the logged-in restaurant's ID
    console.log(req.session.user);

    const query = 'INSERT INTO food_posts (restaurant_id, food_title, meal_quantity, expiry, contact_details, status) VALUES (?, ?, ?, ?, ?, "active")';
    db.query(query, [restaurant_id, food_title, meal_quantity, expiry, contact_details], (err, results) => {
        console.log(err);
        if (err) return res.status(500).send(err);
        res.send('Food post added successfully.');
    });
});



app.get('/api/food/available', (req, res) => {
    const query = 'SELECT * FROM food_posts WHERE expiry > NOW() AND status = "active"';
    db.query(query, (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});

app.post('/api/food/accept/:id', (req, res) => {
    const foodPostId = req.params.id;
    const query = 'UPDATE food_posts SET status = "accepted" WHERE id = ?';
    db.query(query, [foodPostId], (err, result) => {
        if (err) return res.status(500).send(err);
        res.send('Food post accepted');
    });
});

// Automatic post deletion based on expiration
setInterval(() => {
    const query = 'DELETE FROM food_posts WHERE expiry < NOW()';
    db.query(query, (err) => {
        if (err) console.error(err);
    });
}, 3600000); // Run every hour

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
