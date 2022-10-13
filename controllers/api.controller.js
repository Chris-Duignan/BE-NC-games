const { selectEndpoints } = require("../models/api.model");

exports.getEndpoints = (req, res, next) => {
  selectEndpoints().then((endpoints) => {
    res.status(200).send({ endpoints });
  }).catch(next);
};
