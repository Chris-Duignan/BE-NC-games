const apiRouter = require("express").Router();

const { getEndpoints } = require("../controllers/api.controller");

const categoryRouter = require("./categories-router");
const userRouter = require("./users-router");
const commentRouter = require("./comments-router")
const reviewRouter = require("./reviews-router");

apiRouter.get("/", getEndpoints);
apiRouter.use("/categories", categoryRouter);
apiRouter.use("/users", userRouter);
apiRouter.use("/comments", commentRouter);
apiRouter.use("/reviews", reviewRouter);

module.exports = apiRouter;
