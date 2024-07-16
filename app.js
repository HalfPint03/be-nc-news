const express = require('express');
const app = express();
const {getTopics, getEndpoints, getArticleById} = require('./controllers/index')

app.get('/api/topics', getTopics)

app.get('/api', getEndpoints)

app.get('/api/articles/:article_id', getArticleById)

app.use((err, req, res, next) => {
    if(err.code === '22P02'){
        res.status(400).send({msg: 'Bad request'})
    }
    next(err)
})

app.use((err, req, res, next) => {
    if (err.status === 404){
        res.status(err.status).send({msg: err.msg})
    }
    next(err)
})

module.exports = app;