const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { sendMail } = require("../utils/mailer");
const { models } = require("../database/index");

const router = express.Router();

router.get("/", async (req, res) => {
  res.render("auth", { title: "Auth" });
});

router.get("/login", async (req, res) => {
  res.render("login", { title: "Login" });
});

router.get("/logout", async (req, res) => {
  res.cookie("email", undefined);
  res.cookie("jwt", undefined);
  res.status(201).redirect("/auth");
})

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await models.user.findOne({ where: { email } });

  if (user) {
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (isPasswordCorrect) {
      const verified = user.verified;

      if (verified) {
        let token = jwt.sign(
          { email: email },
          process.env.secretKey,
          { expiresIn: 1 * 24 * 60 * 60 * 1000 }
        );

        res.cookie("email", email, {
          maxAge: 1 * 24 * 60 * 60,
          httpOnly: true,
        })

        res.cookie("jwt", token, {
          maxAge: 1 * 24 * 60 * 60,
          httpOnly: true,
        });
        return res.status(201).redirect("/");
      } else {
        return res.render("info", {
          title: "Error",
          message: "Are u not verified"
        });
      }
    } else {
      return res.render("info", {
        title: "Error",
        message: "Incorrect password"
      });
    }
  } else {
    return res.render("info", {
      title: "Error",
      message: "Incorrect email"
    });
  }
});

router.get("/register", async (req, res) => {
  res.render("register", { title: "Register" });
});

router.post("/register", async (req, res) => {
  const { email, password } = req.body;

  const existsUser = await models.user.findOne({
    where: { email }
  })

  if (existsUser) {
    return res.render("info", {
      title: "Error",
      status: 409,
      message: "User already exists"
    });
  }

  const user = await models.user.create({
    email: email,
    password: await bcrypt.hash(password, 10),
    verified: false,
  })

  if (user) {
    let token = await models.token.create({
      userId: user.id,
      token: crypto.randomBytes(16).toString("hex"),
    })

    sendMail({
      from: process.env.email,
      to: `${email}`,
      subject: "Account Verification",
      text: `${process.env.url}/auth/verify/${user.email}/${token.token}`,
    })
      .then(() => {
        return res.render("info", {
          title: "Verification",
          status: 201,
          message: "Verification link has sent."
        });
      })
      .catch((e) => {
        console.log(e)
        return res.render("info", {
          title: "Error",
          status: 501,
          message: "Server error."
        });
      });
  } else {
    return res.render("info", {
      title: "Error",
      status: 409,
      message: "Details are not correct"
    });
  }
});

router.get("/verify/:email/:token", async (req, res) => {
  const { email, token } = req.params;

  const dbToken = await models.token.findOne({
    where: { token },
    include: models.user
  })

  if (!dbToken) {
    return res.render("info", {
      title: "Error",
      status: 400,
      message: "Invalid verification link.."
    });
  }

  if (!dbToken.user) {
    if (dbToken.user.email != email) {
      return res.render("info", {
        title: "Error",
        status: 400,
        message: "Invalid email.."
      });
    }

    return res.render("info", {
      title: "Error",
      status: 401,
      message: "<h3>Invalid verification link.. Please SignUp!</h3>"
    });
  } else if (dbToken.user.verified) {
    return res.render("info", {
      title: "Verification",
      status: 200,
      message: `<a href="/auth/login>Verified. You can join account</a>`
    });
  } else {
    dbToken.user.verified = true
    await dbToken.user.save()

    return res.render("info", {
      title: "Verification",
      status: 200,
      message: `<a href="/auth/login>Verified. You can join account</a>`
    });
  }
});

module.exports = router;
