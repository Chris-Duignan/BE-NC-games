const app = require("../app");
const request = require("supertest");
const db = require("../db/connection");
const testData = require("../db/data/test-data/index");
const seed = require("../db/seeds/seed");

beforeEach(() => seed(testData));

afterAll(() => db.end());

describe("GET /api/reviews/:review_id", () => {
  describe("Happy path", () => {
    it("status: 200, responds with review object", () => {
      return request(app)
        .get("/api/reviews/1")
        .expect(200)
        .then(({ body }) => {
          expect(body).toEqual(
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
  });
});
