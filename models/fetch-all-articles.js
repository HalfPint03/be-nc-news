const db = require('../db/connection')

function fetchAllArticles(sort_by = 'created_at', order = 'DESC') {
    const sortList = ['author', 'title', 'article_id', 'topic', 'created_at', 'votes', 'article_img_url', 'comment_count']
    const orderList = ['ASC', 'DESC']
    if (sortList.includes(sort_by) && orderList.includes(order)){
        return db.query(`SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.article_id) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.article_id ORDER BY articles.${sort_by} ${order}`)
        .then((articles) => {
            return articles.rows
    })
    } else {
        return Promise.reject({status: 400, msg: 'Bad request'})
    }
    
}
module.exports = fetchAllArticles