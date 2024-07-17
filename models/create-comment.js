const db = require('../db/connection')

function createComment(id, comment){
    if (!comment.username || !comment.body){
        return Promise.reject({status: 400, msg: 'Bad request'})
    }
    if (!comment.username && !comment.body){
        return Promise.reject({status: 400, msg: 'Bad request'})
    }
    return db.query('INSERT INTO comments (article_id, author, body) VALUES ($1, $2, $3) RETURNING*', [id, comment.username, comment.body]).then((newComment) => {
        return newComment.rows
    })
}

module.exports = createComment