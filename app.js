const express = require('express');
const app = express();
const getTopics = require('./controllers/get-topics')

app.get('/api/topics', getTopics)

module.exports = app;