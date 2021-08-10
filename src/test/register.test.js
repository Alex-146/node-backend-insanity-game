require("dotenv").config();
const request = require("supertest");
const createApp = require("../app");

const users = require("./users");

const db = {
  connect: jest.fn(),
  findUserById: jest.fn(),
  findByEmail: function (email) {
    return users.find(u => u.auth.standard.email === email);
  },
  registerUser: function(method, data) {
    // todo: actual logic
    // return Promise.resolve(undefined);
    // return undefined;
  }
}

const app = createApp(db);

describe("🔥 auth/register", () => {
  it("fails when invalid body (email + password)", async () => {
    const data = [
      { method: "standard", data: { email: "" } },
      { method: "standard", data: { password: "" } },
    ];

    const promises = data.map(body => request(app).post("/auth/register").send(body));
    const responses = await Promise.all(promises);
    responses.forEach(response => {
      expect(response.statusCode).toBe(400);
    });
  });
});