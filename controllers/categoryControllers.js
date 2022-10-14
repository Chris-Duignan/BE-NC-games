const {
  selectCategories,
  insertCategory,
} = require("../models/categoryModels");

exports.getCategories = (req, res, next) => {
  selectCategories()
    .then((categories) => {
      res.status(200).send({ categories });
    })
    .catch(next);
};

exports.postCategory = (req, res, next) => {
  const request = req.body;
  insertCategory(request)
    .then((category) => {
      res.status(201).send({ category });
    })
    .catch(next);
};
