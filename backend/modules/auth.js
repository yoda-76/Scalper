const express = require('express');
const User = require("../models/userDetails");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "slkdfjlasdfkajsdlkfaksdflaksdjfoajsdofjodsf";

function checkAuth(token) {
  return new Promise((resolve, reject) => {
    try {
      const user = jwt.verify(token, JWT_SECRET);
      const userEmail = user.email;

      User.findOne({ email: userEmail })
        .then((userData) => {
          resolve({ status: true, data: userData });
        })
        .catch((error) => {
          reject({ status: false, data: error });
        });
    } catch (error) {
      reject({ status: false, data: error });
    }
  });
}

module.exports = { checkAuth };
