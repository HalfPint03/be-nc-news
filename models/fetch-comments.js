const db = require('../db/connection')

function fetchComments(id){
    return db.query('SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at', [id])
    .then((comments) => {
        if(comments.rows.length === 0){
            return Promise.reject({status: 404, msg: 'Not found'})
        }
        return comments.rows
    })
}

module.exports = fetchComments