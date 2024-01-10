const { Router } = require("express");
const usersController = require("../controllers/usersController");
const actualityController = require("../controllers/actualityController");
const multer = require('multer');
// const overrideMethod = require("../middleware/overrideMethod");

const router = Router();

const fileStorage = multer.diskStorage({
    destination:function(req, image, cb){
      return cb(null, './images/actuality/')
    },
    filename: function (req, image, cd){
      return cd(null, `${Date.now()}_${image.originalname}`)
    }
  })
  
const upload = multer({ storage: fileStorage})

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
// router.post("/add-actuality/", upload.single('image') , (req, res) => {
//     console.log(req.body);
//     console.log(req.file)
// });
router.post("/add-actuality/", upload.single('image') , actualityController.addActuality);
router.post("/add-actuality-id/:id", actualityController.AddActualityById);
router.post("/delete-actuality/:id", actualityController.deleteActuality);
router.post("/update-actuality/:id", upload.single('image'),actualityController.updateActuality);
// router.post("/auth-users/", usersController.authUsers);

module.exports = router;