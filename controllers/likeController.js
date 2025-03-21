const { where } = require("sequelize");
const like = require("../models/likesModel");



const addLike = async (req, res) => {
  try {
    const {postId} = req.params
    const likedByUser = req.user._id;
    
    const Like = await like.findOne({
        where : {
            post_id : postId,
            likedByUser : likedByUser
        }
         });
    if(!Like){
       const Like = await like.create({  likedByUser, post_id : postId });
       if(!Like){
       return res.status(500).json({
            Message: "Like Addition Unsuccesful"
        })
    }
    return res.status(201).json({
        Message : "Like Added Successfully",
        Like
    })
    }     
    return res.status(200).json({
        Message : "Post already liked by user",
    })

    // const Like = await like.create({  likedByUser, post_id : postId });
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to Add Like' });
  }
};

const getAllLikes = async(req,res) => {
    try {
        const {postId} = req.params;
        const Like = await like.findAll({
            where: {
                post_id : postId
            }
        });
        if(!Like){
            res.status(500).json({
                Message: "Like Fetching Unsuccesful"
            })
        }
        res.status(201).json({
            Message : "Like Fetched Successfully",
            Like
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Failed to display Likes of this post' });

    }
}


const unlikePost = async(req,res) => {
        try {
            const {postId} = req.params;
            
            const Like = await like.destroy({
                where: {
                    likedByUser : req.user._id,
                    post_id : postId
                }
            });
            if(!Like){
                res.status(500).json({
                    Message: "Failed to unlike the post"
                })
            }
            res.status(201).json({
                Message : "Unliked the post Successfully",
                Like
            })
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Failed to unlike the post' });
    
        }
}





module.exports = { addLike , getAllLikes, unlikePost  };
