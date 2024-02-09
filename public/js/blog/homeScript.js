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

function expandPost(postId) {
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
      document.getElementById("expandedPostDate").textContent =
        "on " + new Date(post.updated_at).toLocaleDateString("en-US");
      document.getElementById("expandedPostContent").textContent = post.content;
      document.getElementById("expandedPostLikes").textContent = post.likes;
      document.getElementById("expandedPostDislikes").textContent =
        post.dislikes;

      // Show expanded view of the selected post with animation
      hid_show(expand, "show");
      hid_show(cards, "hide");
      add_eff2(expand, "s");
      add_eff2(cards, "h");
    })
    .catch((error) => {
      console.error("Error fetching post:", error);
    });
}

function toggleBack() {
  hid_show(expand, "hide");
  hid_show(cards, "show");
  add_eff2(expand, "h");
  add_eff2(cards, "s");
}
