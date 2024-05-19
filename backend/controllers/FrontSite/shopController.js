const {
    User,
   
  } = require("../../models");
  const ApiResponse = require("../../helper/ApiResponse");
  const bcrypt = require("bcrypt");
  const { sign } = require("jsonwebtoken");
  const sentOtpMail = require("../../helper/sentOtpMail");
  var otp = require("otpauth");
  const Sequelize = require("sequelize");
  const { options } = require("../../routes/FrontSite/user");
  
  let totp = new otp.TOTP({
    issuer: "ACME",
    label: "AzureDiamond",
    algorithm: "SHA1",
    digits: 4,
    period: 30,
    secret: "NB2W45DFOIZA", // or "OTPAuth.Secret.fromBase32('NB2W45DFOIZA')"
  });
  

  
  async function registration(req, res) {
    const {
      name,
      email,
      phone,
      password,
      address,
      description,
      backgroundColor,
      productDisplay,
      CategoryId
      
    } = req.body;
    const checkEmail = await User.findOne({ where: { email: email } });
    const checkPhone = await User.findOne({ where: { phone: phone } });
    if (checkEmail) {
      const response = ApiResponse("0", "Email already exist", {});
      return res.json(response);
    } else if (checkPhone) {
      const response = ApiResponse("0", "Phone No. already exist", {});
      return res.json(response);
    } else {
      const salt = await bcrypt.genSalt(10);
  
      const user = new User();
      user.name = name;
      user.description = description;
      user.backgroundColor = backgroundColor;
      user.productDisplay = productDisplay;
      user.CategoryId = CategoryId;
      user.email = email;
      user.phone = phone;
  
      user.userType = process.env.SHOP;
      user.status = 1;
      user.password = await bcrypt.hash(password, salt);
  
      const service_image = req.file;
      let tmpPath = service_image.path;
      let imagePath = tmpPath.replace(/\\/g, "/");
  
      user.image = imagePath;
  
      user
        .save()
        .then(async (dat) => {
          const accessToken = sign(
            { email: user.email, id: user.id },
            process.env.JWT_ACCESS_SECRET
          );
          let data = {
            id: dat.id,
            name: dat.name,
            phone: dat.phone,
            email: dat.email,
            accessToken: accessToken,
          };
  
          const response = ApiResponse(
            "1",
            `Shop Registered successfully!`,
            data
          );
          return res.json(response);
        })
        .catch((error) => {
          const response = ApiResponse("0", error.message, {});
          return res.json(response);
        });
    }
  }

  async function login(req, res) {
    const { email, password } = req.body;
    const user = await User.findOne({
      where: [{ email: email }],
    });
  
    if (user) {
      if (user.status == 0) {
        const response = ApiResponse("0", "Sorry! User blocked!", {});
        return res.json(response);
      }
      if (user.userType != process.env.SHOP) {
        const response = ApiResponse("0", "You are not authorized", {});
        return res.json(response);
      }
  
      const validPassword = await bcrypt.compare(password, user.password);
      if (validPassword) {
        const accessToken = sign(
          { email: user.email, id: user.id },
          process.env.JWT_ACCESS_SECRET
        );
        let data = {
          id: user.id,
          name: user.name,
          phone: user.phone,
          email: user.email,
          userType: user.userType,
          accessToken: accessToken,
        };
        const response = ApiResponse("1", "Login Successfully!", data);
        return res.json(response);
      } else {
        const response = ApiResponse("0", "Incorrect Username or Password!", {});
        return res.json(response);
      }
    } else {
      const response = ApiResponse("0", "User not exist", {});
      return res.json(response);
    }
  }
 
  module.exports = {
    registration,
    login
 
  };
  