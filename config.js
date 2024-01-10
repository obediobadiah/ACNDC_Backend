// 'use strict'
// const dotenv = require ('dotenv')
// const assert = require('assert')

// dotenv.config();

// const {
//     PORT,
//     HOST,
//     HOST_URL,
//     API_KEY,
//     AUTH_DOMAIN,
//     DATABASE_URL,
//     PROJECT_ID,
//     STORAGE_BUCKET,
//     MESSAGING_SENER_ID,
//     APP_ID
// } = process.env;

// assert(PORT, 'Port is required');
// assert(HOST, 'Host is required');

// module.exports = {
//     port : PORT,
//     host: HOST,
//     url: HOST_URL,
//     firebaseConfig: {
//         apiKey: API_KEY,
//         authDomain: AUTH_DOMAIN,
//         databaseURL: DATABASE_URL,
//         projectId: PROJECT_ID,
//         storageBucket: STORAGE_BUCKET,
//         messagingSenderId: MESSAGING_SENER_ID,
//         appId: APP_ID
//     }
// }

// // Import the functions you need from the SDKs you need
// const firebase = require("firebase/app");
// const firestore = require('firebase/firestore')
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyC_Hba4A_j1KoixP8fyORFWuazuWZ8Dwjc",
//   authDomain: "acndc-a142e.firebaseapp.com",
//   databaseURL: "https://acndc-a142e-default-rtdb.firebaseio.com",
//   projectId: "acndc-a142e",
//   storageBucket: "acndc-a142e.appspot.com",
//   messagingSenderId: "915182470081",
//   appId: "1:915182470081:web:c18928c682c32dac996540"
// };

// // Initialize Firebase
// firebase.initializeApp(firebaseConfig);
// const User = firestore.collection("Users");
// module.exports = User;

require("dotenv").config();

module.exports = {
    HOST: process.env.HOST,
    USER: process.env.USER,
    PASSWORD: process.env.PASSWORD,
    DB: "testdb",
    dialect: "postgres",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  };