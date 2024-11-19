const jwt = require("jsonwebtoken");
const Users = require("../model/users");
const Otp = require("../model/otp");
const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const Documents = require("../model/documents");
const imageupload = require("../config/fileUpload");
const crypto = require("crypto");
const sendEmail = require("../utils/mail");
const stripe = require('stripe')(process.env.STRIPE_KEY);

let user = new Users();
let document = new Documents();

const signUp = async (req, res, next) => {
  /**
     * @dev the payload will contain following properties:
    
    
     * - `email`,
     * - `password`,
   
 
     */
  let payload = req.body;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next({
      code: 401,
      message: errors,
    });
  }
  const salt = await bcrypt.genSalt(10);
  payload.password = await bcrypt.hash(payload.password, salt);
  if (payload.email && payload.password) {
    try {
      const result = await user.singUp(payload);
      if (result) {
        return res.status(201).json({ message: " Registered Successfully" });
      } else {
        return next({ code: 404, message: "no data found" });
      }
    } catch (error) {
      return next({ code: 401, message: error });
    }
  } else {
    return next({ code: 400, message: "No Request Found" });
  }
};
const updateInfo = async (req, res, next) => {
  /**
   * @dev the payload will contain following properties:
   * - `id `,
   * - `full_name`,
   * - `email`,
   * - `phone`,
   * - `bussiness_name`,
   * - `address`,
   */
  let payload = req.body;
  const { id } = payload;
  let tokenId = req.data.data1.id;
  if (tokenId != id) return next({ code: 401, message: "Unauthorized" });
  if (id) {
    try {
      const result = await user.updateInfo(payload);
      if (result) {
        return res.status(201).json({ message: "Info Updated Successfully" });
      } else {
        return next({ code: 404, message: "no data found" });
      }
    } catch (error) {
      return next({ code: 401, message: error });
    }
  } else {
    return next({ code: 400, message: "No Request Found" });
  }
};

const logIn = async (req, res, next) => {
  let email = req.body.email;
  let password = req.body.password;

  if (typeof email != "undefined" && typeof password != "undefined") {
    try {
      // console.log(password);
      const [data] = await user.logIn(email);
      if (data.length > 0) {
        let check = await bcrypt.compare(password, data[0].password);
        if (!check) {
          return next({ code: 403, message: "Invalid Email or Password" });
        }
        data.forEach((rowsData) => {
          let data1 = {
            id: rowsData.id,
            fullName: rowsData.full_name,
            email: rowsData.email,
            phone: rowsData.phone,
            bussiness_name: rowsData.bussiness_name,
            address: rowsData.address,
          };

          jwt.sign(
            { data1 },
            "secretKey",
            { expiresIn: "1d" },
            (err, token) => {
              if (err) {
                return res.status(401).json({ message: err });
              }
              return res.status(201).json({ userInfo: data1, token: token });
            }
          );
        });
      } else {
        return next({ code: 404, message: "Invalid Email or Password" });
      }
    } catch (err) {
      return next({ code: 401, message: err });
    }
  } else {
    return next({ code: 400, message: "No Request Found" });
  }
};

