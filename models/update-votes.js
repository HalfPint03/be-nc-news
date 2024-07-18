const db = require("../db/connection");
const fetchArticleById = require("./fetch-article-by-id");

function updateVotes(id, votes) {
  if (votes === undefined) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }
  const idExists = fetchArticleById(id);
  const updateQuery = db.query("UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING*",[votes, id])
    .then((article) => {
      return article.rows;
    });
  return Promise.all([idExists, updateQuery])
  .then((result) => {
    return result[1]
  })
}

module.exports = updateVotes;
