const express = require("express");

const { addComment, getComments, updateComment, deleteComment } = require("../controllers/commentController.js");
const {authenticateAndAuthorization} = require("../middleware.js");




const router = express.Router();

// Routes
router.get("/add-comment/:postId", authenticateAndAuthorization(["user"]) ,addComment);
router.get("/get-comments/:postId", authenticateAndAuthorization(["user"]) ,getComments);
router.patch("/update-comment/:commentId", authenticateAndAuthorization(["user"]) ,updateComment);
router.delete("/delete-comment/:commentId", authenticateAndAuthorization(["user"]) ,deleteComment);




module.exports = router;
