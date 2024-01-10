const pool = require("../db");
const UsersQueries = require('../queries/queries')
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET

const getUsers = (req, res) => {
  pool.query(UsersQueries.getUsers, (error, results) => {
    if (error) throw error;
    res
      .status(200)
      .json(results.rows);
  });
};

const getUsersById = (req, res) => {
  const id = parseInt(req.params.id);
  pool.query(UsersQueries.getUsersById, [id], (error, results) => {
    if (error) throw error;
    res
      .status(200)
      .json(results.rows);
  });
};

const addUsers = async (req, res) => {
  const { username, password } = req.body;
  const encryptedPass = await bcrypt.hash(password, 10)
  pool.query(UsersQueries.checkUsersExist, [username], (error, results) => {
    if (results.rows.length) {
      res.send("The user already exist");
    }
    else {
      pool.query(UsersQueries.addUsers, [username, encryptedPass], (error, results) => {
        if (error) throw error;
        res.status(200).send("User Created Successfully");

      });
    }
  });
};

const deleteUsers = (req, res) => {
  const id = parseInt(req.params.id);
  pool.query(UsersQueries.getUsersById, [id], (error, results) => {
    const noUserFound = !results.rows.length;
    if (noUserFound) {
      res.send("The user does not exist");
    }
    else {
      pool.query(UsersQueries.deleteUsers, [id], (error, results) => {
        if (error) throw error;
        res.status(200).send("User Deleted Successfully");
      });
    }
  });
};

const updateUsers = (req, res) => {
  const id = parseInt(req.params.id);
  const { username, password } = req.body;
  console.log(id)
  pool.query(UsersQueries.getUsersById, [id], (error, results) => {
    const noUserFound = !results.rows.length;
    if (noUserFound) {
      res.send("The user does not exist");
    }
    else {
      pool.query(UsersQueries.UpdateUsers, [username, password, id], (error, results) => {
        if (error) throw error;
        res.status(200).send("User Updated Successfully");
      });
    }
  });
};

const authUsers = ((req, res) => {
  const { username, password } = req.body;
  pool.query(UsersQueries.checkUsersExist, [username], async (error, results) => {
    if (results.rows.length) {
      const usersRecord = results.rows[0]
      await bcrypt.compare(password, usersRecord.password, function (_err, result) {
        if (!result) {
          return res.status(401).json({ message: "Invalid password" });
        } else {
          let loginData = {
            username,
            signInTime: Date.now(),
          };
          const token = jwt.sign(loginData, JWT_SECRET);
          res.status(200).json({ message: "Success", token });
        }
      });
    }
    else {
      return res.json( { message: "The user doesn't exist" });
    }
  });
});



module.exports = {
  getUsers,
  getUsersById,
  addUsers,
  deleteUsers,
  updateUsers,
  authUsers,
};