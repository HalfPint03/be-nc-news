const testData = require("../db/data/test-data");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const request = require("supertest");
const endpoints = require("../endpoints.json");
const sorted = require("jest-sorted");

beforeEach(() => {
  return seed(testData);
});

afterAll(() => {
  return db.end();
});

describe("GET:200 /api/topics", () => {
  test("GET: responds with 200 and an array of topic objects with properties of slug and description", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        body.topics.forEach((topic) => {
          expect(topic).toHaveProperty("description");
          expect(topic).toHaveProperty("slug");
        });
      });
  });
});
describe("GET:200 /api", () => {
  test("GET: responds with an object with all endpoints and info about them", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        expect(body.endpoints).toEqual(endpoints);
      });
  });
});
describe("GET:200 /api/articles/:article_id", () => {
  test("GET:200 responds with an article object: author, title, article_id, body, topic, created_at, votes, article_img_url", () => {
    return request(app)
      .get("/api/articles/3")
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toEqual({
          article_id: 3,
          title: "Eight pug gifs that remind me of mitch",
          topic: "mitch",
          author: "icellusedkars",
          body: "some gifs",
          created_at: "2020-11-03T09:12:00.000Z",
          votes: 0,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });
  test("GET:404 if passed an invalid id number, responds with an error", () => {
    return request(app)
      .get("/api/articles/100")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toEqual("Not found");
      });
  });
  test("GET:400 if passed NAN, responds with an error", () => {
    return request(app)
      .get("/api/articles/doilooklikeanumber")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toEqual("Bad request");
      });
  });
});
describe("GET:200 /api/articles", () => {
  test("GET: responds with an array of all articles without body and added comment count", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("created_at", { descending: true });
        body.articles.forEach((article) => {
          expect(article).toHaveProperty("author");
          expect(article).toHaveProperty("title");
          expect(article).toHaveProperty("article_id");
          expect(article).toHaveProperty("topic");
          expect(article).toHaveProperty("created_at");
          expect(article).toHaveProperty("votes");
          expect(article).toHaveProperty("article_img_url");
          expect(article).toHaveProperty("comment_count");
          expect(article).not.toHaveProperty("body");
        });
      });
  });
});
describe("GET:200: /api/articles/:article_id/comments", () => {
  test("GET:200 responds with an array of comments for the given article", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        if (body.comments.length > 0) {
          expect(body.comments).toBeSortedBy("created_at");
          body.comments.forEach((comment) => {
            expect(comment).toHaveProperty("comment_id");
            expect(comment).toHaveProperty("votes");
            expect(comment).toHaveProperty("created_at");
            expect(comment).toHaveProperty("author");
            expect(comment).toHaveProperty("body");
            expect(comment.article_id).toBe(1);
          });
        }
      });
  });
  test("GET:404 if passed a number > the amount of comments, responds with an error", () => {
    return request(app)
      .get("/api/articles/100/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
      });
  });
  test("GET:400 if passed nan, responds with an error", () => {
    return request(app)
      .get("/api/articles/ten/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("GET:200 if passed an article_id that has no comments, responds with an empty array", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toEqual([]);
      });
  });
});
describe("POST:201: /api/articles/:article_id/comments", () => {
  test("POST:201 accepts an object with username and body, responds with the posted comment", () => {
    return request(app)
      .post("/api/articles/2/comments")
      .send({
        username: "rogersop",
        body: "Dave was a good man",
      })
      .expect(201)
      .then(({ body }) => {
        expect(body.newComment[0].author).toBe("rogersop");
        expect(body.newComment[0].body).toBe("Dave was a good man");
        expect(body.newComment[0].article_id).toBe(2);
        expect(body.newComment[0].votes).toBe(0);
        expect(body.newComment[0].comment_id).toBe(19);
      });
  });
  test("POST:400 if sent object is missing a body, responds with an error", () => {
    return request(app)
      .post("/api/articles/2/comments")
      .send({ username: "rogersop" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("POST:400 if sent object is missing a username, responds with an error", () => {
    return request(app)
      .post("/api/articles/2/comments")
      .send({ body: "no one here" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("POST:400 if sent an empty object, responds with an error", () => {
    return request(app)
      .post("/api/articles/2/comments")
      .send({})
      .expect(400)
      .then(({ body }) => [expect(body.msg).toBe("Bad request")]);
  });
});
describe("PATCH:200 /apr/articles/:article_id", () => {
  test("PATCH:200 takes an object with inc_votes, responds with specific article and its votes updated to the given value", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: 10 })
      .expect(200)
      .then(({ body }) => {
        expect(body.article[0].votes).toBe(110);
      });
  });
  test("PATCH:200 if passed an object with a - value, responds with specific article and its votes updated to a smaller value", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: -10 })
      .expect(200)
      .then(({ body }) => {
        expect(body.article[0].votes).toBe(90);
      });
  });
  test("PATCH:400 if passed an object without a value, responds with an error", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({})
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("PATCH:404 if passed an id that does not exist, responds with an error", () => {
    return request(app)
      .patch("/api/articles/100")
      .send({ inc_votes: 10 })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
      });
  });
  test("PATCH:400 if passed an id that is nan, responds with an error", () => {
    return request(app)
      .patch("/api/articles/ten")
      .send({ inc_votes: 10 })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("PATCH:400 if passed inc_votes with nan, responds with an error", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: "one" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
});
describe("DELETE:204 /api/comments/comment_id", () => {
  test("DELETE:204 if passed a comment_id, responds with 204 and no content", () => {
    return request(app)
      .delete("/api/comments/1")
      .expect(204)
      .then(({ body }) => {
        expect(body).toEqual({})
      })
  });
  test('DELETE:404 if passed a comment id that does not exist, responds with an error', () => {
    return request(app)
      .delete("/api/comments/100")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('Not found')
      })
  });
  test('DELETE:400 if passed a comment id that is nan, responds with an error', () => {
    return request(app)
      .delete("/api/comments/notanum")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad request')
      })
  });
});
describe('GET:200 /api/users', () => {
    test('GET:200 responds with all users', () => {
        return request(app)
        .get('/api/users')
        .expect(200)
        .then(({body}) => {
            expect(body.users.length).toBe(4)
            body.users.forEach((user) => {
                expect(user).toHaveProperty('username')
                expect(user).toHaveProperty('name')
                expect(user).toHaveProperty('avatar_url')
            })
    })
    });
});
describe('GET:200 Sorting queries /api/articles', () => {
    test('GET:200 uses both default values of sort_by and order, responds with an array of articles', () => {
        return request(app)
        .get('/api/articles')
        .expect(200)
        .then(({body}) => {
            expect(body.articles).toBeSortedBy("created_at", { descending: true });
        body.articles.forEach((article) => {
          expect(article).toHaveProperty("author");
          expect(article).toHaveProperty("title");
          expect(article).toHaveProperty("article_id");
          expect(article).toHaveProperty("topic");
          expect(article).toHaveProperty("created_at");
          expect(article).toHaveProperty("votes");
          expect(article).toHaveProperty("article_img_url");
          expect(article).toHaveProperty("comment_count");
          expect(article).not.toHaveProperty("body");
        });
        })
    });
    test('GET:200 if given sort by, responds with an array sorted in that order descending', () => {
        return request(app)
        .get('/api/articles?sort_by=author')
        .expect(200)
        .then(({body}) => {
            expect(body.articles).toBeSortedBy('author', {descending: true})
        })
    });
    test('GET:200 if given order, responds with an array sorted by default ordered by order', () => {
        return request(app)
        .get('/api/articles?order=ASC')
        .expect(200)
        .then(({body}) => {
            expect(body.articles).toBeSortedBy('created_at', {descending: false})
        })
    });
    test('GET:200 if given both sort_by and order, responds with an array sorted by sort_by and ordered by order', () => {
        return request(app)
        .get('/api/articles?sort_by=title&order=ASC')
        .expect(200)
        .then(({body}) => {
            expect(body.articles).toBeSortedBy('title', {descending:false})
        })
    });
    test('GET:400 if given an invalid sort_by value, responds with an error', () => {
        return request(app)
        .get('/api/articles?sort_by=age')
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('Bad request')
        })
    });
    test('GET:400 if given an invalid order value, responds with an error', () => {
        return request(app)
        .get('/api/articles?order=up')
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('Bad request')
        })
    });
});
describe('GET:200 Topic query /api/articles', () => {
    test('GET:200 if passed a topic, responds with an array of articles with that given topic', () => {
        return request(app)
        .get('/api/articles?topic=mitch')
        .expect(200)
        .then(({body}) => {
            body.articles.forEach((article) => 
            expect(article.topic).toBe('mitch'))
        })
    });
    test('GET:200 if passed a valid topic with no articles, responds with an empty array', () => {
      return request(app)
      .get('/api/articles?topic=paper')
      .expect(200)
      .then(({body}) => {
        expect(body.articles).toEqual([])
      })
    });
    test('GET:404 if passed a value that is not a topic, responds with an error', () => {
      return request(app)
      .get('/api/articles?topic=ihatesql')
      .expect(404)
      .then(({body}) => {
        expect(body.msg).toBe('Not found')
      })
    });
});