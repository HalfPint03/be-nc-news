const db = require('../db/connection')
const fetchArticleById = require('../models/fetch-article-by-id')

function fetchComments(id){
    const collectedComments = db.query('SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at', [id])
    .then((comments) => {
        return comments.rows
    })
    return Promise.all([fetchArticleById(id), collectedComments])
    .then((result) => {
        if(result[0].length > 0 && result[1].length === 0){
            return []
        }
        return result[1]
    })
}

module.exports = fetchComments