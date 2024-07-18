const fetchAllArticles = require("../models/fetch-all-articles")

function getAllArticles(req, res, next){
    const sort_by = req.query.sort_by
    const order = req.query.order
    fetchAllArticles(sort_by, order)
    .then((articles) => {
        res.status(200).send({articles})
    }).catch((err) => {
        next(err)
    })
}

module.exports = getAllArticles