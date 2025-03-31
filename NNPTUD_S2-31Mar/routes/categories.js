var express = require('express');
var router = express.Router();
let categorySchema = require('../schemas/category');
const { authenticate, authorize } = require('../routes/auth');

router.get('/', async function(req, res, next) {
  let categories = await categorySchema.find({});
  res.status(200).send({
    success: true,
    data: categories
  });
});

router.get('/:id', async function(req, res, next) {
  try {
    let id = req.params.id;
    let category = await categorySchema.findById(id);
    res.status(200).send({
      success: true,
      data: category
    });
  } catch (error) {
    res.status(404).send({
      success: false,
      message: error.message
    });
  }
});

router.post('/', authenticate, authorize(['mod']), async function(req, res, next) {
  try {
    let body = req.body;
    let newCategory = new categorySchema({ name: body.name });
    await newCategory.save();
    res.status(200).send({
      success: true,
      data: newCategory
    });
  } catch (error) {
    res.status(404).send({
      success: false,
      message: error.message
    });
  }
});

router.put('/:id', authenticate, authorize(['mod']), async function(req, res, next) {
  try {
    let id = req.params.id;
    let category = await categorySchema.findById(id);
    if (category) {
      let body = req.body;
      if (body.name) {
        category.name = body.name;
      }
      await category.save();
      res.status(200).send({
        success: true,
        data: category
      });
    } else {
      res.status(404).send({
        success: false,
        message: "ID không tồn tại"
      });
    }
  } catch (error) {
    res.status(404).send({
      success: false,
      message: error.message
    });
  }
});

router.delete('/:id', authenticate, authorize(['admin']), async function(req, res, next) {
  try {
    let id = req.params.id;
    let category = await categorySchema.findById(id);
    if (category) {
      category.isDeleted = true;
      await category.save();
      res.status(200).send({
        success: true,
        data: category
      });
    } else {
      res.status(404).send({
        success: false,
        message: "ID không tồn tại"
      });
    }
  } catch (error) {
    res.status(404).send({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
