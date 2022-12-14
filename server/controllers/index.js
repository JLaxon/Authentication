let express = require("express");
let router = express.Router();
let mongoose = require("mongoose");
let passport = require("passport");

//enable JWT
let jwt = require("jsonwebtoken");
let DB = require("../config/db");

let contact = require("../models/contact");

//create the user model instance
let userModel = require("../models/user");
let User = userModel.User; //alias

module.exports.displayHomepage = (req, res, next) => {
  res.render("index", {
    title: "Home",
    displayName: req.user ? req.user.displayName : "",
  });
};

module.exports.displayaboutpage = (req, res, next) => {
  res.render("index", {
    title: "About",
    displayName: req.user ? req.user.displayName : "",
  });
};

module.exports.displayprojectpage = (req, res, next) => {
  res.render("index", {
    title: "Projects",
    displayName: req.user ? req.user.displayName : "",
  });
};

module.exports.displayservicespage = (req, res, next) => {
  res.render("index", {
    title: "Services",
    displayName: req.user ? req.user.displayName : "",
  });
};

module.exports.displayContactUspage = (req, res, next) => {
  res.render("index", {
    title: "ContactUs",
    displayName: req.user ? req.user.displayName : "",
  });
};

module.exports.addprocesspage = (req, res, next) => {
  let newcontact = contact({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    number: req.body.number,
  });
  contact.create(newcontact, (err, contact) => {
    if (err) {
      console.log(err);
      res.end(err);
    } else {
      // refresh the contactus page
      res.redirect("/contactus");
    }
  });
};

module.exports.displayLoginPage = (req, res, next) => {
    // check if the user is already logged in
    if (!req.user) {
      res.render("auth/login", {
        title: "Login",
        messages: req.flash("loginMessage"),
        displayName: req.user ? req.user.displayName : "",
      });
    } else {
      return res.redirect("/");
    }
  };
  
  module.exports.processLoginPage = (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
      // server err?
      if (err) {
        return next(err);
      }
      // is there a user login error?
      if (!user) {
        req.flash("loginMessage", "Authentication Error");
        return res.redirect("/login");
      }
      req.login(user, (err) => {
        // server error?
        if (err) {
          return next(err);
        }

        const payload =
        {
          id: user._id,
          displayName: user.displayName,
          username: user.username,
          email: user.email,
        }

        const authToken = jwt.sign(payload, DB.Secret, {
          expiresIn: 604000 // 1 week
        });

        /* TODO - Getting ready to convert to API
        res.json({success: true, msg: 'User Logged in Sucessfully!', user: {
          id: user._id,
          displayName: user.displayName,
          username: user.username,
          email: user.email,
        }, token: authToken});
        */

        return res.redirect("/contact");
      });
  })(req, res, next);
};
module.exports.displayRegisterPage = (req, res, next) => {
    // check if the user is not already logged in
    if (!req.user) {
      res.render("auth/register", {
        title: "Register",
        messages: req.flash("registerMessage"),
        displayName: req.user ? req.user.displayName : "",
      });
    } else {
      return res.redirect("/");
    }
  };
  
  module.exports.processRegisterPage = (req, res, next) => {
    // instantiate a user object
    let newUser = new User({
      username: req.body.username,
      //password: req.body.password
      email: req.body.email,
      displayName: req.body.displayName,
    });
  
    User.register(newUser, req.body.password, (err) => {
      if (err) {
        console.log("Error: Inserting New User");
        if (err.name == "UserExistsError") {
          req.flash(
            "registerMessage",
            "Registration Error: User Already Exists!"
          );
          console.log("Error: User Already Exists!");
        }
        return res.render("auth/register", {
          title: "Register",
          messages: req.flash("registerMessage"),
          displayName: req.user ? req.user.displayName : "",
        });
      } else {
        // if no error exists, then registration is successful
  
        // redirect the user and authenticate them

        /* TODO - Getting ready to convert to API
        res.json({success: true, msg: 'User Registered Successfully!', user: {
          id: user._id,
          displayName: user.displayName,
          username: user.username,
          email: user.email,
        }, token: authToken});
        */
  
        return passport.authenticate("local")(req, res, () => {
          res.redirect("/contact");
        });
      }
    });
  };
  
  module.exports.performLogout = (req, res, next) => {
    req.logout(function (err) {
      if (err) {
        return next(err);
      }
      res.redirect("/");
    });
  };