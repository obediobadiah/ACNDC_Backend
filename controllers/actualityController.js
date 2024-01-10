const pool = require("../db");
const UsersQueries = require('../queries/queries')
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");
const { link } = require("../routers/users-routers");
const multer = require('multer');


const getCountActuality = (req, res) => {
  pool.query(UsersQueries.getCountActuality, (error, results) => {
    if (error) throw error;
    res
      .status(200)
      .json(results.rows);
  });
};
const getActuality = (req, res) => {
  pool.query(UsersQueries.getActuality, (error, results) => {
    if (error) throw error;
    res
      .status(200)
      .json(results.rows);
  });
};

const getActualityByTitle = (req, res) => {
  const title = req.params.title;
  pool.query(UsersQueries.getActualityByTitle, [title], (error, results) => {
    if (error) throw error;
    res
      .status(200)
      .json(results.rows);
  });
};

const getActualityById = (req, res) => {
  const id = parseInt(req.params.id);
  pool.query(UsersQueries.getActualityById, [id], (error, results) => {
    if (error) throw error;
    res
      .status(200)
      .json(results.rows);
  });
};

const addActuality = (req, res) => {
  const { title, description, link } = req.body;
  const imageFile = req.file;
  try {
    if (Object.keys(req.body).length === 0) {
      res.status(400).send('Request body is empty');
      return;
    }
    pool.query(UsersQueries.addActuality, [title, description, link, imageFile.path], (error, results) => {
      if (error) throw error;
      res.status(200).send("actuality Created Successfully");

    });
  } catch (error) {
    console.error(error);
  }

};


// const updateActuality = (req, res) => {
//   const id = parseInt(req.params.id);
//   const { title, description, link } = req.body;
//   const imageFile = req.file;
//   if (Object.keys(req.body).length === 0) {
//     res.status(400).send('Request body is empty');
//     return;
//   }
//   pool.query(UsersQueries.UpdateActuality, [title, description, link, imageFile.path, id], (error, results) => {
//     if (error) throw error;
//     res.status(200).send("Actuality Created Successfully");
//   });
// };

const updateActuality = (req, res) => {
  const id = parseInt(req.params.id);
  const { title, description, link } = req.body;
  let imagePath = '';

  if (req.file) {
    imagePath = req.file.path;
  }
  if (Object.keys(req.body).length === 0) {
    res.status(400).send('Request body is empty');
    return;
  }
  const queryArgs = req.file ? [title, description, link, imagePath, id] : [title, description, link, id];
  const queryToExecute = req.file ? UsersQueries.UpdateActuality : UsersQueries.UpdateActualityWithoutImage;
  pool.query(queryToExecute, queryArgs, (error, results) => {
    if (error) throw error;
    res.status(200).send("Actuality Created Successfully");
  });
};


const AddActualityById = (req, res) => {
  const id = parseInt(req.params.id);
  pool.query(UsersQueries.AddActualityById, [id], (error, results) => {
    if (error) throw error;
    res.status(200).send("actuality Diplicated Successfully");

  });
};

const deleteActuality = (req, res) => {
  const id = parseInt(req.params.id);
  pool.query(UsersQueries.getActualityById, [id], (error, results) => {
    const noUserFound = !results.rows.length;
    if (noUserFound) {
      res.send("The actuality does not exist");
    }
    else {
      pool.query(UsersQueries.deleteActuality, [id], (error, results) => {
        if (error) throw error;
        res.status(200).send("actuality Deleted Successfully");
      });
    }
  });
};

module.exports = {
  getCountActuality,
  getActuality,
  getActualityByTitle,
  getActualityById,
  addActuality,
  AddActualityById,
  deleteActuality,
  updateActuality,
  // authUsers,
};