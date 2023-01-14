const Product = require("../models/Product");
const User = require("../models/User");

// Create Product (ADMIN ONLY)
module.exports.createProduct = (reqBody) => {
  let newProduct = new Product({
    name: reqBody.name,
    description: reqBody.description,
    price: reqBody.price,
  });

  return newProduct.save().then((product, error) => {
    if (error) {
      return false;
    } else {
      return true;
    }
  });
};

// Retrieve All Products (ADMIN ONLY)
module.exports.getAllProduct = (data) => {
  return Product.find({}).then((result) => {
    return result;
  });
};

// Retrieve All Active Products
module.exports.getAllActive = () => {
  return Product.find({ isActive: true }).then((result) => {
    return result;
  });
};

// Retrieve a Single Product
module.exports.getProduct = (reqParams) => {
  return Product.findById(reqParams.productId).then((result) => {
    return result;
  });
};

// Update a Product (ADMIN ONLY)
module.exports.updateProduct = (reqParams, reqBody) => {
  let updatedProduct = {
    name: reqBody.name,
    description: reqBody.description,
    price: reqBody.price,
  };

  return Product.findByIdAndUpdate(reqParams.productId, updatedProduct).then(
    (updatedProduct, error) => {
      if (error) {
        return false;
      } else {
        return true;
      }
    }
  );
};

// Archive a Product (ADMIN ONLY)
module.exports.archiveProduct = (data) => {
  return Product.findById(data.productId).then((result, err) => {
    if (result.isActive == true) {
      result.isActive = false;

      return result.save().then((archivedProduct, err) => {
        if (err) {
          return false;
        } else {
          return true;
        }
      });
    } else {
      return false;
    }
  });
};

// Activate a Product (ADMIN ONLY)
module.exports.activateProduct = (data) => {
  return Product.findById(data.productId).then((result, err) => {
    if (result.isActive == false) {
      result.isActive = true;

      return result.save().then((archivedProduct, err) => {
        if (err) {
          return false;
        } else {
          return true;
        }
      });
    } else {
      return false;
    }
  });
};
