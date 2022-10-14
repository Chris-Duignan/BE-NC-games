const db = require("../db/connection")

exports.updateCommentVotesById = (id, update) => {
    const { inc_votes } = update
    return db
        .query(
            `UPDATE comments
             SET 
                votes = votes + $1
             WHERE comment_id = $2
             RETURNING *`, [inc_votes, id]
        ).then(({rows: [comment]}) => {
            if (comment === undefined) {
                return Promise.reject({status: 404, msg: `Id ${id} not found`})
            }
            return comment;
        })
}


exports.removeCommentById = (id) => {
    return db
        .query(
            `DELETE FROM comments
            WHERE comment_id = $1`, [id]
        ).then(({rowCount}) => {
            if (rowCount === 0) {
                return Promise.reject({status: 404, msg: `Id ${id} not found`})
            }
        })
};

