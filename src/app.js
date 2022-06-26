const express = require("express");
const app = express();
const port = 3000;
const session = require("express-session");
const path = require("path");
const method = require("method-override");
const cookies = require("cookie-parser");

app.set("port", process.env.PORT || port);

app.use(
  session({
    secret: "Lusa Ecommerce",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(cookies());

app.use(method("m"));

app.use(express.urlencoded({ extended: true }));

app.listen(app.get("port"), () =>
  console.log("Server http://localhost:" + app.get("port"))
);

app.use(express.static(path.resolve(__dirname, "../public")));
app.use(express.static(path.resolve(__dirname, "../upload")));

app.use(express.json());

app.use("/api/user", require("./routes/users"));
app.use("/api/product", require("./routes/products"));
app.use("/api/cart", require("./routes/carts"));
app.use("/api/sale", require("./routes/sales"));
