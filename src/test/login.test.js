require("dotenv").config();
const request = require("supertest");
const createApp = require("../app");

const users = require("./users");

const db = {
  connect: jest.fn(),
  findUserById: jest.fn(),
  findByEmail: function (email) {
    return users.find(u => u.auth.standard.email === email);
  }
}

const validUserBody = {
  email: "valid@email.com",
  password: "valid123"
}

const app = createApp(db);

describe("🔥 auth/login", () => {
  
  it("works with valid data (email + password) and token", async () => {
    const responseA = await request(app).post("/auth/login").send(validUserBody);
    expect(responseA.statusCode).toBe(200);
    expect(responseA.type).toBe("application/json");

    const { token } = responseA.body;
    const responseB = await request(app).get("/auth/login").set("Authorization", `Bearer ${token}`);
    expect(responseB.statusCode).toBe(200);
    expect(responseB.type).toBe("application/json");
  });

  it("fails with no token", async () => {
    const response = await request(app).get("/auth/login");
    expect(response.statusCode).toBe(401);
  });

  it("fails with expired token", async () => {
    const token = require("jsonwebtoken").sign({ foo: "bar" }, "SECRET", { expiresIn: "0" });
    const response = await request(app).get("/auth/login").set("Authorization", `Bearer ${token}`);
    expect(response.statusCode).toBe(401);
  });

  it("fails with invalid email", async () => {
    const body = {
      email: "invalid@email.com",
      password: "valid123"
    }
    const response = await request(app).post("/auth/login").send(body);
    expect(response.statusCode).toBe(400);
  });

  it("fails with invalid password", async () => {
    const body = {
      email: "valid@email.com",
      password: "invalid123"
    }
    const response = await request(app).post("/auth/login").send(body);
    expect(response.statusCode).toBe(400);
  });
});