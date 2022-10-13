const db = require("../db/connection")

exports.selectCommentById = (id) => {
    return db
        .query(
            `SELECT * FROM comments
            WHERE comment_id = $1`, [id]
        )
        .then(({rows: comment}) => {
            if (comment.length === 0) {
                return Promise.reject({status: 404, msg: `Id ${id} not found`});
            }
        })
}

exports.removeCommentById = (id) => {
    return db
        .query(
            `DELETE FROM comments
            WHERE comment_id = $1`, [id]
        )
};

