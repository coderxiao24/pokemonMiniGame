const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const indexRouter = require("./routes/index");
const pokemonsRouter = require("./routes/pokemons");
const usersRouter = require("./routes/users");
const uploadRouter = require("./routes/upload");
const JWT = require("./utils/JWT");

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  // 如果token有效 ,next()
  // 如果token过期了, 返回401错误

  const whiteList = [
    { url: "/users", method: "POST" },
    { url: "/users/login", method: "POST" },
    { url: "/pokemons/init", method: "GET" },
  ];
  if (whiteList.find((v) => v.url == req.url && v.method == req.method)) {
    next();
    return;
  }
  const token = req.headers["authorization"]?.split(" ")[1];
  if (token) {
    var payload = JWT.verify(token);

    if (payload) {
      const newToken = JWT.generate(
        {
          _id: payload._id,
          username: payload.username,
        },
        "1d"
      );
      res.header("Authorization", newToken);
      next();
    } else {
      res.status(401).send({ errCode: "-1", errorInfo: "token过期" });
    }
  } else next();
});

app.use("/", indexRouter);
app.use("/pokemons", pokemonsRouter);
app.use("/users", usersRouter);
app.use("/upload", uploadRouter);

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
