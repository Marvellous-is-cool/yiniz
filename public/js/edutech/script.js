import { AnimDisp } from "./modules/linksToggle.js";
import { DocInfo } from "./modules/DocInfo.js";
import { videoConfig, videoScript } from "./modules/videoConfig.js";
import { Scroll } from "../modules/scroll.js";

function toggleReadMore() {
  var bodyContainer = document.querySelector(".arti_body-container");
  var readMoreBtn = document.querySelector(".read-more-btn");

  // Toggle the max-height property to show/hide content
  if (bodyContainer.style.maxHeight) {
    bodyContainer.style.maxHeight = null;
    readMoreBtn.innerText = "Read Less";
  } else {
    bodyContainer.style.maxHeight = "120px"; // Set the maximum height
    readMoreBtn.innerText = "Read More";
  }
}

AnimDisp();
DocInfo();
videoConfig();
videoScript();
Scroll("main-header");
Scroll("main-header2");
