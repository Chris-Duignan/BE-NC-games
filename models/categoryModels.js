const db = require("../db/connection");

exports.selectCategories = () => {
  return db.query(`SELECT * FROM categories;`).then(({ rows: categories }) => {
    return categories;
  });
};

exports.selectCategoryBySlug = (slug) => {
  slug = slug.replace("_", " ");
  return db
    .query(
      `SELECT * FROM categories
    WHERE slug = $1;`,
      [slug]
    )
    .then(({ rows: [category] }) => {
      if (category === undefined) {
        return Promise.reject({ status: 404, msg: "Category not found" });
      } else {
        return category;
      }
    });
};

exports.insertCategory = (request) => {
  const { slug, description } = request;
  return db.query(
    `INSERT INTO categories
     VALUES
      ($1, $2)
     RETURNING *;`, [slug, description]
  ).then(({rows: [category]}) => {
    return category;
  })
};
