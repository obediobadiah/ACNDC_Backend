require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
var cors = require('cors')
// const locals = require("./middleware/siteTitle");
const appRouters = require("./routers/users-routers");

const PORT = process.env.SERVER_PORT;

const app = express();

// allows to use POST and GET json from our endpoints
app.use(cors())
app.use(express.json());
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: '500mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '500mb' }));

app.use('/images/actuality', express.static('images/actuality'));
app.use('/images/rapports', express.static('images/rapports'));
// app.set("view engine", "pug");
// app.set("views", process.cwd() + "/src/views");

// app.use(locals);
app.use("/api", appRouters);
app.listen(PORT, () =>
  console.log(`✅ server is running on http://localhost:${PORT} 🚀`)
);