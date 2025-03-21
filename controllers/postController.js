const { where } = require("sequelize");
const post = require("../models/postModel");
const image = require("../models/imageModel.js")


const { uploadImage } = require("../cloudinary/cloudinary.js");
const { response } = require("express");
const cloudinary  = require("../cloudinary/cloudinary.js");
const User = require("../models/userModel.js");
const Like = require("../models/likesModel.js");
const Image = require("../models/imageModel.js");
const Comment = require("../models/commentModel.js");





const createPost = async (req, res) => {
  const { caption } = req.body;
  const postedByUser = req.user._id;
  // console.log("Posted By: ", req.user);
  try {
    const Post = await post.create({ caption, postedByUser });
    if(!Post){
    res.status(500).json({ error: 'Failed to create post' });
    }
    const imagesStoredInDB = await uploadImages(req,res,Post._id);

    res.status(201).json({
      Post,
      imagesStoredInDB
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create post' });
  }
};



const uploadImages = async(req, res,post_id) => {
  try {

    const uploadedFiles = req.files;
    console.log("\nUploaded Files:  ===> ",uploadedFiles);

    const uploadResults = [];

    for (const file of uploadedFiles) {
      // const result = await cloudinary.uploader.upload(file.path); // Upload to Cloudinary
      let imageToBeStoredInDb = await image.create({image_cloud_id : file.filename , post_id }) 
      uploadResults.push(imageToBeStoredInDb); // Store the secure URL
    }

    return uploadResults;
  } catch (error) {
    console.error('Upload Error:', error);
  }
}

const getImages = async(req,res)=>{
  try {
    console.log("\nGet Image route image path =====> ",req.body)
    const result = await cloudinary
    .api.resource(req.body.image)
    
    res.status(200).json({
      message: 'Success',
      result : result
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Failed to get file' });

  }
}

const delImage = async(req,res) => {
  try {
    console.log("\delete Image route image path =====> ",req.body)
    const result = await cloudinary.uploader.destroy(req.body.image);

    
    res.status(200).json({
      message: 'Success',
      result : result
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Failed to delete file' });

  }
}

const getSinglePost = async (req, res) => {
  try {
    const { postId } = req.params;
    console.log("\n\n =========> ",post.associations);
console.log(Comment.associations);

    const postData = await post.findOne({
      where: { _id: postId },
      include: [
        {
          model: User,
          as: 'PostedBy', // Use the same alias defined in the association
          attributes: ["_id", "profilePicture", "username"],
        },
        {
          model: Image,
          as: 'Photos', // Use the same alias defined in the association
          attributes: ["_id", "image_cloud_id"],
        },
        {
          model: Comment,
          as: 'Comments', // Use the same alias defined in the association
          attributes: ["_id", "comment"],
          include: [
            {
              model: User,
              as : 'CommentedBy',
              attributes: ["_id", "profilePicture", "username"],
            },
          ],
        },
        {
          model: Like,
          as : 'Likes',
          attributes: ["_id"],

          include: [
            {
              model: User,
              as : 'LikedBy',
              attributes: ["_id", "profilePicture", "username"],
            },
          ],
        },
      ],
    });

    if (!postData) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.status(200).json({ postData });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to fetch post' });
  }
};


const deletePost = async (req,res) => {
  try {
    const {postId} = req.params
    console.log("Delete post API req params =====> ",req.params)
    const Post = await post.destroy(
      {
      where:{
        _id : postId
      }}
    )
    if(!Post){
      return res.status(500).json({
        Message: "Post was not deleted."
      })
    }
    
    return res.status(200).json({
      Message : "Post deleted Successfully",
      DeletedPost: Post
    })
    
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      Message: "Post was not deleted."
    })
  }
}

const personalFeedPost = async (req,res) => {
  try {
    const {userId} = req.params;
    const Post = await post.findAll({
      where:{
        postedByUser :  userId ?? req.user._id,
      },
      attributes : ["_id","caption","createdAt"],
      include:[
        {
          model: Image,
          as: 'Photos', // Use the same alias defined in the association
          attributes: ["_id", "image_cloud_id"],
        },
        {
          model: Comment,
          as: 'Comments', // Use the same alias defined in the association
          attributes: ["_id", "comment"],
          include: [
            {
              model: User,
              as : 'CommentedBy',
              attributes: ["_id", "profilePicture", "username"],
            },
          ],
        },
        {
          model: Like,
          as : 'Likes',
          attributes: ["_id"],

          include: [
            {
              model: User,
              as : 'LikedBy',
              attributes: ["_id", "profilePicture", "username"],
            },
          ],
        },
      ]
    })

    if(!Post){
      return res.status(500).json({
        Message: "Coudln't Fetch Posts.."
      })
    }
    
    return res.status(200).json({
      Message : "Post Fetched successfully",
      Post
    })
    
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      Message: "Coudln't Fetch Posts."
    })
  }
}

const updatePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const caption = req.body.caption; 
    const imagesToDelete = req.body.images || []; 

    console.log("\nUpdate post route images array: ", imagesToDelete, " Caption: ", caption, " Post Id: ", postId);

    // Find post
    const Post = await post.findOne({ where: { _id: postId } });
    if (!Post) {
      return res.status(404).json({ Message: "Post was not found." });
    }

    const deletedImages = [];
    for (const imageId of imagesToDelete) {
      const imageToBeDeleted = await Image.findOne({ where : {_id: imageId}})
      console.log("Image Url to be deleted from cloudinary =======> ",imageToBeDeleted.image_cloud_id)
      await cloudinary.uploader.destroy(imageToBeDeleted.image_cloud_id);
      const deletedImage = await Image.destroy({ where: { _id: imageId } });
      deletedImages.push(deletedImage);
    }

    await Post.update({ caption }, { where: { _id: postId } });

    return res.status(200).json({
      Message: "Post updated successfully",
      updatedPost: Post,
      DeletedImages: deletedImages,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ Message: "Post was not updated." });
  }
};

module.exports = { createPost, uploadImages, getImages , getSinglePost, deletePost, personalFeedPost , updatePost, delImage};
