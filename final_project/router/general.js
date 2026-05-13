const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();

// Register new user
public_users.post('/register', function (req, res) {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) {
      users.push({ username: username, password: password });

      return res.status(200).json({
        message: "User successfully registered. Now you can login"
      });
    } else {
      return res.status(404).json({
        message: "User already exists"
      });
    }
  }

  return res.status(404).json({
    message: "Unable to register user"
  });
});

// Get all books using Promise
public_users.get('/', async function (req, res) {
  const bookPromise = new Promise((resolve, reject) => {
    resolve(books);
  });

  bookPromise.then((data) => {
    return res.status(200).json(data);
  });
});

// Get book details based on ISBN using Promise
public_users.get('/isbn/:isbn', async function (req, res) {
  const isbn = req.params.isbn;

  const bookPromise = new Promise((resolve, reject) => {
    resolve(books[isbn]);
  });

  bookPromise.then((data) => {
    return res.status(200).json(data);
  });
});

// Get book details based on author using Promise
public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author;

  const bookPromise = new Promise((resolve, reject) => {
    const result = Object.values(books).filter(
      book => book.author.toLowerCase() === author.toLowerCase()
    );

    resolve(result);
  });

  bookPromise.then((data) => {
    return res.status(200).json(data);
  });
});

// Get all books based on title using Promise
public_users.get('/title/:title', async function (req, res) {
  const title = req.params.title;

  const bookPromise = new Promise((resolve, reject) => {
    const result = Object.values(books).filter(
      book => book.title.toLowerCase() === title.toLowerCase()
    );

    resolve(result);
  });

  bookPromise.then((data) => {
    return res.status(200).json(data);
  });
});

// Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  if (books[isbn]) {
    return res.status(200).json(books[isbn].reviews);
  }

  return res.status(404).json({ message: "Book not found" });
});

module.exports.general = public_users;