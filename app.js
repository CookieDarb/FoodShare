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
        res.redirect('/templates/restaurant_dashboard.html');
    });
});

// Fetch past posts for the logged-in restaurant
app.get('/api/restaurant/posts', (req, res) => {
    const restaurant_id = req.session.user.id; // Assuming the user is logged in and their ID is in session

    const query = 'SELECT * FROM food_posts WHERE restaurant_id = ?';
    db.query(query, [restaurant_id], (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results); // Return both active and expired posts
    });
});



// Endpoint to get available food posts including restaurant name and contact details
app.get('/api/food/available', (req, res) => {
    const query = `
        SELECT food_posts.*, users.name AS restaurant_name
        FROM food_posts
        JOIN users ON food_posts.restaurant_id = users.id
        WHERE expiry > NOW() AND status = "active"
    `;
    db.query(query, (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results); // Send the results back to the frontend
    });
});


// Endpoint to mark a post as accepted by the restaurant
app.post('/api/food/mark-accepted/:id', (req, res) => {
    const foodPostId = req.params.id;
    
    // Ensure the post belongs to the logged-in restaurant
    const restaurant_id = req.session.user.id;

    const query = 'UPDATE food_posts SET status = "accepted" WHERE id = ? AND restaurant_id = ?';
    db.query(query, [foodPostId, restaurant_id], (err, result) => {
        if (err) return res.status(500).send('Error updating post status');
        if (result.affectedRows === 0) {
            return res.status(404).send('Post not found or not authorized');
        }
        res.send('Post marked as accepted');
    });
});



// Endpoint to delete a food post by ID
app.delete('/api/food/delete/:id', (req, res) => {
    const foodPostId = req.params.id;
    
    // Ensure the post belongs to the logged-in restaurant
    const restaurant_id = req.session.user.id;

    const query = 'DELETE FROM food_posts WHERE id = ? AND restaurant_id = ?';
    db.query(query, [foodPostId, restaurant_id], (err, result) => {
        if (err) return res.status(500).send('Error deleting post');
        if (result.affectedRows === 0) {
            return res.status(404).send('Post not found or not authorized');
        }
        res.send('Post deleted successfully');
    });
});

// Logout Endpoint
app.get('/api/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send('Failed to log out.');
        }
        res.redirect('/'); // Redirect to home page after logging out
    });
});



// Automatic post expiration based on time
setInterval(() => {
    const query = 'UPDATE food_posts SET status = "expired" WHERE expiry < NOW() AND status = "active"';
    db.query(query, (err) => {
        if (err) console.error(err);
    });
}, 3600000); // Run every hour


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
