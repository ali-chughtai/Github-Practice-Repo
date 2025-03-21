const express = require("express");
const { createUser, getAllUsers, updateUser, deleteUser, loginUser, personalInfo } = require("../controllers/userController.js");

const router = express.Router();

const uploadMiddleware = require("../middlewares/uploadMiddleware.js");
const { authenticateAndAuthorization } = require("../middleware.js");
const upload = uploadMiddleware("Profile Pictures");


// Routes
router.post("/create-user", upload.single('file') ,  createUser);
router.get("/all-users", getAllUsers);
router.patch("/update-user",authenticateAndAuthorization("user"),  upload.single('file'), updateUser);
router.delete("/delete-user", authenticateAndAuthorization("user"),  deleteUser);
router.post("/login-user", loginUser);
router.get("/personal-info" , authenticateAndAuthorization("user"), personalInfo);



module.exports = router;
