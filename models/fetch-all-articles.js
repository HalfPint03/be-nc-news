const db = require("../db/connection");
const {checkTopicExists} = require('../models/fetch-topics')

function fetchAllArticles(sort_by = "created_at", order = "DESC", topic) {
  const sortList = [
    "author",
    "title",
    "article_id",
    "topic",
    "created_at",
    "votes",
    "article_img_url",
    "comment_count",
  ];
  const orderList = ["ASC", "DESC"];
  const topicValue = [];
  let selectQuery = `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.article_id) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id `;
  const promisesArr = []

  if (topic) {
      promisesArr.push(checkTopicExists(topic))
      selectQuery += `WHERE articles.topic = $1 `;
      topicValue.push(topic);
  }

  if (sortList.includes(sort_by) && orderList.includes(order)) {
    selectQuery += `GROUP BY articles.article_id ORDER BY articles.${sort_by} ${order}`;
    const finalQuery = db.query(selectQuery, topicValue).then((articles) => {
      return articles.rows;})
      promisesArr.push(finalQuery)

     return Promise.all(promisesArr).then((resolvedPromises) => {
      return resolvedPromises.length > 1 ? resolvedPromises[1]: resolvedPromises[0]
     }) 
    
   
  } else {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }
}
module.exports = fetchAllArticles;
