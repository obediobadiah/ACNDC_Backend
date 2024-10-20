const pool = require("../db");
const UsersQueries = require('../queries/queries')
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");
const { link } = require("../routers/users-routers");
const multer = require('multer');
const fs = require('fs');
const sharp = require('sharp');



const getCountActuality = (req, res) => {
  pool.query(UsersQueries.getCountActuality, (error, results) => {
    if (error) throw error;
    res
      .status(200)
      .json(results.rows);
  });
};

const resizeImage = async (imageBuffer, maxWidth, maxHeight) => {
  try {
    const resizedImageBuffer = await sharp(imageBuffer)
      .resize({
        width: maxWidth,
        height: maxHeight,
        fit: 'inside',
        withoutEnlargement: true,
      })
      .toBuffer();
    return resizedImageBuffer;
  } catch (error) {
    console.error('Error resizing image:', error);
    return null;
  }
};

const getActuality = (req, res) => {
  pool.query(UsersQueries.getActuality, async (error, results) => {
    if (error) {
      console.error('Error fetching actuality:', error);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    try {
      const resizedDataPromises = results.rows.map(async (row) => {
        const imageBuffer = row.image;
        const resizedImageBuffer = await resizeImage(imageBuffer, 500, 500);
        const imageString = resizedImageBuffer ? resizedImageBuffer.toString('base64') : null;

        return {
          ...row,
          image: imageString,
        };
      });

      const resizedData = await Promise.all(resizedDataPromises);
      
      res.status(200).json(resizedData);
    } catch (error) {
      console.error('Error resizing images:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
};

// const getActuality = (req, res) => {
//   pool.query(UsersQueries.getActuality, (error, results) => {
//     const combinedData = results.rows.map((row) => {
//       const imageBuffer = row.image;
//       const imageString = imageBuffer ? imageBuffer.toString('base64') : null;

//       return {
//         ...row,
//         image: imageString,
//       };
//     });
//     res.status(200).json(combinedData);

//   });

// };

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


const addActuality = async (req, res) => {
  const { title, description, link } = req.body;
  const imageFile = req.file;
  const binaryImage = imageFile.buffer

  const slug = title
    .toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/[^\w\-]+/g, '');

  if (Object.keys(req.body).length === 0) {
    res.status(400).send('Request body is empty');
    return;
  }
  pool.query(UsersQueries.addActuality, [title, description, link, binaryImage, slug], (error, results) => {
    if (error) throw error;
    res.status(200).send("actuality Created Successfully");
  }); 
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

  const slug = title
  .toLowerCase()
  .replace(/\s+/g, '_')
  .replace(/[^\w\-]+/g, '');

  const queryArgs = req.file ? [title, description, link, imagePath, slug, id] : [title, description,slug, link, id];
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