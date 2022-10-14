exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};

exports.handlePSQLErrors = (err, req, res, next) => {
  if(err.code === "23502") {
    res.status(400).send({msg: "Required field/s missing"})
  } else if (err.code === "22P02") {
    res.status(400).send({ msg: "Unexpected field type" });
  }
};

exports.handleInternalError = (err, req, res, next) => {
  res.status(500).send({ msg: "Internal Server Error" });
};
