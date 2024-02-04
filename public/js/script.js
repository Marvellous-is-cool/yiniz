import { Scroll } from "./modules/scroll.js";

$(document).ready(function () {
  $("#home-slider").carousel({
    interval: 3000, // Set your preferred timeout
    pause: "hover",
  });
});

Scroll("#main-header");
