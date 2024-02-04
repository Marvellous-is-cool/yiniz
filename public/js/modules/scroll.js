export const Scroll = (elem) => {
  // Add this JavaScript code to a new file named scroll.js
  $(document).ready(function () {
    var lastScrollTop = 0;

    $(window).scroll(function () {
      var st = $(this).scrollTop();

      // Check if the user is scrolling up
      if (st < lastScrollTop) {
        // Add a class to the header for animation
        $(elem).addClass("header-up");
      } else {
        // Remove the class when scrolling down
        $(elem).removeClass("header-up");
      }

      // Toggle the box shadow class
      if (st > 50) {
        $("#main-header").addClass("scrolled");
      } else {
        $("#main-header").removeClass("scrolled");
      }

      lastScrollTop = st;
    });
  });
};
