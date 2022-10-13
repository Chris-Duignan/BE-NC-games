const { getUsers } = require("../controllers/usersControllers")
const userRouter = require("express").Router();

userRouter.get("/", getUsers)

module.exports = userRouter;