const authentication = async (req, res, next) => {
  let email = req.data.data1.email;

  if (email) {
    try {
      // console.log(password);
      const [data] = await user.logIn(email);
      if (data.length > 0) {
        data.forEach((rowsData) => {
          let data1 = {
            id: rowsData.id,
            fullName: rowsData.full_name,
            email: rowsData.email,
            phone: rowsData.phone,
            bussiness_name: rowsData.bussiness_name,
            address: rowsData.address,
          };

          return res.status(201).json({ userInfo: data1 });
        });
      } else {
        return next({ code: 404, message: "Invalid Email or Password" });
      }
    } catch (err) {
      return next({ code: 401, message: err });
    }
  } else {
    return next({ code: 400, message: "No Request Found" });
  }
};
const forgetPassword = async (req, res, next) => {
  let email = req.body.email;
  //Step#01  Find User A/C through Email
  const [userCheck] = await user.checkEmail(req.body.email);
  if (userCheck.length === 0) {
    return res.status(404).json({
      status: "404",
      message: "User not found",
    });
  }
  if (userCheck.length > 0) {
    //Step#02 Create Random Token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const passwordResetToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    const passwordResetExpire = Date.now() + 10 * 60 * 1000;
    await user.resetTokenInsert(passwordResetToken, passwordResetExpire, email);

    //Step 03 Email
    // 3) Send it to user's email
    const resetURL = `http://localhost:3000/forgetPassword/${resetToken}`;
    const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: <br/><a href="${resetURL}">Click Here<a/>.<br/>If you didn't forget your password, please ignore this email!`;

    try {
      await sendEmail({
        email: email,
        subject: "Your password reset token (valid for 10 min)",
        message,
      });

      res.status(200).json({
        status: "success",
        message: "Token sent to email!",
      });
    } catch (err) {
      const passwordResetToken = null;
      const passwordResetExpire = null;
      await user.resetTokenInsert(
        passwordResetToken,
        passwordResetExpire,
        email
      );
      return next({
        code: 500,
        message: "There was an error sending the email. Try again later!",
      });
    }
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const [result] = await user.getToken(hashedToken);

    if (!result) {
      return next({ code: 400, message: "Invalid Token" });
    }
    if (result.length > 0) {
      const data = result[0];
      console.log(data, "data");
      const salt = await bcrypt.genSalt(10);
      passwordEncrypt = await bcrypt.hash(password, salt);
      await user.setPassword(data.email, passwordEncrypt);
      res.status(200).json({
        status: "success",
        message: "Password Updated successfully",
      });
    }
  } catch (err) {
    return next({ code: 400, message: "No Request Found" });
  }
};


const getUser = async(req,res,next)=>{
  try {
    // console.log(password);
    let userData = [];
    const [data] = await user.dataUser();
    if (data.length > 0) {
        return res.status(200).json({ userInfo: data });
    } else {
      return next({ code: 404, message: "No Data Found!" });
    }
  } catch (err) {
    return next({ code: 401, message: err });
  }
  
};

const getSingleUser = async (req,res,next) => {
  
  try {
    const [data] = await user.dataSingleUser(req.params.id);
   
    if (data) {
      return res.status(200).json({ userInfo: data });
  } else {
    return next({ code: 404, message: "No Data Found!" });
  }
   
  } catch (error) {
    throw error;
  }
};

const userProfile=(req,res,next)=>{
    
  let {id,full_name,phone,bussiness_name,address,image}= req.body;
  image = req.file.filename;
  if (!id ||!full_name || !phone || !bussiness_name || !address || !image) {
      return res.status(400).json({status:false,message:"bad request"});
  }
  user.userProfile(id,full_name,phone,bussiness_name,address,image).then(()=>{
      return res.status(200).json({ message: "user details added successfully" });
  }).catch((error)=>{
      res.status(400).json({error:error.message});
  });
}


const deleteUser = async(req,res,next)=>{
  try {
    console.log(req.body.email);
    if(req.body.email){
      await user.deleteuser(req.body.email);
      res.status(200).json({
          status:"Delete Successfully",
      })
    }
  } catch (err) {
    return next({ code: 401, message: err });
  }


}
const stripeCheckOut = async (req, res, next) => {
  let { amount, currency, description, card, userId, auctionId } =
    req.body;
    
    amount = amount*100;
  try {
    const token = await stripe.tokens.create({
      card: {
        number: card.number,
        exp_month: card.exp_month,
        exp_year: card.exp_year,
        cvc: card.cvc,
      },
    });
    const charge = await stripe.charges.create({
      amount: amount,
      currency: currency,
      description: description,
      source: token.id,
    });
    let price = amount/100;
    
    await user.storeTransactionDetails(userId,auctionId,price,description)
    return res
      .status(200)
      .json({ paymentSlip: charge.receipt_url, info: charge });
  } catch (error) {
    return next({ code: 401, message: error.message });
  }
};

module.exports = {
  userLogin: logIn,
  updateUserInfo: updateInfo,
  authentication: authentication,
  signUp: signUp,
  forgetPassword: forgetPassword,
  resetPassword: resetPassword,
  getUser:getUser,
  getSingleUser,
  deleteUser:deleteUser,
  stripeCheckOut:stripeCheckOut,
  userProfile:userProfile
  
};
