const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const path = require("path");

// Cloudinary Configuration
cloudinary.config({
  cloud_name: 'dgaomkxha',
  api_key: '551564519618164',
  api_secret: "sGT34Q1lX1RB7vP0zIFYpsuxBM8",
});

module.exports = cloudinary;
