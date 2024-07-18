const fetchUsers = require('../models/fetch-users')

function getUsers(req, res, next){
    fetchUsers()
    .then((users) => {
        res.status(200).send({users})
    }).catch((err) => {
        next(err)
    })
}

module.exports = getUsers