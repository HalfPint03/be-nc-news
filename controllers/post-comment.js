const createComment = require('../models/create-comment')

function postComment(req, res, next){
    const id = req.params.article_id
    const comment = req.body
    createComment(id, comment)
    .then((newComment) => {
        res.status(201).send({newComment})
    }).catch((err) => {
        next(err)
    })
}

module.exports = postComment