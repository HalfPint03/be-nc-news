const fetchComments = require("../models/fetch-comments")


function getComments(req, res, next){
    const id = req.params.article_id;
    fetchComments(id)
    .then((comments) => {
        res.status(200).send({comments})
    }).catch((err) => {
        next(err)
    })
}

module.exports = getComments