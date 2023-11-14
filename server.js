const express = require('express');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser'); // Require the body-parser module

const app = express();
const port = 3000;

// Set up static file serving for the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Add the body-parser middleware to handle JSON and form data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Define a route for the login endpoint
app.post('/login', (req, res) => {
    console.log('Login Attempt...');
    const username = req.body.username;
    const password = req.body.password;
    console.log(username);
    console.log(password);

    // Load the login credentials from the JSON file
    fs.readFile('login_credentials.json', 'utf8', (err, data) => {
        if (err) {
            console.log('Error...');
            res.status(500).json({ error: 'Server error: Could not read login credentials' });
            return;
        }

        try {
            const credentials = JSON.parse(data);

            const user = credentials.users.find(user => user.username === username && user.password === password);
            if (user) {
                res.status(200).json({ message: 'Login successful' });
            } else {
                res.status(401).json({ error: 'Invalid username or password' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Server error: Could not parse login credentials' });
        }
    });
});

app.get('/getPosts', (req, res) => {
    // Read posts from 'posts.json'
    fs.readFile('posts.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading posts.json:', err.message);
            return res.status(500).json({ error: 'Error fetching posts' });
        }

        try {
            const posts = JSON.parse(data);
            res.status(200).json(posts);
        } catch (error) {
            console.error('Error parsing posts.json:', error.message);
            res.status(500).json({ error: 'Error fetching posts' });
        }
    });
});


app.post('/addPost', (req, res) => {
    const { title, content } = req.body;

    if (!title || !content) {
        return res.status(400).json({ success: false, error: 'Title and content are required' });
    }

    const newPost = {
        author: 'Server Author', // You may modify this to get the actual author from the request
        date: new Date().toLocaleDateString(),
        title,
        content,
    };

    // Read existing posts from 'posts.json'
    let posts = [];
    try {
        const postsData = fs.readFileSync('posts.json', 'utf8');
        posts = JSON.parse(postsData);
    } catch (error) {
        console.error('Error reading posts.json:', error.message);
    }

    // Add the new post
    posts.unshift(newPost);

    // Write the updated posts back to 'posts.json'
    fs.writeFile('posts.json', JSON.stringify(posts, null, 2), (err) => {
        if (err) {
            console.error('Error writing to posts.json:', err.message);
            return res.status(500).json({ success: false, error: 'Error saving post' });
        }

        res.status(200).json({ success: true });
    });
});



// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
