const db = require("../db/connection");
const { sort } = require("../db/data/test-data/categories");

exports.selectReviewById = (id) => {
  return db
    .query(
      ` SELECT reviews.*, COUNT(comments.comment_id) ::INT AS comment_count 
      FROM reviews
      LEFT JOIN comments 
      ON reviews.review_id = comments.review_id
      WHERE reviews.review_id = $1
      GROUP BY reviews.review_id;`,
      [id]
    )
    .then(({ rows: [review] }) => {
      if (review === undefined) {
        return Promise.reject({ status: 404, msg: `Id ${id} not Found` });
      } else {
        return review;
      }
    });
};

exports.selectReviewCommentsById = (id, limit = 10, p = 1) => {
  const queryStr = `SELECT * FROM comments
                    WHERE review_id = $1
                    ORDER BY created_at DESC
                    LIMIT $2 OFFSET $3`;

  return db
    .query(queryStr, [id, limit, p * limit - limit])
    .then(({ rows: comments }) => {
      return comments;
    });
};

exports.selectReviews = (
  category,
  sort_by = "created_at",
  order = "DESC",
  limit = 10,
  p = 1
) => {
  validSortQueries = [
    "review_id",
    "category",
    "designer",
    "owner",
    "review_body",
    "review_img_url",
    "created_at",
    "votes",
    "comment_count"
  ];
  validOrderQueries = ["ASC", "DESC", "asc", "desc"];

  if (!validSortQueries.includes(sort_by)) {
    return Promise.reject({ status: 400, msg: "Invalid sort query" });
  } else if (!validOrderQueries.includes(order)) {
    return Promise.reject({ status: 400, msg: "Invalid order query" });
  }

  let countStr = `SELECT COUNT(*)::INT FROM reviews`
  const countValues=[];

  if (category !== undefined) {
    category = category.replace("_", " ")
    countValues.push(category);
    countStr += ` WHERE category = $1`
  }

  let queryStr = `SELECT reviews.*, COUNT(comments.comment_id) ::INT AS comment_count
                    FROM reviews
                    LEFT JOIN comments
                    on reviews.review_id = comments.review_id`;
  const queryValues = [];

  if (category !== undefined) {
    queryValues.push(category);
    queryStr += ` WHERE category = $1`;
  }

  queryStr += " GROUP BY reviews.review_id";

  queryValues.push(limit);
  queryStr += ` ORDER BY ${sort_by} ${order}
                LIMIT $${queryValues.length}`;

  queryValues.push(p * limit - limit);
  queryStr += ` OFFSET $${queryValues.length}`;

  return Promise.all([db.query(queryStr, queryValues), db.query(countStr,countValues)]).then((promises) => {
    const returnObj = {};
    returnObj.total_count = promises[1].rows[0].count;
    returnObj.reviews = promises[0].rows;
    return returnObj;
  });
};

exports.insertReview = (request) => {
  const { owner, title, review_body, designer, category } = request;

  return db
    .query(
      `INSERT INTO reviews
        (owner, title, review_body, designer, category)
       VALUES
        ($1, $2, $3, $4, $5)
        RETURNING review_id;`,
      [owner, title, review_body, designer, category]
    )
    .then(({ rows: [review] }) => {
      const { review_id } = review;
      return this.selectReviewById(review_id);
    })
    .then((review) => {
      delete review.review_img_url;
      return review;
    });
};

exports.insertCommentByReviewId = (id, comment) => {
  const { username, body } = comment;

  if (!username || !body) {
    return Promise.reject({ status: 400, msg: "Required field/s missing" });
  } else if (typeof username !== "string" || typeof body !== "string") {
    return Promise.reject({ status: 400, msg: "Unexpected field type" });
  } else {
    return db
      .query(
        `INSERT INTO comments
          (author, body, review_id)
        VALUES 
          ($1, $2, $3)
        RETURNING *`,
        [username, body, id]
      )
      .then(({ rows: comment }) => {
        return comment[0];
      });
  }
};

exports.updateReviewVotesById = (id, update) => {
  if (!update.inc_votes) {
    return Promise.reject({ status: 400, msg: "Please enter inc_votes field" });
  }

  const { inc_votes } = update;
  return db
    .query(
      `UPDATE reviews
      SET 
        votes = votes + $1
      WHERE review_id = $2
      RETURNING *;`,
      [inc_votes, id]
    )
    .then(({ rows: review }) => {
      if (review.length === 0) {
        return Promise.reject({ status: 404, msg: `Id ${id} not found` });
      } else {
        return review[0];
      }
    });
};

exports.removeReviewById = (id) => {
  return db.query(
    `DELETE FROM comments
     WHERE review_id = $1`, [id]
  ).then(() => {
    return db.query(
      `DELETE FROM reviews
       WHERE review_id = $1`, [id]
    ).then(({rowCount}) => {

      if (rowCount === 0) {
        return Promise.reject({status: 404, msg: `Id ${id} not found`})
      }
    })
  })
}