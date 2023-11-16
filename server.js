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
    fs.readFile('./data/users.json', 'utf8', (err, data) => {
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
    fs.readFile('./data/posts.json', 'utf8', (err, data) => {
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


// server.js
// ...

function generateUniqueId() {
    // Generate a unique ID (you can use a more sophisticated method if needed)
    return Math.random().toString(36).substr(2, 9);
}

app.post('/addPost', (req, res) => {
    const { title, content } = req.body;

    if (!title || !content) {
        return res.status(400).json({ success: false, error: 'Title and content are required' });
    }

    const newPost = {
        id: generateUniqueId(), // Assign a unique post ID
        author: 'Server Author', // You may modify this to get the actual author from the request
        date: new Date().toLocaleDateString(),
        title,
        content,
        likes: [],  // Initialize the likes array
        comments: []
    };

    // Read existing posts from 'posts.json'
    let posts = [];
    try {
        const postsData = fs.readFileSync('./data/posts.json', 'utf8');
        posts = JSON.parse(postsData);
    } catch (error) {
        console.error('Error reading posts.json:', error.message);
    }

    // Add the new post
    posts.unshift(newPost);

    // Write the updated posts back to 'posts.json'
    fs.writeFile('./data/posts.json', JSON.stringify(posts, null, 2), (err) => {
        if (err) {
            console.error('Error writing to posts.json:', err.message);
            return res.status(500).json({ success: false, error: 'Error saving post' });
        }

        res.status(200).json(newPost);
    });
});

app.post('/likePost', async (req, res) => {
    try {
        console.log(req.body);

        var { postId, userId } = req.body;
        let posts;

        try {
            const postsData = fs.readFileSync('./data/posts.json', 'utf8');
            posts = JSON.parse(postsData);
            console.log('READ');
        } catch (error) {
            console.error('Error reading posts.json:', error.message);
        }

        // Find the post by ID
        var post = posts.find(post => post.id === postId);
        console.log(post);

        if (post) {
            // Check if the user has already liked the post
            if
            // Disabling for demo: User can like a post infinite nr of times  
            //(!post.likes.includes(userId)) 
            (true)
            {
                // Add the user ID to the likes array
                post.likes.push(userId);

                // Update the posts array
                fs.writeFile('./data/posts.json', JSON.stringify(posts, null, 2), (err) => {
                    if (err) {
                        console.error('Error adding like to posts.json:', err.message);
                        return res.status(500).json({ success: false, error: 'Error Liking Post' });
                    }
            
                    res.status(200).json({ success: true, message: 'Post liked successfully.' });
                });

               // res.json({ success: true, message: 'Post liked successfully.' });
            } else {
                res.status(400).json({ success: false, message: 'User has already liked the post.' });
            }
        } else {
            res.status(404).json({ success: false, message: 'Post not found.' });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, message: 'Internal server error.' });
    }
});

app.post('/addComment', async (req, res) => {
    try {
        console.log(req.body);

        var { postId, userId, date, content } = req.body;
        let posts;

        try {
            const postsData = fs.readFileSync('./data/posts.json', 'utf8');
            posts = JSON.parse(postsData);
            console.log('READ');
        } catch (error) {
            console.error('Error reading posts.json:', error.message);
        }

        // Find the post by ID
        var post = posts.find(post => post.id === postId);
        
        const newComment = {
            id: generateUniqueId(), // Assign a unique comment ID
            postId,
            userId,
            date: new Date().toLocaleDateString(),
            content
        };

        if (post) {

                // Add the user ID to the likes array
                post.comments.push(newComment);

                // Update the posts array
                fs.writeFile('./data/posts.json', JSON.stringify(posts, null, 2), (err) => {
                    if (err) {
                        console.error('Error adding comment to posts.json:', err.message);
                        return res.status(500).json({ success: false, error: 'Error Adding Comment' });
                    }
            
                    res.status(200).json(newComment);
                });

        } else {
            res.status(404).json({ success: false, message: 'Post not found.' });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, message: 'Internal server error.' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
