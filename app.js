const express = require('express');
const app = express();
const {getTopics, getEndpoints, getArticleById, getAllArticles, getComments, postComment, patchVotes, deleteComment, getUsers} = require('./controllers/index')

app.use(express.json())

app.get('/api/topics', getTopics)

app.get('/api', getEndpoints)

app.get('/api/articles/:article_id', getArticleById)

app.get('/api/articles', getAllArticles)

app.get('/api/articles/:article_id/comments', getComments)

app.get('/api/users', getUsers)

app.post('/api/articles/:article_id/comments', postComment)

app.patch('/api/articles/:article_id', patchVotes)

app.delete('/api/comments/:comment_id', deleteComment)





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

app.use((err, req, res, next) => {
    if (err.status === 400){
        res.status(err.status).send({msg: err.msg})
    }
    next(err)
})

app.use((err, req, res, next) => {
    res.status(500).send({msg: 'Server Error'})
})

module.exports = app;