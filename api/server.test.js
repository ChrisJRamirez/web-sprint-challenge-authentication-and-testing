const request = require("supertest");
const db = require("../data/dbConfig");
const server = require("./server");

const user1 = {username: "user1", password: "1234"};
const user1BP = {username: "user1", password: "12"};
const user2 = {username: "user2", password: "1234"};
const user3 = {username: "user3"};
const user3PW = {username: "user3", password: "1234"};

beforeAll(async () => {
  await db.migrate.rollback();
  await db.migrate.latest();
});

beforeEach(async () => {
  await db("users").truncate()
});

afterAll(async () => {
  await db.destroy()
});




// Write your tests here

// [POST] /api/auth/register
describe("[POST] /register", () => {
  it("1) Responds with the newly created user", async () => {
    let res
    res = await request(server).post("/api/auth/register").send(user1)
    expect(res.body).toMatchObject({id:1, username: "user1"})

    res = await request(server).post("/api/auth/register").send(user2)
    expect(res.body).toMatchObject({id:2, username: "user2"})
  })
  it("2) Does not allow registration without giving username & password", async () => {
    let res
    res = await request(server).post("/api/auth/register").send(user3)
    expect(res.body).toMatchObject({message:"username and password required"})
  })
  it("3) Does not allow registration if username is taken", async () => {
    let res
    res = await request(server).post("/api/auth/register").send(user1)
    res = await request(server).post("/api/auth/register").send(user1)
    expect(res.body).toMatchObject({message:"username taken"})
  })
})

// [POST] /api/auth/login
describe("[POST] /login", () => {
  it("4) Can successfully login registered user", async () => {
    let res
    res = await request(server).post("/api/auth/register").send(user1)
    res = await request(server).post("/api/auth/login").send(user1)
    expect(res.body).toMatchObject({message: "Welcome user1"})

    res = await request(server).post("/api/auth/register").send(user2)
    res = await request(server).post("/api/auth/login").send(user2)
    expect(res.body).toMatchObject({message: "Welcome user2"})
  })
  it("5) Fails login if username not in db (not registered) or password incorrect", async () => {
    let res
    res = await request(server).post("/api/auth/login").send(user1)
    expect(res.body).toMatchObject({message: "invalid credentials"})

    res = await request(server).post("/api/auth/register").send(user1)
    res = await request(server).post("/api/auth/login").send(user1BP)
    expect(res.body).toMatchObject({message: "invalid credentials"})
  })
  it("6) Fails login if username or password is missing from req.body", async () => {
    let res
    res = await request(server).post("/api/auth/register").send(user3PW)
    res = await request(server).post("/api/auth/login").send(user3)
    expect(res.body).toMatchObject({message: "username and password required"})
  })
})

// [GET] /api/jokes


// test('sanity', () => {
//   expect(true).toBe(false)
// })
