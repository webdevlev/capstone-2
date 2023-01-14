const User = require("../models/User");
const Course = require("../models/Product");
const bcrypt = require("bcrypt");
const auth = require("../auth");
const Product = require("../models/Product");

// Check Email
// Checking Email
module.exports.checkEmailExists = (reqBody, res) => {
  // The result is sent back to the frontend via the "then" method found in the route file
  return User.find({ email: reqBody.email })
    .then((result) => {
      // The "find" method returns a record if a match is found
      if (result.length > 0) {
        return true;
        // No duplicate email found
        // The user is not yet registered in the database
      } else {
        return false;
      }
    })
    .catch((error) => res.send(error));
};

// Register User
module.exports.registerUser = (reqBody) => {
  // Creates a variable "newUser" and instantiates a new "User" object using the mongoose model
  // Uses the information from the request body to provide all the necessary information
  let newUser = new User({
    firstName: reqBody.firstName,
    lastName: reqBody.lastName,
    email: reqBody.email,
    mobileNo: reqBody.mobileNo,
    // 10 is the value provided as the number of "salt" rounds that the bcrypt algorithm will run in order to encrypt the password
    //hashSync(<dataToBeHash>, <saltRound>)
    password: bcrypt.hashSync(reqBody.password, 10),
  });

  // Saves the created object to our database
  return newUser.save().then((user, error) => {
    // User registration failed
    if (error) {
      return false;
      // User registration successful
    } else {
      return true;
    }
  });
};

// Login User
module.exports.loginUser = (reqBody) => {
  return User.findOne({ email: reqBody.email }).then((result) => {
    if (result == null) {
      return false;
    } else {
      const isPasswordCorrect = bcrypt.compareSync(
        reqBody.password,
        result.password
      );

      if (isPasswordCorrect) {
        return { access: auth.createAccessToken(result) };
      } else {
        return { message: "Incorrect Email / Password" };
      }
    }
  });
};

// Retrieve User Details
module.exports.getProfile = (userData) => {
  return User.findById(userData.id).then((result) => {
    if (result == null) {
      return false;
    } else {
      result.password = "*****";

      return result;
    }
  });
};

// User order
module.exports.createOrder = async (data) => {
  if (data.isAdmin == true) {
    return false;
  } else {
    let isUserUpdated = await User.findById(data.userId).then((user) => {
      return Product.findById(data.productId).then((result) => {
        var equal = user.userOrders.find(
          (order) => order.productId === data.productId
        );
        let index = user.userOrders.indexOf(equal);

        if (equal == null) {
          user.userOrders.push({
            productId: data.productId,
            productName: result.name,
            quantity: data.quantity,
            totalAmount: result.price * data.quantity,
          });
        } else {
          let newQuantity = user.userOrders[index].quantity + data.quantity;

          user.userOrders[index].quantity = newQuantity;
          user.userOrders[index].totalAmount =
            result.price * user.userOrders[index].quantity;
        }
        return user.save().then((user, error) => {
          if (error) {
            return false;
          } else {
            return true;
          }
        });
      });
    });

    let isProductUpdated = await Product.findById(data.productId).then(
      (product) => {
        return User.findById(data.userId).then((result) => {
          product.inOrders.push({
            userId: data.userId,
            orderId: result.userOrders[result.userOrders.length - 1]._id,
          });

          return product.save().then((course, error) => {
            if (error) {
              return false;
            } else {
              return true;
            }
          });
        });
      }
    );

    if (isUserUpdated && isProductUpdated) {
      return true;
    } else {
      return false;
    }
  }
};

// Make User Admin
module.exports.makeAdmin = (data) => {
  return User.findById(data.userId).then((result, err) => {
    result.isAdmin = true;

    return result.save().then((adminUser, err) => {
      if (err) {
        return false;
      } else {
        return true;
      }
    });
  });
};

// Retrieve User Order
module.exports.getUserOrders = (userData) => {
  return User.findById(userData.id).then((result) => {
    if (result == null) {
      return false;
    } else {
      return result.userOrders;
    }
  });
};

