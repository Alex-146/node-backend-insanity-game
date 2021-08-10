const request = require("supertest");
const createApp = require("../app");

const db = {
  connect: jest.fn(),
  findUserById: jest.fn()
}

const app = createApp(db);

describe("user route", () => {
  it("works", async () => {
    const response = await request(app).get("/user");
    expect(response.statusCode).toBe(401);
    expect(response.clientError).toBe(true);
    expect(response.unauthorized).toBe(true);
    // expect(response.type).toBe("application/json");
  });
});

// it("works with post", () => {
  //   const response = request(app).post("/").send({});
  //   
  // });