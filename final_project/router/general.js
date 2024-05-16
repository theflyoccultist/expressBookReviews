const express = require('express');
let books = require("./booksdb.js");
let authenticatedUser = require("./auth_users.js").authenticatedUser;
let users = require("./auth_users.js").users;

const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!authenticatedUser(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});    
    }
  } 
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/', async (req, res) => {
  try {
  const response = await Promise.resolve(books);
  res.send(JSON.stringify(response, null, 3));

  } catch (error) {
    return res.status(404).json({message: "Unable to retrieve the book list."});
  }
});



// Get book details based on ISBN
public_users.get('/isbn/:isbn', async (req, res) => {
  try {
    const isbn = req.params.isbn;
    const book = books[isbn];
    
    if (book){
    res.send(book);      
    } else {
      res.status(404).send("Book not found");
    }
  } catch (error) {
    res.status(500).send("An error occurred while fetching the book");
  }
});
  
// Get book details based on author
public_users.get('/author/:author', async (req, res) => {
  try {
    const author = req.params.author;
    const booksByAuthor = Object.values(books).filter(book => book.author === author);
  
    if (booksByAuthor.length > 0) {
      res.send(booksByAuthor);
    } else {
      res.status(404).send("Book not found by this author");
    }
  } catch (error) {
    res.status(500).send("Fatal error! oh nooo");
  }
});

// Get all books based on title
public_users.get('/title/:title', async(req, res) => {
  try {
    const title = req.params.title;
    const booksByTitle = Object.values(books).filter(book => book.title === title);
    
    if (booksByTitle.length > 0) {
      res.send(booksByTitle);
    } else {
      res.status(404).send("Book with this title not found");
    }
  } catch (error) {
    res.status.send("Fatal error again...");
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book) {
    const reviews = book.reviews;
    res.send({ reviews: reviews });
  } else {
    res.status(404).send("Book not found");
  }
});

module.exports.general = public_users;
