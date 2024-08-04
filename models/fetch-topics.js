const db = require('../db/connection')

function fetchTopics(){
    return db.query('SELECT * FROM topics;')
    .then((topics) => {
       return topics.rows
    })
}

function checkTopicExists(topic) {
    return db.query(`SELECT * FROM topics WHERE slug = $1`, [topic]).then((response) => {
        const topics = response.rows

        if (!topics.length) {
            return Promise.reject({status: 404, msg: 'Not found'})
        }
    })
}

module.exports = {fetchTopics, checkTopicExists};