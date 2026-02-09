const { Router } = require("express");
const usersController = require("../controllers/usersController");
const actualityController = require("../controllers/actualityController");
const donationController = require("../controllers/donationController");
const newsletterController = require("../controllers/newsletterController");
const multer = require('multer');
// const overrideMethod = require("../middleware/overrideMethod");

const router = Router();

// const fileStorage = multer.diskStorage({
//     destination:function(req, image, cb){
//       return cb(null, './images/actuality/')
//     },
//     filename: function (req, image, cd){
//       return cd(null, `${Date.now()}_${image.originalname}`)
//     }
//   })
  // uploading the images to server using Multer middleware
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// router.use(overrideMethod);
router.get("/get-users", usersController.getUsers);
router.get("/get-users/:id", usersController.getUsersById);
router.post("/add-users/", usersController.addUsers);
router.post("/delete-users/:id", usersController.deleteUsers);
router.post("/update-users/:id", usersController.updateUsers);
router.post("/auth-users/", usersController.authUsers);

// router.use(overrideMethod);
router.get("/get-actuality-count", actualityController.getCountActuality);
router.get("/get-actuality", actualityController.getActuality);
router.get("/get-actuality/:title", actualityController.getActualityByTitle);
router.get("/get-actuality-id/:id", actualityController.getActualityById);
router.post("/add-actuality/",upload.single('image'), actualityController.addActuality);
router.post("/add-actuality-id/:id", actualityController.AddActualityById);
router.post("/delete-actuality/:id", actualityController.deleteActuality);
router.post("/update-actuality/:id",upload.single('image'), actualityController.updateActuality);


router.post("/send-email/", actualityController.sendEmail);

// Donation routes
router.get("/donations", donationController.getDonations);
router.get("/donations/:id", donationController.getDonationsById);
router.post("/donations", donationController.addDonation);
router.put("/donations/:id/status", donationController.updateDonationStatus);
router.delete("/donations/:id", donationController.deleteDonation);

// Newsletter routes
router.get("/newsletter-subscribers", newsletterController.getSubscribers);
router.get("/newsletter-subscribers/:id", newsletterController.getSubscriberById);
router.post("/newsletter-subscribers", newsletterController.addSubscriber);
router.put("/newsletter-subscribers/:id/status", newsletterController.updateSubscriberStatus);
router.delete("/newsletter-subscribers/:id", newsletterController.deleteSubscriber);

// router.post('/test-upload', upload.single('image'), (req, res) => {
//     res.json({ filePath: req.file.path });
//   });
// router.post("/auth-users/", usersController.authUsers);

module.exports = router;