export const videoConfig = () => {
  document.addEventListener("DOMContentLoaded", function () {
    const video = document.getElementById("myVideo");
    const playPauseBtn = document.getElementById("playPauseBtn");
    const downloadBtn = document.getElementById("downloadBtn");

    // Play and Pause functionality
    playPauseBtn.addEventListener("click", function () {
      if (video.paused) {
        video.play();
        playPauseBtn.textContent = "Pause";
      } else {
        video.pause();
        playPauseBtn.textContent = "Play";
      }
    });

    // Download functionality
    downloadBtn.addEventListener("click", function () {
      const a = document.createElement("a");
      a.href = video.src;
      a.download = "your-video.mp4"; // Change the filename as needed
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
  });
};

export const videoScript = () => {
  document.addEventListener("DOMContentLoaded", function () {
    const vid = document.getElementById("myVideo");
    const playPauseBtn = document.getElementById("playPauseBtn");

    let playVideo = false;

    const handleVideo = () => {
      playVideo = !playVideo;

      if (playVideo) {
        vid.play();
        playPauseBtn.textContent = "Pause";
      } else {
        vid.pause();
        playPauseBtn.textContent = "Play";
      }
    };

    vid.addEventListener("click", handleVideo);
    playPauseBtn.addEventListener("click", handleVideo);
  });
};
