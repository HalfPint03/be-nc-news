const fetchArticleById = require('../models/fetch-article-by-id')

function getArticleById(req, res, next){
    fetchArticleById(req.params.article_id)
    .then((article) => {
        res.status(200).send({article})
    }).catch((err) => {
        next(err)
    })
}

module.exports = getArticleById