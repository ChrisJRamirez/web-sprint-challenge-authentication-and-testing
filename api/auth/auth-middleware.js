const express = require("express");
const User = require("../jokes/jokes-model");

// 3- On FAILED registration due to `username` or `password` missing from the request body,
// the response body should include a string exactly as follows: "username and password required".

function validateUser(req, res, next) {
  if(!req.body.username || !req.body.password){
    res.status(400).json({message: "username and password required"})
  }else{
    next()
  }
};

// 4- On FAILED registration due to the `username` being taken,
// the response body should include a string exactly as follows: "username taken".

async function checkUsernameFree(req, res, next) {
  try{
    const users = await User.findBy({username:req.body.username})
    if(!users.length){
      next()
    }
    else next(
      {message:"username taken", status: 422}
    )
  }catch(err){
    next(err)
  }
};

// 4- On FAILED login due to `username` not existing in the db, or `password` being incorrect,
// the response body should include a string exactly as follows: "invalid credentials".

async function checkUsernameExists(req, res, next) {
  try{
    const [user] = await User.findBy({username: req.body.username})
    if(!user){
      next({message:"invalid credentials", status: 401})
    }else {
      req.user = user
      next()
    }
  }catch(err){
    next(err)
  }
};


module.exports = {
  checkUsernameFree,
  validateUser,
  checkUsernameExists,
}