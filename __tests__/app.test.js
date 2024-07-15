const testData = require('../db/data/test-data')
const app = require('../app')
const db = require('../db/connection')
const seed = require('../db/seeds/seed')
const request = require('supertest')
const fs = require('fs.promises')

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
            return fs.readFile('./endpoints.json')
            .then((endpoints) => {
                expect(body.endpoints).toEqual(JSON.parse(endpoints))
            })
            
        })
    });
});