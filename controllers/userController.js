const { where } = require("sequelize");
const user = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");



const createUser = async (req, res) => {
  const { username, email, password } = req.body;
  // const { profilePicture } = req.image;
  console.log("\nProfile Picture: ====> ",req.file)
  try {
    const User = await user.create({ username, email, password , profilePicture : req.file.filename});
    res.json({
      Message : "Success",
      User,
      ProfilePicture : req.file.filename
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create user' });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await user.findAll();
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

const updateUser = async (req, res) => {
  try {

    const User = await user.findByPk(req.user._id); 
    if (!User) {
      return res.status(404).json({
        message: "User does not exist"
      });
    }

    // console.log("User info update API req.file: ======> ", req.file)
    
    const updatedUser  = await User.update({
      ...req.body,  
      profilePicture: req.file.filename
    });
    
    
    return res.status(200).json({
      message: "Success",
      user: updatedUser
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to update user" });
  }
};


const deleteUser = async (req,res) => {
  try{

    const User = await user.destroy(
      {where : {
        _id : req.user._id
      }}
    );
    if(!User){
      return res.status(404).json({
        message : "User does not exist"
      })
    }

    return res.status(200).json({
      message: "User Deleted Successfully",
      user: User,
    });
  }
  catch(err) {
    console.log(err);
    res.status(500).json({ error: "Failed to delete user"})
  }
}

const loginUser = async (req,res) => {
  try {
    const {email , password} = req.body;
    const User = await user.findOne({
      where:{
        email : email
      }
    })

    if(!User){
     return res.status(404).json({error : "Email or password incorrect"})
    }

    const match = await bcrypt.compare(password, User.password);
    if(!match){
     return res.status(404).json({error : "Email or password incorrect"})
    }

    const token = jwt.sign({User},"weiuw4y5827rwdho2u37825iufhq@#$@#4289e7ekdjq",{expiresIn:"1d"});
    console.log("\nToken: ",token);

    return res.status(200).json({
      message:"User LoggedIn Succesfully",
      token: token,
      user: User
    })


  } catch (error) {
    console.log(err);
    return res.status.json({error: "Failed to login"})
  }
}

  const personalInfo = async (req,res) => {
    try {
      const User = await user.findOne({
        where:{ _id : req.user._id}
      })

      if(!User){
      return res.status(404).json({error: "Failed to fetch Personal Information"})
      }

      return res.status(200).json({
        Message: "Success",
        User
      })

    } catch (error) {
      console.log(error);
      return res.status(500).json({error: "Failed to fetch Personal Information"})
    }
  }

module.exports = { createUser, getAllUsers, updateUser, deleteUser, loginUser, personalInfo };
