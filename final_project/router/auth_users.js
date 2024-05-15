// const express = require('express');
// const jwt = require('jsonwebtoken');
// let books = require("./booksdb.js");
// const regd_users = express.Router();

let users = [];



const authenticatedUser = (username, password)=>{ 
  return users.find(user => user.username === username && user.password === password);
}



// // Add a book review
// regd_users.put("/customer/review/:isbn", (req, res) => {
// 
//   return res.status(300).json({message: "Yet to be implemented"});
// });

// module.exports.authenticated = regd_users;

module.exports = { users, authenticatedUser };
