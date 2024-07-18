const removeComment = require('../models/remove-comment')

function deleteComment(req, res, next){
    const id = req.params.comment_id
    removeComment(id)
    .then((result) => {
        res.status(204).send({result})
    }).catch((err) => {
        next(err)
    })
}

module.exports = deleteComment