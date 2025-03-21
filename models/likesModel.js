const { DataTypes } = require('sequelize');
const sequelize = require('../config/databse.js'); // Import Sequelize instance

const Like = sequelize.define('Like', {
  _id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey : true
  },
  likedByUser:{
    type : DataTypes.UUID,
    allowNull: false,
    references:{
      model : "Users",
      key : "_id"
    },
    onDelete: 'CASCADE'
  },
  post_id:{
    type : DataTypes.UUID,
    allowNull: false,
    references:{
      model : "Posts",
      key : "_id"
    },
    onDelete: 'CASCADE'
  }
  
});



module.exports = Like;
const Post = require('./postModel.js');

// ✅ Define association properly
Post.hasMany(Like, { foreignKey: 'post_id', as: 'Likes' });
Like.belongsTo(Post, { foreignKey: 'post_id', as: 'Post' });