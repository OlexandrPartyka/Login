const express = require("express");
const router = express.Router();

router.get("/", function(req, res, next) {
  if (req.cookies.jwt && req.cookies.email) {
    res.render("index", { email: req.cookies.email });
  } else {
    res.redirect("/auth");
  }  
});

module.exports = router;
