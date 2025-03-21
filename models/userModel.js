const { DataTypes } = require('sequelize');
const sequelize = require('../config/databse.js'); // Import Sequelize instance
const bcrypt = require("bcrypt");
const Comment = require('./commentModel.js');
const Like = require('./likesModel.js');
const Post = require('./postModel.js');
const Follower = require('./followingModel.js');
const salt = 10;

const User = sequelize.define('User', {
  _id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey : true
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  bio: {
    type: DataTypes.STRING
  },
  profilePicture: {
    type : DataTypes.STRING
  },
  role:{
    type : DataTypes.STRING,
    defaultValue : "user"
  }
});

User.beforeCreate( async (user)=>{
  if(user.password){
    user.password = await bcrypt.hash(user.password, salt);
  }
})

User.beforeUpdate( async (user)=>{
  if(user.changed("password")){
    user.password = await bcrypt.hash(user.password, salt);
  }
})

User.hasMany(Comment, { foreignKey: 'postedByUser', as: 'UserComments' });
Comment.belongsTo(User, { foreignKey: 'postedByUser', as: 'CommentedBy' });

User.hasMany(Like, { foreignKey: 'likedByUser', as: 'UserLikes' });
Like.belongsTo(User, { foreignKey: 'likedByUser', as: 'LikedBy' });

User.hasMany(Post, { foreignKey: 'postedByUser', as: 'UserPosts' });
Post.belongsTo(User, { foreignKey: 'postedByUser', as: 'PostedBy' });

User.hasMany(Follower, { foreignKey: "follower", as: "Followees" });
Follower.belongsTo(User, { foreignKey: "follower", as: "Followee" });




module.exports = User;