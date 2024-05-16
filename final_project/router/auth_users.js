// const express = require('express');
// const jwt = require('jsonwebtoken');

// const regd_users = express.Router();

let users = [];
let books = require("./booksdb.js");


const authenticatedUser = (username, password)=>{ 
  return users.find(user => user.username === username && user.password === password);
}

function addReview(isbn, review) {
  if (books[isbn]) {
    if (!Array.isArray(books[isbn].reviews)) {
      books[isbn].reviews = [];
    }
    books[isbn].reviews.push(review);
    return true;
  }
  return false;
}

function modifyReview(isbn, reviewIndex, newReview) {
  if (books[isbn] && books[isbn].reviews[reviewIndex]) {
    books[isbn].reviews[reviewIndex] = newReview;
    return true;
  }
  return false;
}

function deleteReview(isbn, reviewIndex) {
  if (books[isbn] && Array.isArray(books[isbn].reviews) && books[isbn].reviews[reviewIndex]) {
    books[isbn].reviews.splice(reviewIndex, 1);
    return true;
  }
  return false;
}

// // Add a book review
// regd_users.put("/customer/review/:isbn", (req, res) => {
// 
//   return res.status(300).json({message: "Yet to be implemented"});
// });

// module.exports.authenticated = regd_users;

module.exports = { users, authenticatedUser, addReview, modifyReview, deleteReview };
