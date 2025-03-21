const express = require("express");
const { createPost, uploadImages, getImages, getSinglePost, deletePost, personalFeedPost, updatePost, delImage } = require("../controllers/postController.js");
const {authenticateAndAuthorization} = require("../middleware.js");
const multer = require('multer')
// const multParse = multer()

const uploadMiddleware = require("../middlewares/uploadMiddleware.js");
const upload = uploadMiddleware("Instagram Clone");



const router = express.Router();

// Routes
router.post("/create-post", authenticateAndAuthorization(["user"]), upload.array('files',5), createPost);
router.post("/create-image",  upload.array('files',5) , uploadImages); // helper routes
router.get("/get-image", getImages); // helper routes
router.get("/get-single-post/:postId", authenticateAndAuthorization(["user"]) , getSinglePost);
router.delete("/delete-post/:postId" , authenticateAndAuthorization(["user"]), deletePost);
router.get("/personalFeedPosts" , authenticateAndAuthorization(["user"]), personalFeedPost);
router.patch("/update-post/:postId" , authenticateAndAuthorization(["user"]), updatePost);
router.delete("/delete-image" , delImage);
router.get("/specific-user-post/:userId" , authenticateAndAuthorization(["user"]), personalFeedPost);









module.exports = router;
