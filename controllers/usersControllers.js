const {selectUsers} = require("../models/usersModels");

exports.getUsers = (req, res, next) => {
    selectUsers().then((users) => {
        res.status(200).send({users});
    }).catch(next);
}