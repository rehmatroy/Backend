const express = require("express");
const auth = require("../middleware/validation");
const bcrypt = require("bcrypt");
const userController = require("../controller/user");
const validate = require("../helper/validate");
const router = express.Router();
const imageUpload = require('../config/fileUpload')


const {getQuery,addQuery}= require ('../controller/query');
router.post("/addquery", addQuery);
router.get("/getQuery", getQuery);


router.get("/checkSession", auth, userController.authentication);

router.post("/signUp", [validate.signUp], userController.signUp);

router.post("/signIn", userController.userLogin);

router.post("/updateInfo", auth, userController.updateUserInfo);

router.post("/passwordGenrator", async (req, res, next) => {
  let password = req.body.password;
  const salt = await bcrypt.genSalt(10);

  password = await bcrypt.hash(password, salt);
  return res.status(201).json(password);
});

// Get Users
router.get("/users", userController.getUser);
router.get("/user/:id", userController.getSingleUser);
// forget Password
router.post("/forgetPassword", userController.forgetPassword);

// reset Password
router.post("/resetPassword", userController.resetPassword);
// delete user
router.post("/deleteUser", userController.deleteUser);
// stripe checkOut
router.post('/checkOut', userController.stripeCheckOut)
router.post('/userProfile',imageUpload, userController.userProfile)

module.exports = router;
