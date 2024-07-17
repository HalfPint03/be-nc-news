const updateVotes = require("../models/update-votes")

function patchVotes(req, res, next) {
    const votes = req.body.inc_votes
    const id = req.params.article_id
    updateVotes(id, votes)
    .then((article) => {
        res.status(200).send({article})
    }).catch((err) => {
        next(err)
    })
}

module.exports = patchVotes