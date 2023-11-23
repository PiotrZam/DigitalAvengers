// profile.js

$(document).ready(function () {
    // Fetch user information
    $.ajax({
        url: "/getUserProfile", // Update with the actual endpoint in your server.js
        type: "GET",
        dataType: "json",
        success: function (userInfo) {
            // Update the DOM with user information
            console.log(userInfo)
            updateUserInfo(userInfo);
        },
        error: function () {
            console.error("Error fetching user information from the server.");
        }
    });

    // Fetch user's post history
    $.ajax({
        url: "/getUserPosts", // Update with the actual endpoint in your server.js
        type: "GET",
        dataType: "json",
        success: function (userPosts) {
            // Update the DOM with user's post history
            
            updateUserPosts(userPosts);
        },
        error: function () {
            console.error("Error fetching user's post history from the server.");
        }
    });

    // Function to update the DOM with user information
    function updateUserInfo(userInfo) {
        $(".profile-picture").attr("src", userInfo.profilePicture);
        $("#profile-name").text(userInfo.firstName + " " + userInfo.lastName);
        $("#profile-description").text(userInfo.description);
        $("#profile-email").text("Email: " + userInfo.emailAddress);
        $("#profile-phone").text("No: " + userInfo.phone);
        // Create a clickable link for the user's website
        const websiteLink = $('<a>').attr('href', userInfo.website).attr('target', '_blank').text(userInfo.website);

        // Append the link to the user-info div
        $('.user-info').append($('<p>').append(websiteLink));
    }

    function createPostElement(id, author, date, title, content, likes, comments) {

        let likesCount = 0;
        if(likes !== null) 
        {
            likesCount = likes.length
        }
    
        let commentsCount = 0;
        if (comments !== null) {
            commentsCount = comments.length;
        }
    
        const postElement = $("<div>").addClass("post");
        postElement.html(`
            <input type="hidden" class="post-id" value="${id}">
            <div class="post-header">
                <span class="author">${author}</span>
                <span class="date">${date}</span>
            </div>
            <h2 class="title">${title}</h2>
            <p class="contents">${content}</p>
    
        <div class="reactions-container">
            <div class="like-container">
                <button class="like-button" onclick="likePost(this)">
                    <i class="far fa-thumbs-up"></i> Like
                </button>
                <div class="likesCount">
                    <p class="likesCountText">${likesCount}</p>
                </div>
            </div>
            <div class="comment-container">
                <button class="comment-button" onclick="toggleComments(this)">
                    <i class="far fa-comment"></i> Comment
                </button>
                <div class="commentsCount">
                    <p class="commentsCountText">${commentsCount}</p>
                </div>
            </div>
        </div>
    
        <div class="add-comment-form" style="display: none;">
                    <textarea class="comment-textarea" placeholder="Add a comment"></textarea>
                    <button class="add-comment-button" onclick="addComment(this)">Post</button>
        </div>
    
        <div class="comments-section">
        </div>
        `);
    
        return postElement;
    }

    function displayComments(postElement, comments) {
        const commentsSection = postElement.find('.comments-section');
        commentsSection.empty(); // Clear previous comments to avoid duplication
    
        comments.forEach(comment => {
            let commentDiv = generateCommentHTML(comment);
            commentsSection.append(commentDiv);
        });
    }

    // Function to update the DOM with user's post history
    function updateUserPosts(userPosts) {
        const postsWrapper = $(".posts-wrapper");

        // Clear existing posts from the wrapper
        postsWrapper.empty();

        // Add each post to the wrapper
        userPosts.forEach(function (post) {
            const newPost = createPostElement(post.id, post.author, post.date, post.title, post.content, post.likes, post.comments);
            displayComments(newPost, post.comments);
            postsWrapper.append(newPost);
        });
    }

});
