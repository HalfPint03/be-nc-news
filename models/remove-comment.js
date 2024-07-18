const db = require('../db/connection')

function removeComment(id){
    if (parseInt(id) === 'NaN'){
        return Promise.reject({status: 400, msg: 'Bad request'})
    }
    return db.query('DELETE FROM comments WHERE comment_id = $1', [id])
    .then((result) => {
        if(result.rowCount === 0){
            return Promise.reject({status: 404, msg: 'Not found'})
        }
        return result.rows
    })
}

module.exports = removeComment