// Retrieve All Orders Admin
module.exports.getAllOrders = (data) => {
  const AllOrders = [];

  return User.find({}).then((result) => {
    for (let i = 0; i < result.length; i++) {
      AllOrders.push(result[i].userOrders);
    }
    return AllOrders;
  });
};

// Retrieve User Cart
module.exports.addToCart = (userData) => {
  let userCart = [];
  return User.findById(userData.id).then((result) => {
    if (result == null) {
      return false;
    } else {
      userCart.push(result.userOrders);
    }
    return userCart;
  });
};

// Change Product Quantity
module.exports.updateQuantity = (reqParams, reqBody, userData) => {
  return User.findById(userData.id).then((result, error) => {
    return Product.findById(reqBody.productId).then((product, error) => {
      for (let i = 0; i < result.userOrders.length; i++) {
        var equal = result.userOrders.find(
          (order) => order.productId === reqBody.productId
        );
        let index = result.userOrders.indexOf(equal);

        result.userOrders[index].quantity = reqBody.quantity;
        result.userOrders[index].totalAmount =
          result.userOrders[index].quantity * product.price;
        return result.save().then((updatedQuantityItem, err) => {
          if (err) {
            return false;
          } else {
            return true;
          }
        });
      }
    });
  });
};

// Delete Product From Cart
// module.exports.deleteCartItem = (userData, reqBody) => {
//   return User.findById(userData.id).then((result, err) => {
//     for (let i = 0; i < result.userOrders.length; i++) {
//       if (result.userOrders[i].productId == reqBody.productId) {
//         result.userOrders.splice(i, 1);
//         i--;
//       } else {
//         continue;
//         return result.save().then((deletedCartItem, err) => {
//           if (err) {
//             return false;
//           } else {
//             return true;
//           }
//         });
//       }

//       return result.save().then((deletedCartItem, err) => {
//         if (err) {
//           return false;
//         } else {
//           return true;
//         }
//       });
//     }
//   });
//   // console.log(result.userOrders);
//   // console.log(result.userOrders[1]._id);
//   // console.log(reqBody.productId);
// };
module.exports.deleteCartItem = async (data, userData, reqBody) => {
  if (data.isAdmin == true) {
    return false;
  } else {
    let isUserUpdated = await User.findById(userData.id).then((result, err) => {
      for (let i = 0; i < result.userOrders.length; i++) {
        if (result.userOrders[i].productId == reqBody.productId) {
          result.userOrders.splice(i, 1);
          i--;
        } else {
          continue;
          return result.save().then((deletedCartItem, err) => {
            if (err) {
              return false;
            } else {
              return true;
            }
          });
        }

        return result.save().then((deletedCartItem, err) => {
          if (err) {
            return false;
          } else {
            return true;
          }
        });
      }
    });

    // NEEDS TO BE FIXED
    let isProductUpdated = await Product.findById(reqBody.productId).then(
      (product, err) => {
        return User.findById(userData.id).then((result, err) => {
          for (let i = 0; i < result.userOrders.length; i++) {
            var equal = product.inOrders.find(
              (eq) => eq.orderId === result.userOrders[i]._id.valueOf()
            );

            let index = product.inOrders.indexOf(equal);
            product.inOrders.splice(index, 1);
          }

          return product.save().then((course, error) => {
            if (error) {
              return false;
            } else {
              return true;
            }
          });
        });
      }
    );

    if (isProductUpdated && isUserUpdated) {
      return true;
    } else {
      return false;
    }
  }
};
// Get Total Price
module.exports.getTotalPrice = (userData) => {
  let totalArr = [];
  let total = 0;
  return User.findById(userData.id).then((result) => {
    if (result == null) {
      return false;
    } else {
      for (let i = 0; i < result.userOrders.length; i++) {
        total = total + result.userOrders[i].totalAmount;
      }

      totalArr.splice(0, 1, total);
    }
    return totalArr;
  });
};
