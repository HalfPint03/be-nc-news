const db = require('../db/connection')

function fetchArticleById(id){
    return db.query('SELECT * FROM articles WHERE article_id = $1', [id]).then((result) => {
        if (result.rows.length === 0){
            return Promise.reject({status: 404, msg: 'Not found'})
        }
        return(result.rows[0])
    })
}

module.exports = fetchArticleById;