// main.js

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
                    const newPost = createPostElement(post.author, post.date, post.title, post.content);
                    postsWrapper.append(newPost);
                });
            },
            error: function () {
                console.error("Error fetching posts from the server.");
            }
        });
    }

    function createPostElement(author, date, title, content) {
        const postElement = $("<div>").addClass("post");

        postElement.html(`
            <div class="post-header">
                <span class="author">${author}</span>
                <span class="date">${date}</span>
            </div>
            <h2 class="title">${title}</h2>
            <p class="contents">${content}</p>
            <button class="like-button">Like</button>
        `);

        return postElement;
    }

    function getCurrentDate() {
        const currentDate = new Date();
        const options = { month: "long", day: "numeric", year: "numeric" };
        return currentDate.toLocaleDateString("en-US", options);
    }
});
