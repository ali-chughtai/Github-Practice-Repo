const { DataTypes } = require('sequelize');
const sequelize = require('../config/databse.js'); // Import Sequelize instance

const Comment = sequelize.define('Comment', {
  _id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey : true
  },
  comment: {
    type:DataTypes.STRING,
    allowNull: false
  },
  postedByUser:{
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



module.exports = Comment;

const Post = require('./postModel.js');

// ✅ Define association properly
Post.hasMany(Comment, { foreignKey: 'post_id', as: 'Comments' });
Comment.belongsTo(Post, { foreignKey: 'post_id', as: 'Post' });