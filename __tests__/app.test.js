const testData = require('../db/data/test-data')
const app = require('../app')
const db = require('../db/connection')
const seed = require('../db/seeds/seed')
const request = require('supertest')
const endpoints = require('../endpoints.json')
const sorted = require('jest-sorted')

beforeEach(() => {
    return seed(testData)
})

afterAll(() => {
    return db.end();
})

describe('GET:200 /api/topics', () => {
    test('GET: responds with 200 and an array of topic objects with properties of slug and description', () => {
        return request(app)
        .get('/api/topics')
        .expect(200)
        .then(({body}) => {
            body.topics.forEach((topic) => {
                expect(topic).toHaveProperty('description')
                expect(topic).toHaveProperty('slug')
            })
        })
    });
});
describe('GET:200 /api', () => {
    test('GET: responds with an object with all endpoints and info about them', () => {
        return request(app)
        .get('/api')
        .expect(200)
        .then(({body}) => {
            expect(body.endpoints).toEqual(endpoints)
        })
    })
});
describe('GET:200 /api/articles/:article_id', () => {
    test('GET: responds with an article object: author, title, article_id, body, topic, created_at, votes, article_img_url', () => {
        return request(app)
        .get('/api/articles/3')
        .expect(200)
        .then(({body}) => {
            expect(body.article).toEqual({
                article_id: 3,
                title: 'Eight pug gifs that remind me of mitch',
                topic: 'mitch',
                author: 'icellusedkars',
                body: 'some gifs',
                created_at: '2020-11-03T09:12:00.000Z',
                votes: 0,
                article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
              })

        })
    });
    test('GET: if passed an invalid id number, responds with an error', () => {
        return request(app)
        .get('/api/articles/100')
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toEqual('Not found')
        })
    });
    test('GET: if passed NAN, responds with an error', () => {
        return request(app)
        .get('/api/articles/doilooklikeanumber')
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toEqual('Bad request')
        })
    });
});
describe('GET:200 /api/articles', () => {
    test('GET: responds with an array of all articles without body and added comment count', () => {
        return request(app)
        .get('/api/articles')
        .expect(200)
        .then(({body}) => {
            expect(body.articles).toBeSortedBy('created_at', {descending: true})
            body.articles.forEach((article) => {
                expect(article).toHaveProperty('author')
                expect(article).toHaveProperty('title')
                expect(article).toHaveProperty('article_id')
                expect(article).toHaveProperty('topic')
                expect(article).toHaveProperty('created_at')
                expect(article).toHaveProperty('votes')
                expect(article).toHaveProperty('article_img_url')
                expect(article).toHaveProperty('comment_count')
                expect(article).not.toHaveProperty('body')
            })
        })
    }); //errors???
});
describe('GET:200: /api/articles/:article_id/comments', () => {
    test('GET: responds with an array of comments for the given article', () => {
        return request(app)
        .get('/api/articles/1/comments')
        .expect(200)
        .then(({body}) => {
            if(body.comments.length > 0){
                expect(body.comments).toBeSortedBy('created_at')
                body.comments.forEach((comment) => {
                    expect(comment).toHaveProperty('comment_id')
                    expect(comment).toHaveProperty('votes')
                    expect(comment).toHaveProperty('created_at')
                    expect(comment).toHaveProperty('author')
                    expect(comment).toHaveProperty('body')
                    expect(comment.article_id).toBe(1)
            })
            }
        })
    });
    test('GET: if passed a number > the amount of comments, responds with an error', () => {
        return request(app)
        .get('/api/articles/100/comments')
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe('Not found')
        })
    });
    test('GET: if passed nan, responds with an error', () => {
        return request(app)
        .get('/api/articles/ten/comments')
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('Bad request')
        })
    });
    test('GET: if passed an article_id that has no comments, responds with an empty array', () => {
        return request(app)
        .get('/api/articles/2/comments')
        .expect(200)
        .then(({body}) => {
            expect(body.comments).toEqual([])
        })
    });
});
describe('POST:201: /api/articles/:article_id/comments', () => {
    test('POST: accepts an object with username and body, responds with the posted comment', () => {
        return request(app)
        .post('/api/articles/2/comments')
        .send({
            username: 'rogersop',
            body: 'Dave was a good man'
        })
        .expect(201)
        .then(({body}) => {
            expect(body.newComment[0].author).toBe('rogersop')
            expect(body.newComment[0].body).toBe('Dave was a good man')
            expect(body.newComment[0].article_id).toBe(2)
            expect(body.newComment[0].votes).toBe(0)
            expect(body.newComment[0].comment_id).toBe(19)
        })
    });
    test('POST: if sent object is missing a body, responds with an error', () => {
        return request(app)
        .post('/api/articles/2/comments')
        .send({username: 'rogersop'})
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('Bad request')
        })
    });
    test('POST: if sent object is missing a username, responds with an error', () => {
        return request(app)
        .post('/api/articles/2/comments')
        .send({body: 'no one here'})
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('Bad request')
        })
    });
    test('POST: if sent an empty object, responds with an error', () => {
        return request(app)
        .post('/api/articles/2/comments')
        .send({})
        .expect(400)
        .then(({body}) => [
            expect(body.msg).toBe('Bad request')
        ])
    });
});
describe('PATCH: /apr/articles/:article_id', () => {
    test('PATCH: takes an object with inc_votes, responds with specific article and its votes updated to the given value', () => {
        return request(app)
        .patch('/api/articles/1')
        .send({inc_votes: 10})
        .expect(200)
        .then(({body}) => {
            expect(body.article[0].votes).toBe(110)
        })
    });
    test('PATCH: if passed an object with a - value, responds with specific article and its votes updated to a smaller value', () => {
        return request(app)
        .patch('/api/articles/1')
        .send({inc_votes: -10})
        .expect(200)
        .then(({body}) => {
            expect(body.article[0].votes).toBe(90)
        })
    });
    test('PATCH: if passed an object without a value, responds with an error', () => {
        return request(app)
        .patch('/api/articles/1')
        .send({})
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('Bad request')
        })
    });
    test('PATCH: if passed an id that does not exist, responds with an error', () => {
        return request(app)
        .patch('/api/articles/100')
        .send({inc_votes: 10})
        .expect(404)
        .then(({body}) => {
            console.log(body)
            expect(body.msg).toBe('Not found')
        })
    });
});