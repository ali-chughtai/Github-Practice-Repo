const express = require("express");

const { addLike, getAllLikes, unlikePost } = require("../controllers/likeController.js");
const {authenticateAndAuthorization} = require("../middleware.js");




const router = express.Router();

// Routes
router.get("/add-like/:postId", authenticateAndAuthorization(["user"]) ,addLike);
router.get("/get-likes/:postId", authenticateAndAuthorization(["user"]) ,getAllLikes);
router.delete("/unlike-post/:postId", authenticateAndAuthorization(["user"]) ,unlikePost);





module.exports = router;
