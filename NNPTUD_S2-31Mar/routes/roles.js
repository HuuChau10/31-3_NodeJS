var express = require('express');
var router = express.Router();
const roleSchema = require('../schemas/role');
const { isAdmin, authenticate } = require('../routes/auth');

router.get('/', async function (req, res, next) {
  try {
    let roles = await roleSchema.find({});
    res.send({ success: true, data: roles });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
});

router.post('/', authenticate, isAdmin, async function (req, res, next) {
  try {
    let { name } = req.body;
    let newRole = new roleSchema({ name });
    await newRole.save();
    res.status(201).send({ success: true, data: newRole });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
});

module.exports = router;
