const express = require("express");
const fileUpload = require("express-fileupload");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const UserRoute = require("./routes/User.route.js");
const ProductRoute = require("./routes/Product.route.js");
const CategoriesRoute = require("./routes/Categories.route.js");
const CartRoute = require("./routes/Cart.route.js");
const WishlistRoute = require("./routes/Wishlist.route.js");
const AuthRoute = require("./routes/Auth.route.js");

dotenv.config();

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());
app.use(express.static('public'));

app.use("/api/user", UserRoute);
app.use("/api/auth", AuthRoute);
app.use("/api/product", ProductRoute);
app.use("/api/categories", CategoriesRoute);
app.use("/api/cart", CartRoute);
app.use("/api/wishlist", WishlistRoute);

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server listening on port 3000");
});
