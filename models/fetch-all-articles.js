const db = require('../db/connection')

function fetchAllArticles() {
    return db.query('SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.article_id) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.article_id ORDER BY articles.created_at DESC')
    .then((articles) => {
        return articles.rows
})
}
module.exports = fetchAllArticles