var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const pool = require("./database");
var cors = require("cors");

var webpayPlusMallRouter = require("./routes/webpay_plus_mall");

const { required } = require("nodemon/lib/config");

var app = express();
if (app.settings.env == "development") {
  require("dotenv").config();
}

// view engine setup

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT"],
  })
);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/webpay_plus_mall", webpayPlusMallRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
