const { where } = require("sequelize");
const follower = require("../models/followingModel");
const User = require("../models/userModel");
const Post = require("../models/postModel");
const Image = require("../models/imageModel");
const Comment = require("../models/commentModel");
const Like = require("../models/likesModel");

const sequelize = require("../config/databse")

const followUser = async(req,res)=>{
    try {

        const {follow} = req.params;
        if( follow === req.user._id){
            return res.status(403).json({
                Message: "Cant Follow Yourself",
            })
        }
        const Follower = await follower.findOne({
            where : {
                followee : req.user._id,
                follower: follow
            }
        })
        if(!Follower){
            const Follower = await follower.create({followee : req.user._id , follower : follow})
            if(!Follower){
                res.status(500).json({
                    Message: "Coudnt Follow the person"
                })
            }
           return res.status(201).json({
                Message: "Follow the person successfully",
                Follower
            })
        }

        return res.status(200).json({
            Message: "You Already follow this person",
        })

        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            Message: "Coudnt Follow the person"
        })
    }
}

const publicFeed = async(req,res) => {
    try {
        console.log("User Associations: ", User.associations)
        const feed = await follower.findAll({
            where: { followee: req.user._id },
            include: [
                {
                    model: User,
                    as: "Followee",
                    attributes: ["_id", "username", "profilePicture"],
                    include: [
                        {
                            model: Post,
                            as: "UserPosts",
                            attributes: ["_id", "caption"],
                            include: [
                                {
                                    model: Image,
                                    as: "Photos",
                                    attributes: ["_id", "image_cloud_id"],
                                },
                                {
                                    model: Comment,
                                    as: "Comments",
                                    attributes: ["_id", "comment"],
                                    include: [
                                        {
                                            model: User,
                                            as: "CommentedBy",
                                            attributes: ["_id", "username", "profilePicture"],
                                        },
                                    ],
                                },
                                {
                                    model: Like,
                                    as: "Likes",
                                    attributes: ["_id", "likedByUser"],
                                    include: [
                                        {
                                            model: User,
                                            as: "LikedBy",
                                            attributes: ["_id", "username", "profilePicture"],
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
            ],
        });

        if(!feed) {
            return res.status(404).json({
                Message: "Coudn't Fetch Feed"
            })
        }

        return res.status(200).json({
            Message: "Success",
            feed
        })
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            Message: "Coudn't Fetch Feed"
        })
    }
}

const unfollowUser = async(req,res)=>{
    try {

        const {follow} = req.params;
        if( follow === req.user._id){
            return res.status(403).json({
                Message: "Cant Unfollow Yourself",
            })
        }
        const Follower = await follower.destroy({
            where : {
                followee : req.user._id,
                follower: follow
            }
        })
        if(!Follower){
                return res.status(404).json({
                    Message: "Coudnt Follow the person"
                })
            }
        
        
        return res.status(201).json({
                Message: "Unfollowed the person successfully",
                Follower
        })

    }catch (error) {
        console.log(error);
        return res.status(500).json({
            Message: "Coudnt Unfollow the person"
        })
    }
}

const getFollowers = async(req,res)=>{

    try {

        const {userId} = req.params;

        const Followers = await sequelize.query(`
            SELECT 
              f."followee",
              u."_id", 
              u."username", 
              u."profilePicture"
            FROM 
              "Followers" AS f
            INNER JOIN 
              "Users" AS u ON f."followee" = u."_id"
            WHERE 
              f."follower" = :userId
          `, {
            replacements: { userId: userId ?? req.user._id },
            type: sequelize.QueryTypes.SELECT,
            raw: true,
            nest: true
          });

        if(!Followers){
            return res.status(404).json({
                Message: "User Not Found"
            })
        }

        return res.status(200).json({
            Message: "Success",
            Followers
        })

        

    } catch (error) {
        console.log(error)
        return res.status(404).json({
            Message: "Internal Server Error"
        })
    }
}


const getFollowing = async(req,res)=>{

    try {
        const {userId} = req.params
        const Following = await follower.findAll({
            where : {followee : userId ?? req.user._id},
            include : {
                model: User,
                as : "Followee",
                attributes : ["_id", "username" , "profilePicture"]
            }
        })

        if(!Following){
            return res.status(404).json({
                Message: "User Not Found"
            })
        }

        return res.status(200).json({
            Message: "Success",
            Following
        })

        

    } catch (error) {
        console.log(error)
        return res.status(404).json({
            Message: "Internal Server Error"
        })
    }
}







module.exports = { followUser, publicFeed, unfollowUser, getFollowers, getFollowing};
