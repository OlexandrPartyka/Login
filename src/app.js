const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const sassMiddleware = require("node-sass-middleware");
require("dotenv").config()

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  sassMiddleware({
    src: path.join(__dirname, "../public"),
    dest: path.join(__dirname, "../public"),
    indentedSyntax: false,
    outputStyle: "compressed",
  })
);
app.use(express.static(path.join(__dirname, "../public")));

app.use("/", require("./routes/index"));
app.use("/auth", require("./routes/auth"));

module.exports = app;
