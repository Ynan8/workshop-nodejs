var express = require('express');
var router = express.Router();
var userSchema = require('../models/users.model.js')
var bcrypt = require('bcrypt')


/* Get users. */
router.get('/', async function(req, res, next) {
  try{
    let users = await userSchema.find()
    console.log("user path")
    res.send(users);
  }catch(error){
    return res.status(500).send(error.toString())
  }
});

/* POST users. */
router.post('/', async function(req, res, next) {
  try{

    let { firstName, lastName, username, password } = req.body
    let hashPassword = await bcrypt.hash(password,10)

      let user = new userSchema({
        firstName: firstName,
        lastName: lastName,
        username: username,
        password: hashPassword, 
      })
      await user.save()
      return res.send("Insert User Success.");
    }catch(error){
      return res.status(500).send(error.toString())
    }
});

/* POST login. */
router.post('/login', async function(req, res, next) {
  try{

    let { firstName, lastName, username, password } = req.body
    let hashPassword = await bcrypt.hash(password,10)

      let user = new userSchema({
        firstName: firstName,
        lastName: lastName,
        username: username,
        password: hashPassword, 
      })
      await user.save()
      return res.send("Insert User Success.");
    }catch(error){
      return res.status(500).send(error.toString())
    }
});

// if (user) {
//   let isApprove = user.status === true;
//   if (!isApprove) {
//     return res.send("Status is progress.");
//   } else {

//     let products = await productSchema.find();
//     return res.status(200).send({
//       data: { products },
//       message: "Login success",
//     });
//   }
// } else {
//   return res.send("User not found.!!");
// }




module.exports = router;
