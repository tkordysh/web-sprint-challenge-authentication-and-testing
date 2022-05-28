const request = require("supertest");
const server = require("./server");
const db = require("../data/dbConfig");

const userA = { username: "foo", password: "bar" };
const userB = { username: "foo", password: "baz" };

beforeAll(async () => {
  await db.migrate.rollback();
  await db.migrate.latest();
});

afterAll(async () => {
  await db.destroy();
});

// Write your tests here
test("sanity", () => {
  expect(true).toBe(true);
});

describe("server.js", () => {
  describe("Auth endpoints", () => {
    describe("POST register", () => {
      beforeEach(async () => {
        await db("users").truncate();
      });
      test("posts a new user to users table", async () => {
        await request(server).post("/api/auth/register").send(userA);
        const user = await db("users").first();
        expect(user).toHaveProperty("id");
        expect(user).toHaveProperty("username");
        expect(user).toHaveProperty("password");
      });
      test("responds with the new user", async () => {
        await request(server).post("/api/auth/register").send(userA);
        const response = await db("users").first();
        expect(response).toMatchObject({ id: 1, username: 'foo' })
        // expect(body).toHaveProperty("id");
        // expect(body).toHaveProperty("username");
        // expect(body).toHaveProperty("password");
      });
    });

    describe("POST login", () => {
      beforeEach(async () => {
        await db("users").truncate();
        await request(server).post("/api/auth/register").send(userA);
      });
      test("responds with proper message and token on successful login", async () => {
        const result = await request(server).post("/api/auth/login").send(userA);
        expect(result.body).toHaveProperty("message");
        expect(result.body).toHaveProperty("token");
      });
      test("responds with proper status code based on success or failure when logging in", async () => {
        let result;
        result = await request(server).post("/api/auth/login").send(userA); // success
        expect(result.status).toBe(200);
        result = await request(server).post("/api/auth/login").send(userB); // failure
        expect(result.status).toBe(401);
      });
    });
  });
});
