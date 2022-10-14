const app = require("../app");
const request = require("supertest");
const db = require("../db/connection");
const testData = require("../db/data/test-data/index");
const seed = require("../db/seeds/seed");

beforeEach(() => seed(testData));

afterAll(() => db.end());

describe("Generic error handling", () => {
  it("Status 404, invalid path entered", () => {
    return request(app)
      .get("/notAPath")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Route not Found");
      });
  });
});

describe("GET /api", () => {
  describe("Happy Path", () => {
    it("status: 200, responds with json containing endpoints.json", () => {
      return request(app)
        .get("/api")
        .expect(200)
        .then(({ body }) => {
          expect(body).toBeObject();
          expect(body.endpoints).toBeObject();
          expect(Object.keys(body.endpoints).length).toBe(12);
        });
    });
  });
});

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
          .then(({ body }) => {
            expect(body.review.comment_count).toBe(0);
          });
      });
      it("should have a count that works for a review with multiple comments", () => {
        return request(app)
          .get("/api/reviews/3")
          .expect(200)
          .then(({ body }) => {
            expect(body.review.comment_count).toBe(3);
          });
      });
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
          .then(({ body }) => {
            const { reviews } = body;
            expect(Array.isArray(reviews)).toBe(true);
            expect(reviews.length).toBe(10);
            reviews.forEach((review) => {
              expect(review).toEqual(
                expect.objectContaining({
                  owner: expect.any(String),
                  title: expect.any(String),
                  review_id: expect.any(Number),
                  category: expect.any(String),
                  review_img_url: expect.any(String),
                  created_at: expect.any(String),
                  votes: expect.any(Number),
                  designer: expect.any(String),
                })
              );
            });
          });
      });
      it("should contain a comment count field in each review object", () => {
        return request(app)
          .get("/api/reviews")
          .expect(200)
          .then(({ body }) => {
            body.reviews.forEach((review) => {
              expect(typeof review.comment_count).toBe("number");
            });
          });
      });
      it("should be sorted by date descending", () => {
        return request(app)
          .get("/api/reviews")
          .expect(200)
          .then(({ body }) => {
            expect(body.reviews).toBeSortedBy("created_at", {
              descending: true,
            });
          });
      });
      it("should contain a total_count property displayin the total number of articles", () => {
        return request(app)
          .get("/api/reviews")
          .expect(200)
          .then(({ body }) => {
            const { reviews } = body;
            expect(Array.isArray(reviews)).toBe(true);
            expect(reviews.length).toBe(10);
            reviews.forEach((review) => {
              expect(review).toEqual(
                expect.objectContaining({
                  total_count: 13,
                })
              );
            });
          });
      });
      describe("Queries", () => {
        it("should accept a category query which filters the reviews by the selected category", () => {
          return request(app)
            .get("/api/reviews?category=social_deduction")
            .expect(200)
            .then(({ body }) => {
              expect(body.reviews.length).toBe(10);
              body.reviews.forEach((review) => {
                expect(review.category).toBe("social deduction");
              });
            });
        });
        it("should accept a sort_by query which sorts articles by date", () => {
          return request(app)
            .get("/api/reviews?sort_by=created_at")
            .expect(200)
            .then(({ body }) => {
              const { reviews } = body;
              expect(reviews).toBeSortedBy("created_at", { descending: true });
            });
        });
        it("should sort reviews by any valid column name", () => {
          return request(app)
            .get("/api/reviews?sort_by=owner")
            .expect(200)
            .then(({ body }) => {
              const { reviews } = body;
              expect(reviews).toBeSortedBy("owner", { descending: true });
            });
        });
        it("should accept an order query which can be set to asc or desc", () => {
          return request(app)
            .get("/api/reviews?order=asc")
            .expect(200)
            .then(({ body }) => {
              const { reviews } = body;
              expect(reviews).toBeSortedBy("created_at", { descending: false });
            });
        });
        it("should accept a limit query which limits the number of responses", () => {
          return request(app)
            .get("/api/reviews?limit=5")
            .expect(200)
            .then(({ body }) => {
              const { reviews } = body;
              expect(Array.isArray(reviews)).toBe(true);
              expect(reviews.length).toBe(5);
            });
        });
        it("should default to limit of 10 if not supplied", () => {
          return request(app)
            .get("/api/reviews")
            .expect(200)
            .then(({ body }) => {
              expect(body.reviews.length).toBe(10);
            });
        });
        it("should accept a p query which specifies which page to start at", () => {
          return request(app)
            .get("/api/reviews?p=2")
            .expect(200)
            .then(({ body }) => {
              expect(body.reviews.length).toBe(3);
            });
        });
        it("should default to first page when p not specified", () => {
          return request(app)
            .get("/api/reviews")
            .expect(200)
            .then(({ body }) => {
              expect(body.reviews.length).toBe(10);
            });
        });
      });
    });
    describe("Error Handling", () => {
      it("status 400, responds with error when category doesn't exist", () => {
        return request(app)
          .get("/api/reviews?category=asymmetric")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("Category not found");
          });
      });
      it("status 200, responds with empty array when category exists but no games are assigned", () => {
        return request(app)
          .get("/api/reviews?category=children's_games")
          .expect(200)
          .then(({ body }) => {
            expect(Array.isArray(body.reviews)).toBe(true);
            expect(body.reviews.length).toBe(0);
          });
      });
      it("status 400: rejects sort_by column not in table", () => {
        return request(app)
          .get("/api/reviews?sort_by=bad_request")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("Invalid sort query");
          });
      });
      it("status 400: rejects invalid order query", () => {
        return request(app)
          .get("/api/reviews?order=left")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("Invalid order query");
          });
      });
      it("status 400: rejects limit in wrong datatype", () => {
        return request(app)
          .get("/api/reviews?limit=break")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("Unexpected field type");
          });
      });
      it("status 400: rejects negative limit query", () => {
        return request(app)
          .get("/api/reviews?limit=-5")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("Limit must not be negative");
          });
      });
      it("status 400: rejects p in wrong datatype", () => {
        return request(app)
          .get("/api/reviews?p=break")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("Unexpected field type");
          });
      });
      it("status 400: rejects negative p query", () => {
        return request(app)
          .get("/api/reviews?p=-4")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("Offset must not be negative");
          });
      });
    });
  });

  describe("GET /api/reviews/:review_id/comments", () => {
    describe("Happy Path", () => {
      it("status: 200, responds with array of comments for specified review", () => {
        return request(app)
          .get("/api/reviews/3/comments")
          .expect(200)
          .then(({ body }) => {
            const { comments } = body;
            expect(Array.isArray(comments)).toBe(true);
            expect(comments.length).toBe(3);
            comments.forEach((comment) => {
              expect(comment).toEqual(
                expect.objectContaining({
                  comment_id: expect.any(Number),
                  votes: expect.any(Number),
                  created_at: expect.any(String),
                  author: expect.any(String),
                  body: expect.any(String),
                  review_id: expect.any(Number),
                })
              );
            });
          });
      });
      it("should be sorted by most recent comment first", () => {
        return request(app)
          .get("/api/reviews/3/comments")
          .expect(200)
          .then(({ body }) => {
            expect(body.comments).toBeSortedBy("created_at", {
              descending: true,
            });
          });
      });
    });
    describe("Queries", () => {
      it("should accept a limit query which limits the number of responses", () => {
        return request(app)
          .get("/api/reviews/2/comments?limit=1")
          .expect(200)
          .then(({ body }) => {
            const { comments } = body;
            expect(Array.isArray(comments)).toBe(true);
            expect(comments.length).toBe(1);
          });
      });
      it("should default to limit of 10 if not supplied", () => {
        return request(app)
          .get("/api/reviews/2/comments?limit=3")
          .expect(200)
          .then(({ body }) => {
            expect(body.comments.length).toBe(3);
          });
      });
      it("should accept a p query which specifies which page to start at", () => {
        return request(app)
          .get("/api/reviews/2/comments?p=2")
          .expect(200)
          .then(({ body }) => {
            expect(body.comments.length).toBe(0);
          });
      });
      it("should default to first page when p not specified", () => {
        return request(app)
          .get("/api/reviews/2/comments")
          .expect(200)
          .then(({ body }) => {
            expect(body.comments.length).toBe(3);
          });
      });
    });

    describe("Error Handling", () => {
      it("status 404: return error when review id does not exist", () => {
        return request(app)
          .get("/api/reviews/9999/comments")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("Id 9999 not Found");
          });
      });
      it("status 400, responds with error when review ID entered incorrectly", () => {
        return request(app)
          .get("/api/reviews/notAnId/comments")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("Unexpected field type");
          });
      });
      it("returns an empty array when review exists but has no comments", () => {
        return request(app)
          .get("/api/reviews/1/comments")
          .expect(200)
          .then(({ body }) => {
            expect(Array.isArray(body.comments)).toBe(true);
            expect(body.comments.length).toBe(0);
          });
      });
      it("status 400: rejects limit in wrong datatype", () => {
        return request(app)
          .get("/api/reviews?limit=break")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("Unexpected field type");
          });
      });
      it("status 400: rejects negative limit query", () => {
        return request(app)
          .get("/api/reviews?limit=-5")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("Limit must not be negative");
          });
      });
      it("status 400: rejects p in wrong datatype", () => {
        return request(app)
          .get("/api/reviews?p=break")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("Unexpected field type");
          });
      });
      it("status 400: rejects negative p query", () => {
        return request(app)
          .get("/api/reviews?p=-4")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("Offset must not be negative");
          });
      });
    });
  });

  describe("POST /api/reviews", () => {
    describe("Happy Path", () => {
      it("status 201: responds with newly added review", () => {
        return request(app)
          .post("/api/reviews")
          .send({
            owner: "dav3rid",
            title: "Wingspan",
            review_body: "Hatch birds, get points",
            designer: "Elizabeth Hargrave",
            category: "euro game",
          })
          .expect(201)
          .then(({ body }) => {
            expect(body.review).toEqual({
              owner: "dav3rid",
              title: "Wingspan",
              review_body: "Hatch birds, get points",
              designer: "Elizabeth Hargrave",
              category: "euro game",
              review_id: 14,
              votes: 0,
              created_at: expect.any(String),
              comment_count: 0,
            });
          });
      });
    });
    describe("Error Handling", () => {
      it("status: 400, request body missing required fields", () => {
        return request(app)
          .post("/api/reviews")
          .send({ owner: "dav3rid", category: "euro game" })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("Required field/s missing");
          });
      });
      it("status: 404, username does not exist", () => {
        return request(app)
          .post("/api/reviews")
          .send({
            owner: "thadenox",
            title: "Wingspan",
            review_body: "Hatch birds, get points",
            designer: "Elizabeth Hargrave",
            category: "euro game",
          })
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe(`User thadenox not found`);
          });
      });
      it("status: 404, category does not exist", () => {
        return request(app)
          .post("/api/reviews")
          .send({
            owner: "dav3rid",
            category: "deck builder",
          })
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("Category not found");
          });
      });
    });
  });

  describe("POST /api/reviews/:review_id/comments", () => {
    describe("Happy Path", () => {
      it("status 201: responds with new comment just posted", () => {
        return request(app)
          .post("/api/reviews/1/comments")
          .send({ username: "dav3rid", body: "Totally agree" })
          .expect(201)
          .then(({ body }) => {
            const { comment } = body;
            expect(comment).toEqual({
              comment_id: 7,
              review_id: 1,
              author: "dav3rid",
              body: "Totally agree",
              votes: 0,
              created_at: expect.any(String),
            });
          });
      });
    });
    describe("Error Handling", () => {
      it("status 404, review id not found", () => {
        return request(app)
          .post("/api/reviews/9999/comments")
          .send({ username: "dav3rid", body: "Totally agree" })
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("Id 9999 not Found");
          });
      });
      it("status: 400, review id entered in incorrect form", () => {
        return request(app)
          .post("/api/reviews/notAnId/comments")
          .send({ username: "dav3rid", body: "Totally agree" })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("Unexpected field type");
          });
      });
      it("status: 400, request body missing required fields", () => {
        return request(app)
          .post("/api/reviews/1/comments")
          .send({})
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("Required field/s missing");
          });
      });
      it("status: 400, responds with error when request fields in incorrect datatype", () => {
        return request(app)
          .post("/api/reviews/1/comments")
          .send({ username: "dav3rid", body: 1234 })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("Unexpected field type");
          });
      });
      it("status: 404, responds with error when user doesn't exist", () => {
        return request(app)
          .post("/api/reviews/1/comments")
          .send({ username: "unknown", body: "Hello" })
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("User unknown not found");
          });
      });
    });
  });

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
      it("status 400, responds with error when id entered in incorrect format", () => {
        return request(app)
          .patch("/api/reviews/notAnId")
          .send({ inc_votes: 1 })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("Unexpected field type");
          });
      });
      it("status 404: id entered correctly but resource does not exist", () => {
        return request(app)
          .patch("/api/reviews/9999")
          .send({ inc_votes: 1 })
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("Id 9999 not found");
          });
      });
      it("status: 400, return error when when correct request field is entered with incorrect datatype", () => {
        return request(app)
          .patch("/api/reviews/1")
          .send({ inc_votes: "Wingspan" })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("Unexpected field type");
          });
      });
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

