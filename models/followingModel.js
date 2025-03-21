const { DataTypes } = require('sequelize');
const sequelize = require('../config/databse.js'); // Import Sequelize instance

const Follower = sequelize.define('Follower', {
  _id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey : true
  },

  followee:{
    type : DataTypes.UUID,
    allowNull: false,
    references:{
      model : "Users",
      key : "_id"
    },
    onDelete: 'CASCADE'
  },
  follower:{
    type : DataTypes.UUID,
    allowNull: false,
    references:{
      model : "Users",
      key : "_id"
    },
    onDelete: 'CASCADE'
  },
  
});



module.exports = Follower;

const User = require('./userModel.js');

// ✅ Define association properly
