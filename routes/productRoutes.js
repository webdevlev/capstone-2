const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const auth = require("../auth");

// Create Product Route (ADMIN ONLY)
router.post("/createProduct", auth.verify, (req, res) => {
  const userData = auth.decode(req.headers.authorization);

  if (userData.isAdmin) {
    productController
      .createProduct(req.body)
      .then((resultFromController) => res.send(resultFromController));
  } else {
    res.send({ message: "This function is not available for users." });
  }
});

// Retrieve All Products Route (ADMIN ONLY)
router.get("/all", auth.verify, (req, res) => {
  const userData = auth.decode(req.headers.authorization);
  if (userData.isAdmin) {
    productController
      .getAllProduct(userData)
      .then((resultFromController) => res.send(resultFromController));
  } else {
    res.send({ message: "This function is not available for users." });
  }
});

// Retrieve All Active Products Route
router.get("/", (req, res) => {
  productController
    .getAllActive()
    .then((resultFromController) => res.send(resultFromController));
});

module.exports = router;

// Retrieve Single Product Route
router.get("/:productId", (req, res) => {
  console.log(req.params.courseId);

  productController
    .getProduct(req.params)
    .then((resultFromController) => res.send(resultFromController));
});

// Update a Product Route (ADMIN ONLY)
router.put("/:productId", auth.verify, (req, res) => {
  const userData = auth.decode(req.headers.authorization);

  if (userData.isAdmin) {
    productController
      .updateProduct(req.params, req.body)
      .then((resultFromController) => res.send(resultFromController));
  } else {
    res.send({ message: "This function is not available for users." });
  }
});

// Archive a Product (ADMIN ONLY)
router.put("/archive/:productId", auth.verify, (req, res) => {
  const userData = auth.decode(req.headers.authorization);

  if (userData.isAdmin) {
    productController
      .archiveProduct(req.params, req.body)
      .then((resultFromController) => res.send(resultFromController));
  } else {
    res.send({ message: "This function is not available for users." });
  }
});

// Activate a Product (ADMIN ONLY)
router.put("/activate/:productId", auth.verify, (req, res) => {
  const userData = auth.decode(req.headers.authorization);

  if (userData.isAdmin) {
    productController
      .activateProduct(req.params, req.body)
      .then((resultFromController) => res.send(resultFromController));
  } else {
    res.send({ message: "This function is not available for users." });
  }
});
