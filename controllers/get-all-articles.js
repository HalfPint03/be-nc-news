const fetchAllArticles = require("../models/fetch-all-articles")

function getAllArticles(req, res, next){
    fetchAllArticles()
    .then((articles) => {
        res.status(200).send({articles})
    }).catch((err) => {
        next(err)
    })
}

module.exports = getAllArticles