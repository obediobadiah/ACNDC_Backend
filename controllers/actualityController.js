const pool = require("../db");
const { actualityQueries } = require('../queries/queries');
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");
const { link } = require("../routers/users-routers");
const multer = require('multer');
const fs = require('fs');
const sharp = require('sharp');
const nodemailer = require('nodemailer');
const path = require('path');



const getCountActuality = (req, res) => {
  pool.query(actualityQueries.getCountActuality, (error, results) => {
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
  pool.query(actualityQueries.getActuality, async (error, results) => {
    if (error) {
      console.error('Error fetching actuality:', error);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    try {
      const processedDataPromises = results.rows.map(async (row) => {
        try {
          // Check if image exists and is valid
          if (row.image && Buffer.isBuffer(row.image)) {
            const resizedImageBuffer = await resizeImage(row.image, 500, 500);
            const imageString = resizedImageBuffer ? resizedImageBuffer.toString('base64') : null;
            
            return {
              ...row,
              image: imageString,
            };
          } else {
            // Return row without image processing if image is null or invalid
            return {
              ...row,
              image: null,
            };
          }
        } catch (imageError) {
          console.error('Error processing image for row:', row.id, imageError);
          // Return row without image if processing fails
          return {
            ...row,
            image: null,
          };
        }
      });

      const processedData = await Promise.all(processedDataPromises);

      res.status(200).json(processedData);
    } catch (error) {
      console.error('Error processing actuality data:', error);
      // Return raw data if processing fails
      res.status(200).json(results.rows);
    }
  });
};

const getActualityByTitle = (req, res) => {
  const title = req.params.title;
  pool.query(actualityQueries.getActualityByTitle, [title], (error, results) => {
    if (error) throw error;
    res
      .status(200)
      .json(results.rows);
  });
};


const getActualityById = (req, res) => {
  const id = parseInt(req.params.id);
  pool.query(actualityQueries.getActualityById, [id], (error, results) => {
    if (error) throw error;
    res
      .status(200)
      .json(results.rows);
  });
};


const addActuality = async (req, res) => {
  const { title, description, content } = req.body;
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
  pool.query(actualityQueries.addActuality, [title, description, binaryImage, slug, content], (error, results) => {
    if (error) throw error;
    res.status(200).send("actuality Created Successfully");
  });
};


const updateActuality = (req, res) => {
  const id = parseInt(req.params.id);
  const { title, description, content } = req.body;
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
  pool.query(actualityQueries.UpdateActuality, [title, description, binaryImage, slug, content, id], (error, results) => {
    if (error) throw error;
    res.status(200).send("Actuality Created Successfully");
  });
};


const AddActualityById = (req, res) => {
  const id = parseInt(req.params.id);
  pool.query(actualityQueries.AddActualityById, [id], (error, results) => {
    if (error) throw error;
    res.status(200).send("actuality Diplicated Successfully");
  });
};

const deleteActuality = (req, res) => {
  const id = parseInt(req.params.id);
  pool.query(actualityQueries.getActualityById, [id], (error, results) => {
    const noUserFound = !results.rows.length;
    if (noUserFound) {
      res.send("The actuality does not exist");
    }
    else {
      pool.query(actualityQueries.deleteActuality, [id], (error, results) => {
        if (error) throw error;
        res.status(200).send("actuality Deleted Successfully");
      });
    }
  });
};


const getActualityBySlug = (req, res) => {
  const { slug } = req.params;
  pool.query(actualityQueries.getActualityBySlug, [slug], (error, results) => {
    if (error) throw error;
    res
      .status(200)
      .json(results.rows);
  });
};

const sendEmail = async (req, res) => {
  const { from_name, from_email, message } = req.body;

  try {

    const templatePath = path.join(__dirname, '../templates/emailTemplate.html');
    let htmlTemplate = fs.readFileSync(templatePath, 'utf8');

    htmlTemplate = htmlTemplate.replace('{{from_name}}', from_name);
    htmlTemplate = htmlTemplate.replace('{{from_email}}', from_email);
    htmlTemplate = htmlTemplate.replace('{{message}}', message);

    const autoReplyPath = path.join(__dirname, '../templates/emailAutoReply.html');
    let autoReplyTemplate = fs.readFileSync(autoReplyPath, 'utf8');

    autoReplyTemplate = autoReplyTemplate.replace('{{from_name}}', from_name);
    autoReplyTemplate = autoReplyTemplate.replace('{{from_email}}', from_email);
    autoReplyTemplate = autoReplyTemplate.replace('{{message}}', message);

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: from_email,
      to: process.env.EMAIL_USER,
      subject: `Lettre D'information [ ACNDC - ${from_name} ]`,
      html: htmlTemplate,
    };

    const autoReplyOptions = {
      from: process.env.EMAIL_USER,
      to: from_email,
      subject: `Lettre D'information [ACNDC]`,
      html: autoReplyTemplate,
    };

    await transporter.sendMail(mailOptions);
    await transporter.sendMail(autoReplyOptions);

    res.status(200).send("Email sent successfully");
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json("Failed to send email");
  }
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
  getActualityBySlug,
  sendEmail,
};