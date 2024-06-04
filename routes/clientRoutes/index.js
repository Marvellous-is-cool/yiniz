// index.js
const express = require("express");
const router = express.Router();
const businessRouter = require("./business");
const blogRouter = require("./blog");
const gamesRouter = require("./games");
const edutechRouter = require("./edutech");
const assignmentRouter = require("./submitAss");

// Landing Page Route
router.get("/", (req, res) => {
  // Define content for 'business', 'news', 'games', and 'education' cards
  const cards = [
    {
      title: "Business",
      content: "Explore our business hub for networking and opportunities.",
      link: "/ecommerce",
      src: "business",
      explore:
        "Yiniz-mmerce is the perfect place for you to get connected easily and fast with your needs, ranging from all sorts of products and services to the best pick of the week. You don't want to miss out!. And of cause you get to sell yours as well, you will be surprised at how immersive and utterly simple we made this for y'all!!. Click below to explore now...",
      tag: "🛒 Start Shopping",
    },
    {
      title: "Blog",
      content: "Stay informed with the latest news, stories and updates.",
      link: "/blog",
      src: "blog",
      explore:
        "Want to know the latest, trending and hot news? Yiniz-blog is the spot we drop what's on spot, news of different categories ranging from Sport, Entertainment, Law, Crime, Economy, and lots more. And of cause, it's a story spot as well, stories never get old here, and you will always come back cuz we have many for you!. Click below to explore now...",
      tag: "📰 Go to Yiniz-Blog",
    },
    {
      title: "Edu-Tech",
      content: "Unlock knowledge and learning opportunities.",
      link: "/edu",
      src: "edutech",
      explore:
        "With incorporation of materials in videos, articles and documents formats, your research ends here.. Yiniz-edu has got tons of materials to help you get along well during your educational journey. We have organizations setting tests for their students through our edu platform and you might have done one ir two here yourself! Let's see some documents or two....",
      tag: "🎓 To Yiniz-edu",
    },
    {
      title: "Games",
      content: "Discover the gaming world and join the fun.",
      link: "/games",
      src: "games",
      explore:
        "Oooh some games for relaxation eh? Well, not just relaxation but also an extra income for you!. Yes, you heard that right! You get to earn while you play any of Yiniz-games and we have got lots of them to never get you bored!. Let's play some games ad earn buddy!!",
      tag: "🎮 Gaming section",
    },
  ];

  res.render("index", { cards });
});

// Ecommerce (business) Route
router.use("/ecommerce", businessRouter);

// Blog (news) Route
router.use("/blog", blogRouter);

// Games Route
router.use("/games", gamesRouter);

// Edutech Route
router.use("/edu", edutechRouter);

router.use("/yap", assignmentRouter);

module.exports = router;
