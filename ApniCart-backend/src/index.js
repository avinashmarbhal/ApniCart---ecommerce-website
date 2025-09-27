const { PORT } = require("./envConfig.js");
const cookieParser = require("cookie-parser");
const mongoConnect = require("./db/mongoConnect.js");
const categoryRoute = require("./routes/category.routes.js");
const productRoute = require("./routes/product.routes.js");
const userRoute = require("./routes/user.routes.js");
const addressRoute = require("./routes/address.routes.js");
const reviewRoute = require("./routes/review.routes.js");
const cartRoute = require("./routes/cart.routes.js");
const orderRoute = require("./routes/order.routes.js");
const adminRoute = require("./routes/admin.routes.js");
const cors = require("cors");
const express = require("express");
const app = express();

app.use(
  cors({
    origin: 'https://apnicart.netlify.app', // frontend origin
    credentials: true,
  })
);

mongoConnect();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());
app.use("/product", productRoute);
app.use("/category", categoryRoute);
app.use("/", userRoute);
app.use("/address", addressRoute);
app.use("/review", reviewRoute);
app.use("/cart", cartRoute);
app.use("/order", orderRoute);
app.use("/admin", adminRoute);

app.listen(PORT, () => {
  console.log(`Server Stared on ${PORT}`);
});
