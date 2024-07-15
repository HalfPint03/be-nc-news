const db = require('../db/connection')
const fs = require('fs.promises')

function fetchEndpoints(){
    return fs.readFile('./endpoints.json')
    .then((endpoints) => {
        return JSON.parse(endpoints)
    })
}

module.exports = fetchEndpoints;