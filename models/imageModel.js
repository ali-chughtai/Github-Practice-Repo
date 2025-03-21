const { DataTypes } = require('sequelize');
const sequelize = require('../config/databse.js'); // Import Sequelize instance

const Image = sequelize.define('Image', {
  _id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey : true
  },
  image_cloud_id: {
    type: DataTypes.STRING,
    allowNull: false,
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



module.exports = Image;

const Post = require('./postModel.js');

// ✅ Define association properly
Post.hasMany(Image, { foreignKey: 'post_id', as: 'Photos' });
Image.belongsTo(Post, { foreignKey: 'post_id', as: 'Post' });