const testData = require('../db/data/test-data')
const app = require('../app')
const db = require('../db/connection')
const seed = require('../db/seeds/seed')
const request = require('supertest')

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
            expect(body.topics).toEqual([{
                  description: 'The man, the Mitch, the legend',
                  slug: 'mitch'
                },{
                  description: 'Not dogs',
                  slug: 'cats'
                },{
                  description: 'what books are made of',
                  slug: 'paper'
                }])
        })
    });
});