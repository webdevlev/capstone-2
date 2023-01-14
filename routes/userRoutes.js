const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const auth = require("../auth");

router.post("/checkEmail", (req, res) => {
  userController
    .checkEmailExists(req.body, res)
    .then((resultFromController) => res.send(resultFromController));
});

// USER REGISTRATION
router.post("/register", (req, res) => {
  userController
    .registerUser(req.body)
    .then((resultFromController) => res.send(resultFromController));
});

// User Login Route
router.post("/login", (req, res) => {
  userController
    .loginUser(req.body)
    .then((resultFromController) => res.send(resultFromController));
});

module.exports = router;

// Retrieve User Detail Route
router.post("/details", auth.verify, (req, res) => {
  const userData = auth.decode(req.headers.authorization);

  userController
    .getProfile({ id: userData.id })
    .then((resultFromController) => res.send(resultFromController));
});

// User Order Route
router.post("/order", auth.verify, (req, res) => {
  const userData = auth.decode(req.headers.authorization);

  let data = {
    userId: userData.id,
    isAdmin: userData.isAdmin,
    productId: req.body.productId,
    quantity: req.body.quantity,
  };

  userController
    .createOrder(data)
    .then((resultFromController) => res.send(resultFromController));
});

// Make User Admin Route
router.put("/admin/:userId", auth.verify, (req, res) => {
  const userData = auth.decode(req.headers.authorization);

  if (userData.isAdmin) {
    userController
      .makeAdmin(req.params, req.body)
      .then((resultFromController) => res.send(resultFromController));
  } else {
    res.send({ message: "This function is not available for users." });
  }
});

// Retrieve User Orders Route
router.post("/Orders", auth.verify, (req, res) => {
  const userData = auth.decode(req.headers.authorization);

  userController
    .getUserOrders({ id: userData.id })
    .then((resultFromController) => res.send(resultFromController));
});

// Retrieve All Orders Route
router.get("/allOrders", auth.verify, (req, res) => {
  const userData = auth.decode(req.headers.authorization);

  if (userData.isAdmin) {
    userController
      .getAllOrders(userData)
      .then((resultFromController) => res.send(resultFromController));
  } else {
    res.send({ message: "This function is not available for users." });
  }
});

// Add to Cart Route
router.post("/addToCart", auth.verify, (req, res) => {
  const userData = auth.decode(req.headers.authorization);

  userController
    .addToCart({ id: userData.id })
    .then((resultFromController) => res.send(resultFromController));
});

// Change Product Quantity Route
router.put("/changeProductQuantity", auth.verify, (req, res) => {
  const userData = auth.decode(req.headers.authorization);

  userController
    .updateQuantity(req.params, req.body, userData)
    .then((resultFromController) => res.send(resultFromController));
});

// Remove Products From Cart Route
router.put("/deleteCartItem", auth.verify, (req, res) => {
  const userData = auth.decode(req.headers.authorization);
  let data = {
    userId: userData.id,
    isAdmin: userData.isAdmin,
    productId: req.body.productId,
    quantity: req.body.quantity,
  };
  userController
    .deleteCartItem(data, userData, req.body)
    .then((resultFromController) => res.send(resultFromController));
});

// Get Total Price
router.get("/getTotalPrice", auth.verify, (req, res) => {
  const userData = auth.decode(req.headers.authorization);

  userController
    .getTotalPrice(userData)
    .then((resultFromController) => res.send(resultFromController));
});
