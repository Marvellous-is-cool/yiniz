export const BallAnim = () => {
  window.addEventListener("load", function () {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");

    // Function to set canvas size to full width and height of the section
    function setCanvasSize() {
      canvas.width = document.querySelector(".loading").clientWidth;
      canvas.height = document.querySelector(".loading").clientHeight;
    }

    // Set canvas size when the window is resized
    window.addEventListener("resize", setCanvasSize);

    // Set canvas size initially
    setCanvasSize();

    const BALL_SIZE = 20;
    const BALL_COLOR = "red";
    const YINIZ_TEXT = "YINIZ";
    const TEXT_SIZE = 48;

    // Function to draw a ball
    function drawBall(x, y) {
      ctx.beginPath();
      ctx.arc(x, y, BALL_SIZE, 0, Math.PI * 2);
      ctx.fillStyle = BALL_COLOR;
      ctx.fill();
      ctx.closePath();
    }

    // Function to draw 'YINIZ' text
    function drawYINIZ(x, y) {
      ctx.font = `${TEXT_SIZE}px Arial`;
      ctx.fillStyle = "white";
      ctx.fillText(YINIZ_TEXT, x, y);
    }

    // Function to animate balls
    function animateBalls() {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw balls at random positions
      for (let i = 0; i < 50; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        drawBall(x, y);
      }

      // Request animation frame
      requestAnimationFrame(animateBalls);
    }

    // Function to display 'YINIZ' text
    function displayYINIZ() {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw 'YINIZ' at the center of the canvas
      const textX = (canvas.width - ctx.measureText(YINIZ_TEXT).width) / 2;
      const textY = (canvas.height + TEXT_SIZE) / 2;
      drawYINIZ(textX, textY);

      // Hide 'YINIZ' after 30 seconds
      setTimeout(animateBalls, 30000);
    }

    // Start animating balls
    animateBalls();

    // Display 'YINIZ' every 30 minutes
    setInterval(displayYINIZ, 1800000);
  });
};
