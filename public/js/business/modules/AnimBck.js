export const AnimBck = () => {
  // Execute the animation when the document is fully loaded
  document.addEventListener("DOMContentLoaded", function () {
    createCircles();
  });

  function createCircles() {
    const circlesContainer = document.getElementById("circles-container");

    for (let i = 0; i < 10; i++) {
      const circle = document.createElement("li");
      circlesContainer.appendChild(circle);
      setPosition(circle);
    }
  }

  function setPosition(circle) {
    const randomX = Math.random() * window.innerWidth;
    const randomY = Math.random() * window.innerHeight;
    circle.style.left = `${randomX}px`;
    circle.style.top = `${randomY}px`;
  }
};
