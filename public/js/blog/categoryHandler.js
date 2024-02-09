// categoryHandler.js

// Function to handle category selection
function handleCategorySelection(category) {
  // Retrieve all news cards
  const newsCards = document.querySelectorAll(".card");

  // Hide all news cards
  newsCards.forEach((card) => {
    card.style.display = "none";
  });

  // Show only the news cards matching the selected category
  const selectedCategoryCards = document.querySelectorAll(
    `[data-category="${category}"]`
  );
  selectedCategoryCards.forEach((card) => {
    card.style.display = "block";
  });
}

// Event listeners for category selection
document.addEventListener("DOMContentLoaded", () => {
  // Retrieve the category dropdown menu
  const categoryDropdown = document.getElementById("categoryDropdown");

  // Attach event listener for category selection
  categoryDropdown.addEventListener("click", (event) => {
    // Retrieve the selected category
    const selectedCategory = event.target.textContent.trim();

    // Handle the category selection
    handleCategorySelection(selectedCategory);
  });
});
