import { Scroll } from "./modules/scroll.js";
import { BallAnim } from "./modules/ballAnim.js";

window.addEventListener("load", function () {
  const loadingSection = document.querySelector(".loading");
  const contentSection = document.querySelector(".content");

  // Hide loading section and show content section after a delay
  setTimeout(function () {
    loadingSection.classList.add("animate__animated", "animate__fadeOutUp");
    contentSection.classList.remove("d-none");
    contentSection.style.display = "block";
    contentSection.classList.add("animate__animated", "animate__fadeIn");
    loadingSection.addEventListener("animationend", function () {
      loadingSection.style.display = "none";
    });
  }, 2000); // Change delay time as needed
  // JavaScript to toggle the visibility of the navigation menu
  document.getElementById("menu-toggle").addEventListener("click", function () {
    var navMenu = document.getElementById("nav-menu");
    navMenu.classList.toggle("animate__animated");
    navMenu.classList.toggle("animate__fadeIn");

    var menuIcon = document.getElementById("menu-icon");
    if (menuIcon.innerText === "Menu") {
      menuIcon.innerText = "X Close";
      navMenu.style.display = "block";
    } else {
      navMenu.classList.remove("animate__animated");
      navMenu.classList.remove("animate__fadeOut");
      menuIcon.innerText = "Menu";
      navMenu.style.display = "none";
    }
  });

  $(document).ready(function () {
    $("#home-slider").carousel({
      interval: 3000, // Set your preferred timeout
      pause: "hover",
    });
  });

  Scroll("#header-stagnat");
  BallAnim();
});
