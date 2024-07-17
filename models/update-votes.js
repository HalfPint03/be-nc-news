const db = require("../db/connection");
const fetchArticleById = require("./fetch-article-by-id");

function updateVotes(id, votes) {
  return fetchArticleById(id).then(() => {
    if (votes === undefined) {
      return Promise.reject({ status: 400, msg: "Bad request" });
    } else {
      return db
        .query(
          "UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING*",
          [votes, id]
        )
        .then((article) => {
          return article.rows;
        });
    }
  });
}

module.exports = updateVotes;
