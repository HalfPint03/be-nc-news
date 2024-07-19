const fetchAllArticles = require("../models/fetch-all-articles")

function getAllArticles(req, res, next){
    const sort_by = req.query.sort_by
    const order = req.query.order
    const topic = req.query.topic
    fetchAllArticles(sort_by, order, topic)
    .then((articles) => {
        res.status(200).send({articles})
    }).catch((err) => {
        next(err)
    })
}

module.exports = getAllArticles