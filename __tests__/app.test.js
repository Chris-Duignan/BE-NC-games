const app = require("../app");
const request = require("supertest");
const db = require("../db/connection");
const testData = require("../db/data/test-data/index");
const seed = require("../db/seeds/seed");

beforeEach(() => seed(testData));

afterAll(() => db.end());

describe("GET /api/categories", () => {
  describe("Happy Path", () => {
    it("status: 200, responds with array of categories", () => {
      return request(app)
        .get("/api/categories")
        .expect(200)
        .then(({ body }) => {
          expect(Array.isArray(body.categories)).toBe(true);
          expect(body.categories.length).toBe(4);
          body.categories.forEach((category) => {
            expect(category).toEqual(
              expect.objectContaining({
                slug: expect.any(String),
                description: expect.any(String),
              })
            );
          });
        });
    });
  });
  describe("Error handling", () => {
    it("status 404: responds with error when incorrect path entered", () => {
      return request(app)
        .get("/api/notAPath")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Route not Found");
        });
    });
  });
});

describe("Review endpoints", () => {
  describe("GET /api/reviews/:review_id", () => {
    describe("Happy path", () => {
      it("status: 200, responds with review object", () => {
        return request(app)
          .get("/api/reviews/1")
          .expect(200)
          .then(({ body }) => {
            expect(body.review).toEqual(
              expect.objectContaining({
                review_id: 1,
                title: "Agricola",
                review_body: "Farmyard fun!",
                designer: "Uwe Rosenberg",
                review_img_url:
                  "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
                votes: 1,
                category: "euro game",
                owner: "mallionaire",
                created_at: expect.any(String),
              })
            );
          });
      });
      it("should include a comment count field in the response object", () => {
        return request(app)
          .get("/api/reviews/1")
          .expect(200)
          .then(({body}) => {
            expect(body.review.comment_count).toBe(0)
          })
      })
      it("should have a count that works for a review with multiple comments", () => {
        return request(app)
          .get("/api/reviews/3")
          .expect(200)
          .then(({body}) => {
            expect(body.review.comment_count).toBe(3);
          })
      })
    });
    describe("Error Handling", () => {
      it("error 404, responds with error when id does not exist", () => {
        return request(app)
          .get("/api/reviews/9999")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("Id 9999 not Found");
          });
      });
      it("error 400, responds with error when incorrect id datatype entered", () => {
        return request(app)
          .get("/api/reviews/notAnId")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("Unexpected field type");
          });
      });
    });
  });

  describe("GET /api/reviews", () => {
    describe("Happy Path", () => {
      it("status: 200, respond with array of all reviews", () => {
        return request(app)
          .get("/api/reviews")
          .expect(200)
          .then(({body}) => {
            const {reviews} = body;
            expect(Array.isArray(reviews)).toBe(true);
            expect(reviews.length).toBe(13);
            reviews.forEach(review => {
              expect(review).toEqual(
                expect.objectContaining({
                  owner: expect.any(String),
                  title: expect.any(String),
                  review_id: expect.any(Number),
                  category: expect.any(String),
                  review_img_url: expect.any(String),
                  created_at: expect.any(String),
                  votes: expect.any(Number),
                  designer: expect.any(String)
                })
              )
            })
          })
      })
      it("should contain a comment count field in each review object", () => {
        return request(app)
          .get("/api/reviews")
          .expect(200)
          .then(({body}) => {
            body.reviews.forEach(review => {
              expect(typeof review.comment_count).toBe("number");
            })
          })
      })
      it("should be sorted by date descending", () => {
        return request(app)
          .get("/api/reviews")
          .expect(200)
          .then(({body}) => {
            expect(body.reviews).toBeSortedBy("created_at", {descending: true})
          })
      })
      describe("Queries", () => {
        it("should accept a category query which filters the reviews by the selected category", () => {
          return request(app)
            .get("/api/reviews?category=social_deduction")
            .expect(200)
            .then(({body}) => {
              expect(body.reviews.length).toBe(11)
              body.reviews.forEach(review => {
                expect(review.category).toBe("social deduction")
              })
            })
        })
      })
    })
  })

  describe("PATCH /api/reviews/:review_id", () => {
    describe("Happy path", () => {
      it("status: 200, responds with the updated review", () => {
        return request(app)
          .patch("/api/reviews/1")
          .send({ inc_votes: 1 })
          .expect(200)
          .then(({ body }) => {
            expect(body.review).toEqual(
              expect.objectContaining({
                review_id: 1,
                title: "Agricola",
                review_body: "Farmyard fun!",
                designer: "Uwe Rosenberg",
                review_img_url:
                  "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
                votes: 2,
                category: "euro game",
                owner: "mallionaire",
                created_at: expect.any(String),
              })
            );
          });
      });
      it("status: 200, update reviews can increment votes by a value greater than 1", () => {
        return request(app)
          .patch("/api/reviews/1")
          .send({ inc_votes: 10 })
          .expect(200)
          .then(({ body }) => {
            expect(body.review.votes).toBe(11);
          });
      });
      it("status: 200, can decrement votes when given a negative number", () => {
        return request(app)
          .patch("/api/reviews/1")
          .send({ inc_votes: -1 })
          .expect(200)
          .then(({ body }) => {
            expect(body.review.votes).toBe(0);
          });
      });
    });
    describe("Error handling", () => {
      //400: id entered incorrectly
      it("status 400, responds with error when id entered in incorrect format", () => {
        return request(app)
          .patch("/api/reviews/notAnId")
          .send({ inc_votes: 1 })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("Unexpected field type");
          });
      });
      //404: resource not found
      it("status 404: id entered correctly but resource does not exist", () => {
        return request(app)
          .patch("/api/reviews/9999")
          .send({ inc_votes: 1 })
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("Id 9999 not found");
          });
      });
      //400: inc_votes in incorrect form
      it("status: 400, return error when when correct request field is entered with incorrect datatype", () => {
        return request(app)
          .patch("/api/reviews/1")
          .send({ inc_votes: "Wingspan" })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("Unexpected field type");
          });
      });
      //400: inc_votes missing
      it("status: 400, returns error when inc_votes field missing from request body", () => {
        return request(app)
          .patch("/api/reviews/1")
          .send({ title: "Spirit Island" })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("Please enter inc_votes field");
          });
      });
      it("should return an updated review when passed an object containing the correct field, and ignores extra requests", () => {
        return request(app)
          .patch("/api/reviews/1")
          .send({ inc_votes: 5, title: "Betrayal at House on the Hill" })
          .expect(200)
          .then(({ body }) => {
            expect(body.review).toEqual({
              review_id: 1,
              title: "Agricola",
              designer: "Uwe Rosenberg",
              owner: "mallionaire",
              review_img_url:
                "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
              review_body: "Farmyard fun!",
              category: "euro game",
              created_at: "2021-01-18T10:00:20.514Z",
              votes: 6,
            });
          });
      });
    });
  });
});

describe("GET /api/users", () => {
  describe("Happy path", () => {
    it("status: 200, responds wuth array of users", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then(({ body }) => {
          expect(Array.isArray(body.users)).toBe(true);
          expect(body.users.length).toBe(4);
          body.users.forEach((user) => {
            expect(user).toEqual(
              expect.objectContaining({
                username: expect.any(String),
                name: expect.any(String),
                avatar_url: expect.any(String),
              })
            );
          });
        });
    });
  });
  describe("Error handling", () => {
    it("status 404: responds with error when incorrect path entered", () => {
      return request(app)
        .get("/api/notAPath")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Route not Found");
        });
    });
  });
});
