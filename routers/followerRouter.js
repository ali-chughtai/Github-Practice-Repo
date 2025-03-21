const express = require("express");

const { followUser, publicFeed, unfollowUser, getFollowers, getFollowing } = require("../controllers/followerController.js");
const {authenticateAndAuthorization} = require("../middleware.js");




const router = express.Router();

// Routes
router.get("/follow/:follow", authenticateAndAuthorization(["user"]) ,followUser);
router.get("/public-feed", authenticateAndAuthorization(["user"]) ,publicFeed); // feed of the users you are following
router.delete("/unfollow/:follow", authenticateAndAuthorization(["user"]) ,unfollowUser);
router.get("/followers", authenticateAndAuthorization(["user"]) ,getFollowers); // personal followers
router.get("/following", authenticateAndAuthorization(["user"]) ,getFollowing); // personal followings
router.get("/:userId/followers", authenticateAndAuthorization(["user"]) ,getFollowers);
router.get("/:userId/followings", authenticateAndAuthorization(["user"]) ,getFollowing);











module.exports = router;
