// animationUtils.js

export const hid_show = (elem, opt) => {
  if (opt === "hide") {
    elem.classList.remove("animate__zoomIn");
    elem.classList.add("animate__zoomOut");

    // Delay before hiding the element
    setTimeout(() => {
      elem.style.display = "none";
    }, 500);
  } else if (opt === "show") {
    elem.classList.remove("animate__zoomOut");
    elem.classList.add("animate__zoomIn");
    // Delay before showing the element
    setTimeout(() => {
      elem.style.display = "flex";
    }, 500);
  }
};

export const add_eff = (elem, det) => {
  if (det === "s") {
    elem.classList.add("animate__rubberBand");
    elem.classList.add("text-dark");
    elem.classList.add("slow-smooth-fade-out-element");
  } else if (det === "h") {
    elem.classList.remove("animate__rubberBand");
    elem.classList.remove("text-dark");
    elem.classList.remove("slow-smooth-fade-out-element");
  }
};

export const add_eff2 = (elem, det) => {
  if (det === "s") {
    elem.classList.add("slow-smooth-fade-out-element");
    elem.classList.add("animate__pulse");
  } else if (det === "h") {
    elem.classList.remove("slow-smooth-fade-out-element");
    elem.classList.add("animate__pulse");
  }
};
export const add_eff3 = (elem, det) => {
  if (det === "s") {
    elem.classList.add("animate__fadeInBig");
  } else if (det === "h") {
    elem.classList.remove("animate__fadeInBig");
  }
};
