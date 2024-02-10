const hid_show = (elem, opt) => {
  if (opt === "hide") {
    elem.classList.remove("animate__fadeIn");
    elem.classList.add("animate__fadeOut");

    // Delay before hiding the element
    setTimeout(() => {
      elem.style.display = "none";
    }, 500);
  } else if (opt === "show") {
    elem.classList.remove("animate__fadeOut");
    elem.classList.add("animate__fadeIn");
    // Delay before showing the element
    setTimeout(() => {
      elem.style.display = "flex";
      elem.style.flexDirection = "column";
    }, 500);
  }
};

const add_eff2 = (elem, det) => {
  if (det === "s") {
    elem.classList.add("slow-smooth-fade-out-element");
    elem.classList.add("animate__pulse");
  } else if (det === "h") {
    elem.classList.remove("slow-smooth-fade-out-element");
    elem.classList.add("animate__pulse");
  }
};

const expand = document.getElementById("expandedPost");
const cards = document.getElementById("Cards");

let expandedPostId;

function expandPost(postId) {
  expandedPostId = postId;
  console.log(expandedPostId);
  const loadingIndicator = document.getElementById("loadingIndicator");
  const expand = document.getElementById("expandedPost");
  const cards = document.getElementById("Cards");

  // Show loading indicator
  hid_show(loadingIndicator, "show");
  add_eff2(loadingIndicator, "s");

  // Make an AJAX request to fetch the post content based on the postId
  console.log("Post id: ", postId);
  fetch(`/admin/blog/blogger/posts/${postId}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((post) => {
      // Check if the response is empty
      if (!post) {
        throw new Error("Empty response received");
      }
      // Update the expanded post view with fetched post content
      document.getElementById("expandedPostImage").src =
        "/uploads/" + post.image;
      document.getElementById("expandedPostCategory").textContent =
        post.category;
      document.getElementById("expandedPostTitle").textContent = post.title;
      document.getElementById("expandedPostPublisher").textContent =
        "Published by: " + post.blogger_username;
      document.getElementById("expandedPostContent").textContent = post.content;
      document.getElementById("expandedPostLikes").textContent = post.likes;
      document.getElementById("expandedPostDislikes").textContent =
        post.dislikes;

      // Show expanded view of the selected post with animation
      hid_show(expand, "show");
      hid_show(cards, "hide");
      add_eff2(expand, "s");
      add_eff2(cards, "h");

      // Hide loading indicator
      hid_show(loadingIndicator, "hide");
      add_eff2(loadingIndicator, "h");
    })
    .catch((error) => {
      console.error("Error fetching post:", error);
      // Hide loading indicator in case of an error
      hid_show(loadingIndicator, "hide");
    });
}

function toggleBack() {
  hid_show(expand, "hide");
  hid_show(cards, "show");
  add_eff2(expand, "h");
  add_eff2(cards, "s");
}

function likePost() {
  const likeButton = document.getElementById("likeButton");
  const dislikeButton = document.getElementById("dislikeButton");

  // Disable like and dislike buttons
  likeButton.disabled = true;
  dislikeButton.disabled = true;

  // Send a POST request to the server to like the post using the global expandedPostId
  fetch(`/blog/like/${expandedPostId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ expandedPostId }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to like post");
      }
      // Log response for debugging
      console.log("Response:", response);
      return response.json();
    })
    .then((post) => {
      // Log post for debugging
      console.log("Post:", post);
      // Update likes count if post.likes is defined and a number
      if (typeof post.likes === "number" && !isNaN(post.likes)) {
        document.getElementById("expandedPostLikes").textContent = post.likes;
        // Hide 'liked post' text after 2 seconds and restore the like emoji
        likeButton.innerHTML =
          "👍 <span id='expandedPostLikes'>" + post.likes + "</span>";
        setTimeout(() => {
          likeButton.innerHTML =
            "👍 <span id='expandedPostLikes'>" + post.likes + "</span>";
        }, 2000);
      } else {
        console.error("Invalid likes count:", post.likes);
      }
    })
    .catch((error) => {
      console.error("Error liking post:", error);
      // Re-enable like and dislike buttons in case of error
      likeButton.disabled = false;
      dislikeButton.disabled = false;
    });
}

function dislikePost() {
  const likeButton = document.getElementById("likeButton");
  const dislikeButton = document.getElementById("dislikeButton");

  // Disable like and dislike buttons
  likeButton.disabled = true;
  dislikeButton.disabled = true;

  // Send a POST request to the server to dislike the post using the global expandedPostId
  fetch(`/blog/dislike/${expandedPostId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ expandedPostId }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to dislike post");
      }
      // Log response for debugging
      console.log("Response:", response);
      return response.json();
    })
    .then((post) => {
      // Log post for debugging
      console.log("Post:", post);
      // Update dislikes count if post.dislikes is defined and a number
      if (typeof post.dislikes === "number" && !isNaN(post.dislikes)) {
        document.getElementById("expandedPostDislikes").textContent =
          post.dislikes;
        // Hide 'disliked post' text after 2 seconds and restore the dislike emoji
        dislikeButton.innerHTML =
          "👎 <span id='expandedPostDislikes'>" + post.dislikes + "</span>";
        setTimeout(() => {
          dislikeButton.innerHTML =
            "👎 <span id='expandedPostDislikes'>" + post.dislikes + "</span>";
        }, 2000);
      } else {
        console.error("Invalid dislikes count:", post.dislikes);
      }
    })
    .catch((error) => {
      console.error("Error disliking post:", error);
      // Re-enable like and dislike buttons in case of error
      likeButton.disabled = false;
      dislikeButton.disabled = false;
    });
}

console.log(expandedPostId);