describe("User endpoints", () => {
  describe("GET /api/users", () => {
    describe("Happy path", () => {
      it("status: 200, responds with array of users", () => {
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
  });
  describe("GET /api/users/:username", () => {
    describe("Happy Path", () => {
      it("status 200, responds with selected user", () => {
        return request(app)
          .get("/api/users/dav3rid")
          .expect(200)
          .then(({ body }) => {
            expect(body.user).toEqual({
              username: "dav3rid",
              name: "dave",
              avatar_url:
                "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
            });
          });
      });
    });
    describe("Error Handling", () => {
      it("status 404, username not found", () => {
        return request(app)
          .get("/api/users/thadenox")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("User thadenox not found");
          });
      });
    });
  });
});

describe("Comments endpoints", () => {
  describe("PATCH /api/comments/:comment_id", () => {
    describe("Happy path", () => {
      it("status 200, returns updated comment when incremented", () => {
        return request(app)
          .patch("/api/comments/1")
          .send({ inc_votes: 1 })
          .expect(200)
          .then(({ body }) => {
            expect(body.comment).toEqual({
              comment_id: 1,
              body: "I loved this game too!",
              votes: 17,
              author: "bainesface",
              review_id: 2,
              created_at: "2017-11-22T12:43:33.389Z",
            });
          });
      });
      it("status 200, returns updated comment when decremented", () => {
        return request(app)
          .patch("/api/comments/1")
          .send({ inc_votes: -1 })
          .expect(200)
          .then(({ body }) => {
            expect(body.comment).toEqual({
              comment_id: 1,
              body: "I loved this game too!",
              votes: 15,
              author: "bainesface",
              review_id: 2,
              created_at: "2017-11-22T12:43:33.389Z",
            });
          });
      });
    });
    describe("Error Handling", () => {
      it("status 404: comment id does not exist", () => {
        return request(app)
          .patch("/api/comments/9999")
          .send({ inc_votes: 1 })
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("Id 9999 not found");
          });
      });
      it("status 400, id entered in wrong datatype", () => {
        return request(app)
          .patch("/api/comments/notAnId")
          .send({ inc_votes: 1 })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("Unexpected field type");
          });
      });
      it("status: 400, inc_votes field missing from request body", () => {
        return request(app)
          .patch("/api/comments/1")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("Required field/s missing");
          });
      });
      it("status: 400, inc_votes field entered in incorrect format", () => {
        return request(app)
          .patch("/api/comments/1")
          .send({ inc_votes: "hello" })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("Unexpected field type");
          });
      });
      it("should ignore extra requests to be added", () => {
        return request(app)
          .patch("/api/comments/1")
          .send({ inc_votes: 1, body: "Hello" })
          .expect(200)
          .then(({ body }) => {
            expect(body.comment).toEqual({
              comment_id: 1,
              body: "I loved this game too!",
              votes: 17,
              author: "bainesface",
              review_id: 2,
              created_at: "2017-11-22T12:43:33.389Z",
            });
          });
      });
    });
  });
  describe("DELETE /api/comments/:comment_id", () => {
    describe("Happy Path", () => {
      it("status: 204, no response to be returned", () => {
        return request(app).delete("/api/comments/1").expect(204);
      });
    });
    describe("Error Handling", () => {
      it("status: 404, id entered correctly but does not exist", () => {
        return request(app)
          .delete("/api/comments/9999")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("Id 9999 not found");
          });
      });
      it("status : 400, id entered in incorrect format", () => {
        return request(app)
          .delete("/api/comments/notAnId")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("Unexpected field type");
          });
      });
    });
  });
});
