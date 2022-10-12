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

exports.selectReviewCommentsById = (id) => {
  return db
    .query(
      `SELECT *
      FROM comments
      WHERE review_id = $1
      ORDER BY created_at DESC`,
      [id]
    )
    .then(({ rows: comments }) => {
      return comments;
    });
};

exports.selectReviews = (category, sort_by, order) => {
  let queryStr = `SELECT reviews.*, COUNT(comments.comment_id) ::INT AS comment_count
                    FROM reviews
                    LEFT JOIN comments
                    on reviews.review_id = comments.comment_id`;
  const queryValues = [];

  if (category !== undefined) {
    category = category.replace("_", " ");
    queryValues.push(category);
    queryStr += ` WHERE category = $1`;
  }

  queryStr +=  " GROUP BY reviews.review_id"

  if (sort_by) {
    queryStr += ` ORDER BY ${sort_by}`;
  } else {
    queryStr += ` ORDER BY created_at`;
  }

  if (order) {
    queryStr += ` ${order};`;
  } else {
    queryStr += " DESC;"
  };

  return db.query(queryStr, queryValues).then(({ rows: reviews }) => {
    return reviews;
  });
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
