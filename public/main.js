// main.js
var userId = '1234';

$(document).ready(function () {
    const addPostButton = $("#add-post-button");
    const postForm = $("#post-form");
    const dashboard = $(".dashboard");
    const postsWrapper = $("#posts-wrapper");

     // Fetch posts when the page is loaded or refreshed
     fetchPosts();

    addPostButton.on("click", function () {
        // Blur the background
        postsWrapper.addClass("blur");

        // Show the post form
        postForm.show();
    });

    postForm.on("submit", function (event) {
        event.preventDefault();

        // Get values from the form
        const title = $("#post-title").val();
        const content = $("#post-content").val();

        // Send the AJAX request using jQuery
        $.ajax({
            url: "/addPost",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify({ title, content }),
            success: function (response) {
                if (response.success) {
                    // If the server returns a successful response, add the post to the post wrapper
                    const newPost = createPostElement("Your Name", getCurrentDate(), title, content);
                    postsWrapper.prepend(newPost);

                    // Reset the form and hide it
                    postForm.trigger("reset").hide();
                    postsWrapper.removeClass("blur");
                } else {
                    alert("Error adding post. Please try again.");
                }
            },
            error: function () {
                alert("Error adding post. Please try again.");
            }
        });
    });

    $("#cancel-button").on("click", function () {
        // Reset the form and hide it
        postForm.trigger("reset").hide();

        // Remove the blur effect from the background
        postsWrapper.removeClass("blur");
    });


    function fetchPosts() {
        // Fetch posts from the server using jQuery AJAX
        $.ajax({
            url: "/getPosts",
            type: "GET",
            dataType: "json",
            success: function (posts) {
                // Clear existing posts from the the wrapper
                postsWrapper.empty();

                // Add each post to the the wrapper
                posts.forEach(function (post) {
                    const newPost = createPostElement(post.id, post.author, post.date, post.title, post.content, post.likes);
                    postsWrapper.append(newPost);
                });
            },
            error: function () {
                console.error("Error fetching posts from the server.");
            }
        });
    }

    function createPostElement(id, author, date, title, content, likes) {
        const postElement = $("<div>").addClass("post");

        postElement.html(`
            <input type="hidden" class="post-id" value="${id}">
            <div class="post-header">
                <span class="author">${author}</span>
                <span class="date">${date}</span>
            </div>
            <h2 class="title">${title}</h2>
            <p class="contents">${content}</p>
            <div class="like-container">
                <button class="like-button" onclick="likePost(this)">
                    <i class="far fa-thumbs-up"></i> Like
                </button>
                <div class="likesCount">
                    <p class="likesCountText">${likes.length}</p>
                </div>
            </div>
        `);

        return postElement;
    }

});

function likePost(buttonElement) {
    var postElement = buttonElement.closest('.post');
    var postId = postElement.querySelector('.post-id').value;
    var likesCount = postElement.querySelector('.likesCountText');
    console.log(postElement);
    console.log('Like nr: ' + $(likesCount).text());
    console.log('Post liked: ' + postId);

   // if (postId == null) {
        // Create the data to be sent in the request body
        var data = {
                    postId: postId,
                    userId: userId
                };

        // Perform the server request using jQuery
        $.ajax({
            url: '/likePost',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: function (response) {
                    // Handle the success response from the server
                    console.log('Server response:', response);
                    let theCount = parseInt($(likesCount).text()) + 1 
                    $(likesCount).text(theCount); // Assuming the server returns the updated like count
        
            },
            error: function (error) {
                    // Handle the error response from the server
                    console.error('There was a problem with the AJAX request:', error);
            }
        });
//    } else {
  //          console.error('Error: Post element not found.');
    //}
}

function getCurrentDate() {
    const currentDate = new Date();
    const options = { month: "long", day: "numeric", year: "numeric" };
    return currentDate.toLocaleDateString("en-US", options);
}
