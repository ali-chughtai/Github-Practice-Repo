const { DataTypes } = require('sequelize');
const sequelize = require('../config/databse.js'); // Import Sequelize instance

const Post = sequelize.define('Post', {
  _id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey : true
  },
  caption: {
    type: DataTypes.STRING,
  },
  postedByUser:{
    type : DataTypes.UUID,
    allowNull: false,
    references:{
      model : "Users",
      key : "_id"
    },
    onDelete: 'CASCADE'
  }
  
});




module.exports = Post;
