const showFormButton = document.getElementById('show-form');
const postForm = document.getElementById('post-form');
const createPostButton = document.getElementById('create-post');
const postsContainer = document.getElementById('posts');
const imageInput = document.getElementById('image');
const imagePreview = document.getElementById('image-preview');

showFormButton.addEventListener('click', () => {
    postForm.style.display = 'block';
});

// preview image before posting
function previewImage() {
    const file = imageInput.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            imagePreview.src = e.target.result;
            imagePreview.style.display = 'block';
        };
        reader.readAsDataURL(file);
    } else {
        imagePreview.src = '';
        imagePreview.style.display = 'none';
    }
}

// Wait for the page to load
document.addEventListener('DOMContentLoaded', function() {
    console.log('Page loaded');
    // Fetch post data from the server
    fetch('/getPosts')
        .then((response) => {
            if (response.ok) {
                return response.json(); // Parse the response JSON
            } else {
                throw new Error('Failed to fetch posts');
            }
        })
        .then((data) => {
            displayPosts(data.posts);
        })
        .catch((error) => {
            console.error('Error fetching posts:', error);
        });
});


// Function to display posts
function displayPosts(posts) {
    const postsContainer = document.getElementById('posts');
    postsContainer.innerHTML = ''; // Clear existing content
    console.log(posts)

    if (Array.isArray(posts)) {
        posts.forEach((post) => {
            const postElement = createPostElement(post);
            postsContainer.appendChild(postElement);
        });
    } else if (posts && Array.isArray(posts.posts)) {
        // Access the property containing the array of posts
        posts.posts.forEach((post) => {
            const postElement = createPostElement(post);
            postsContainer.appendChild(postElement);
            console.log('post created and appended to posts')

        });
    } else {
        console.error('Invalid or unexpected data received for posts:', posts);
    }
}


// Function to create a post element
function createPostElement(post) {
    const postElement = document.createElement('div');
    postElement.className = 'post';

    const usernameElement = document.createElement('h3');
    usernameElement.textContent = post.username;
    postElement.appendChild(usernameElement);

    const dateTimeElement = document.createElement('p');
    dateTimeElement.textContent = post.formattedDateTime;
    postElement.appendChild(dateTimeElement);

    const descriptionElement = document.createElement('h4');
    descriptionElement.textContent = post.description;
    postElement.appendChild(descriptionElement);

    const titleElement = document.createElement('h5');
    titleElement.textContent = post.title;
    postElement.appendChild(titleElement);

    // Handle images if the post has an image
    if (post.images && post.images.length > 0) {
        const imageElement = document.createElement('img');
        imageElement.src = post.images[0]; // Assuming only one image for simplicity
        imageElement.alt = 'Post Image';
        imageElement.style.maxWidth = '100px'; // Adjust as needed
        postElement.appendChild(imageElement);
    }

    return postElement;
}


createPostButton.addEventListener('click', () => {
    const username = document.getElementById('username').value;
    console.log('username: ' + username);
    const description = document.getElementById('description').value;
    console.log('description: ' + description);
    const title = document.getElementById('title').value; // Get the title input
    const imageInput = document.getElementById('image'); // Get the image input
    const imageFile = imageInput.files[0]; // Get the selected image file

    if (username && description) {
        const post = document.createElement('div');
        post.className = 'post';

        // Get the current date and time
        const currentDateTime = new Date();
        const formattedDateTime = currentDateTime.toLocaleString();

        // Create formData and append data
        const formData = new FormData();
        formData.append('username', username); 
        console.log('added username');
        formData.append('description', description);
        console.log('added description');
        formData.append('title', title); // Append the title if it exists

        console.log(formData);
        console.log(formData.get('description'))
        console.log(formData.get('username'))
        console.log(formData.get('title'))


        const imageInputs = document.querySelectorAll('input[type="file"]');
        imageInputs.forEach((input, index) => {
            const file = input.files[0];
            formData.append('images', file);
        });

        // Iterate through formData entries and log them to console
        console.log('formData.forEach')
        formData.forEach((value, key) => {
            console.log(`${key}: ${value}`);
        });

        post.innerHTML = `
            <h3>${username}</h3>
            <p>${formattedDateTime}</p>
            <h4>${description}</h4>
            <h5>${title}</h5> <!-- Display the title -->
            <img src="${imagePreview.src}" alt="Post Image" style="max-width: 100px;">
        `;

        // Prepend the new post to the postsContainer to display the newest on top
        postsContainer.prepend(post);

        // Clear the input fields and hide the post form
        document.getElementById('username').value = '';
        document.getElementById('description').value = '';
        document.getElementById('title').value = ''; // Reset the title input
        imageInput.value = ''; // Reset the file input
        imagePreview.src = '';
        imagePreview.style.display = 'none';
        postForm.style.display = 'none';

        console.log('sending post data to server');
        // Send the post data to the server using a fetch request
        console.log(formData.username);
        console.log(formData.description);
        fetch('/createPost', {
            method: 'POST',
            body: formData, 
        })
        .then((response) => {
            if (response.ok) {
                console.log('Post data sent successfully.');
            } else {
                console.error('Error sending post data to the server.');
            }
        })
        .catch((error) => {
            console.error('Error sending post data:', error);
        });
    }
});
