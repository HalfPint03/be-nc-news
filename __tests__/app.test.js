const testData = require('../db/data/test-data')
const app = require('../app')
const db = require('../db/connection')
const seed = require('../db/seeds/seed')
const request = require('supertest')
const endpoints = require('../endpoints.json')

beforeEach(() => {
    return seed(testData)
})

afterAll(() => {
    return db.end();
})

describe('/api/topics', () => {
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
describe('/api', () => {
    test('GET: responds with an object with all endpoints and info about them', () => {
        return request(app)
        .get('/api')
        .expect(200)
        .then(({body}) => {
            expect(body.endpoints).toEqual(endpoints)
        })
    })
});
describe('/api/articles/:article_id', () => {
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
    test('GET: if passed an invalid id number, responds with an empty object', () => {
        return request(app)
        .get('/api/articles/100')
        .expect(200)
        .then(({body}) => {
            expect(body.article).toEqual({})
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