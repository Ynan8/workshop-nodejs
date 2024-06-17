var express = require("express");
var bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");

var router = express.Router();

var authMiddleware = require("../authMiddleware");
var userSchema = require("../models/users.model.js");
var productSchema = require("../models/products.model.js");
var orderSchema = require("../models/orders.model.js");

/* Auth. */

/* POST login. */
router.post("/login", async function (req, res, next) {
  try {
    let { username, password } = req.body;
    let user = await userSchema.findOne({
      username: username,
    });

    if (!user) {
      return res.status(500).send({
        message: "User not found!!",
      });
    } else {
      const checkPassword = await bcrypt.compare(password, user.password);
      if (!checkPassword) {
        return res.status(500).send({
          message: "Password Invalid!!",
        });
      }

      let isApprove = user.status === true;
      if (!isApprove) {
        return res.status(500).send({
          message: "Status in progress.",
        });
      }

      let products = await productSchema.find();

      let payload = {
        user: {
          firstName: user.firstName,
          lastName: user.lastName,
        },
      };

      const token = jwt.sign(payload, "jwtsecret", { expiresIn: '1h' });

      return res.status(200).send({
        token: token,
        data: payload,
        message: "success",
      });
    }
  } catch (error) {
    return res.status(500).send({
      message: "Login fail",
    });
  }
});


/* POST register. */
router.post("/register", async function (req, res, next) {
  try {
    let { firstName, lastName, username, password } = req.body;
    let user = await userSchema.findOne({ username })
    if(user) {
      return res.send('User Already Exists!!').status(400)
    }
    
    let hashPassword = await bcrypt.hash(password, 10);
    let newUser = new userSchema({
      username,
      firstName,
      lastName,
      password: hashPassword,
    });
    
    user = await newUser.save();
    await user.save();
    return res.status(200).send({
      data: { user },
      message: "Register success",
    });
  } catch (error) {
    return res.status(500).send({
      message: "Register fail",
    });
  }
});

/*PUT approve/:id  */
router.put("/approve/:id", authMiddleware, async function (req, res, next) {
  try {
    let { id } = req.params;
    let { status } = req.body;
    let userStatusUpdate = await userSchema.findByIdAndUpdate(id, { status });

    return res.status(200).send({
      data:  userStatusUpdate ,
      message: "Update status success",
    });
  } catch (error) {
    return res.status(500).send({
      message: "Update status fail",
    });
  }
});

/* Product */

/*GET product/:id  */
router.get("/product/:id", authMiddleware, async function (req, res, next) {
  let { id } = req.params;

  try {
    let product = await productSchema.findById(id);
    return res.status(200).send({
      data: { product },
      message: "Get product success",
    });
  } catch (error) {
    return res.status(500).send({
      message: "Get product fail",
    });
  }
});

/* POST product. */
router.post("/product", async function (req, res, next) {
  try {
    let { title, description, price, quantity } = req.body;

    let product = new productSchema({
      title: title,
      description: description,
      price: price, 
      quantity: quantity,
    });
    await product.save();
    return res.status(200).send({
      data: { product },
      message: "Insert product success",
    });
  } catch (error) {
    return res.status(500).send({
      message: "Insert product fail",
    });
  }
});

/*PUT product/:id  */
router.put("/product/:id", async function (req, res, next) {
  try {
    let { id } = req.params;
    let updateProductData = req.body;

    let updateProduct = await productSchema.findByIdAndUpdate(
      id,
      updateProductData,
      { new: true }
    );
    return res.status(200).send({
      data: updateProduct,
      message: "Update product success",
    });
  } catch (error) {
    return res.status(500).send({
      message: "Update product fail",
    });
  }
});

/*DELETE product/:id  */
router.delete("/product/:id", async function (req, res, next) {
  try {
    let { id } = req.params;

    await productSchema.findByIdAndDelete(id);

    return res.status(200).send({
      message: "Delete product success",
    });
  } catch (error) {
    return res.status(500).send({
      message: "Delete product fail",
    });
  }
});

/* Get products. */
router.get("/products", async function (req, res, next) {
  try {
    let products = await productSchema.find();

    return res.status(200).send({
      data: products,
      message: "Get products success",
    });
  } catch (error) {
    return res.status(500).send({
      message: "Get products fail",
    });
  }
});

/*Product Order */

/*Post orders by product. */
router.post("/products/:id/orders", authMiddleware, async function (req, res, next) {
  try {
    let { id } = req.params;
    let { count } = req.body;

    let productData = await productSchema.findById(id);

    if (count > productData.quantity) {
      return res.status(400).send("Cannot add order!!.");
    }

    let order = new orderSchema({
      product: id,
      count: count,
      price: productData.price,
    });
    await order.save();

    productData.quantity -= count;
    await productData.save();

    return res.status(200).send({
      data: order,
      message: "Insert order success",
    });
  } catch (error) {
    return res.status(500).send({
      message: "Get order fail",
    });
  }
});

/* Get orders by product. */
router.get("/products/:id/orders", authMiddleware, async function (req, res, next) {
  try {
    let { id } = req.params;
    let orders = await orderSchema.find({ product: id });

    return res.status(200).send({
      data: orders,
      message: "Get orders success",
    });
  } catch (error) {
    return res.status(500).send({
      message: "Get orders fail",
    });
  }
});

/* Get orders all. */
router.get("/orders", authMiddleware, async function (req, res, next) {
  try {
    let orders = await orderSchema.find();

    return res.status(200).send({
      data: orders,
      message: "Get orders success",
    });
  } catch (error) {
    return res.status(500).send({
      message: "Get orders fail",
    });
  }
});

module.exports = router;
