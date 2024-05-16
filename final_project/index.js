const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const { authenticatedUser, addReview, modifyReview, deleteReview } = require('./router/auth_users.js');
const genl_routes = require('./router/general.js').general;

const app = express();

// Middleware setup
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Session middleware applied globally
app.use(session({
  secret: 'fingerprint_customer',
  resave: true,
  saveUninitialized: true,
}));

// Authentication middleware for /customer/auth/* routes
app.use("/customer/auth/*", function auth(req, res, next) {
  if (req.session.authorization) {
    const token = req.session.authorization['accessToken'];
    jwt.verify(token, "access", (err, user) => {
      if (!err) {
        req.user = user;
        next();
      } else {
        return res.status(403).json({ message: "User not authenticated" });
      }
    });
  } else {
    return res.status(403).json({ message: "User not logged in" });
  }
});

// Login route
app.post("/customer/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" });
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({ data: password }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = {
      accessToken,
      username,
    };
    return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({ message: "Invalid Login. Check username and password" });
  }
});


// Add a book review
app.post('/customer/auth/review/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  const review = req.body.review;

  if (addReview(isbn, review)) {
    res.status(200).send("Review added successfully");
  } else {
    res.status(404).send("Book not found");
  }
});

// Modify a book review
app.put('/customer/auth/review/:isbn/:index', (req, res) => {
  const isbn = req.params.isbn;
  const reviewIndex = parseInt(req.params.index);
  const newReview = req.body.review;

  if (modifyReview(isbn, reviewIndex, newReview)) {
    res.status(200).send("Review modified successfully");
  } else {
    res.status(404).send("Book or review not found");
  }
});

// Delete a book review
app.delete('/customer/auth/review/:isbn/:index', (req, res) => {
  const isbn = req.params.isbn;
  const reviewIndex = parseInt(req.params.index);

  if (deleteReview(isbn, reviewIndex)) {
    res.status(200).send("Review deleted successfully");
  } else {
    res.status(404).send("Book or review not found");
  }
});

// Example of a protected route
app.get('/customer/auth/profile', (req, res) => {
  res.send('This is a protected route, user profile');
});


app.use("/", genl_routes);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});




