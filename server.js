const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer'); // Import Multer
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configure Multer
const storage = multer.memoryStorage(); // Store files in memory (you can change this based on your requirements)
const upload = multer({ storage: storage });

// Define a route to serve the homepage (index.html)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Serve CSS files with the appropriate MIME type
app.get('/style.css', (req, res) => {
    res.setHeader('Content-Type', 'text/css');
    res.sendFile(path.join(__dirname, 'public', 'style.css'));
});

app.get('/post.css', (req, res) => {
    res.setHeader('Content-Type', 'text/css');
    res.sendFile(path.join(__dirname, 'public', 'post.css'));
});

// Serve JavaScript files with the appropriate MIME type
app.get('/main.js', (req, res) => {
    res.setHeader('Content-Type', 'application/javascript');
    res.sendFile(path.join(__dirname, 'public', 'main.js'));
});


app.post('/createPost', upload.array('images'), (req, res) => {
    const postData = req.body;

    console.log("Displaying the post data....");
    console.log(postData);

    if (!postData.username || !postData.description) {
        return res.status(400).json({ error: 'Username and description are required.' });
    }

     // Handle uploaded files
     const images = req.files || [];


    // Read and write to 'sample_posts.json'
    fs.readFile('sample_posts.json', 'utf8', (readErr, data) => {
        if (readErr) {
            if (readErr.code === 'ENOENT') {
                // If the file doesn't exist, initialize posts as an empty array
                const posts = [];
                saveAndRespond(res, posts, postData);
            } else {
                console.error('Error reading file:', readErr);
                return res.status(500).json({ error: 'Server error: Could not read post data' });
            }
        } else {
            try {
                const posts = JSON.parse(data);
                saveAndRespond(res, posts, postData);
            } catch (error) {
                console.error('Error parsing JSON:', error);
                return res.status(500).json({ error: 'Server error: Could not parse post data' });
            }
        }
    });
});

app.get('/getPosts', (req, res) => {
    fs.readFile('sample_posts.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return res.status(500).json({ error: 'Server error: Could not read post data' });
        }

        try {
            const posts = JSON.parse(data);
            res.json({ posts });
        } catch (error) {
            console.error('Error parsing JSON:', error);
            return res.status(500).json({ error: 'Server error: Could not parse post data' });
        }
    });
});


function saveAndRespond(res, posts, postData) {
    // Create a new post object
    const newPost = {
        description: postData.description,
        username: postData.username,
        formattedDateTime: new Date().toLocaleString(),
        title: postData.title || '',
        images: postData.images || [],
    };

    // Add the new post to the posts array
    posts.posts.push(newPost);

    // Write the updated data back to the JSON file
    fs.writeFile('sample_posts.json', JSON.stringify(posts, null, 2), 'utf8', (writeErr) => {
        if (writeErr) {
            console.error('Error writing file:', writeErr);
            return res.status(500).json({ error: 'Server error: Could not update post data' });
        }
        return res.status(200).json({ message: 'Post created successfully' });
    });
}

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
