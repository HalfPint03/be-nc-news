const db = require('../db/connection')

function fetchArticleById(id){
    return db.query('SELECT * FROM articles WHERE article_id = $1', [id]).then((result) => {
        if (result.rows.length === 0){
            return {};
        }
        return(result.rows[0])
    })
}

module.exports = fetchArticleById;