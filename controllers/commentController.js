const { where } = require("sequelize");
const comments = require("../models/commentModel");



const addComment = async (req, res) => {
  try {
    const {postId} = req.params
    const postedByUser = req.user._id;
  const { comment } = req.body;

    const Comment = await comments.create({ comment, postedByUser, post_id : postId });
    if(!Comment){
        res.status(500).json({
            Message: "Comment Created Unsuccesful"
        })
    }
    res.status(201).json({
        Message : "Comment Added Successfully",
        Comment
    })
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to Add Comment' });
  }
};

const getComments = async(req,res) => {
    try {
        const {postId} = req.params;
        const Comment = await comments.findAll({
            where: {
                post_id : postId
            }
        });
        if(!Comment){
            res.status(500).json({
                Message: "Comment Fetching Unsuccesful"
            })
        }
        res.status(201).json({
            Message : "Comment Fetched Successfully",
            Comment
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Failed to display comments of this post' });

    }
}

const updateComment = async(req,res) => {
    try {
        const {commentId} = req.params;
        const comment = req.body.comment;
        const Comment = await comments.update({comment} , {where : { _id : commentId }})

        if(!Comment){
            res.status(500).json({
                Message: "Comment Update Unsuccesful"
            })
        }
        res.status(201).json({
            Message : "Comment Update Successfully",
            Comment
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Failed to update comment' });

    }
}

const deleteComment = async(req,res) => {
    try {
        const {commentId} = req.params;
        const Comment = await comments.destroy({where : { _id : commentId }})

        if(!Comment){
            res.status(500).json({
                Message: "Comment Delete Unsuccesful"
            })
        }
        res.status(201).json({
            Message : "Comment Deleted Successfully",
            Comment
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Failed to Delete comment' });

    }
}

const getAllUsers = async (req, res) => {
  try {
    const users = await user.findAll();
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};



module.exports = { addComment , getComments, updateComment, deleteComment};
