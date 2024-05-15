const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const { authenticatedUser } = require('./router/auth_users.js');
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

// Example of a protected route
app.get('/customer/auth/profile', (req, res) => {
  res.send('This is a protected route, user profile');
});

// Additional router
// Replace this with actual router if available
// const regd_users = require('./path/to/your/regd_users'); 
// app.use('/api', regd_users);

app.use("/", genl_routes);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});




