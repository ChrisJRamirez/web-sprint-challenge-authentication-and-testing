const request = require("supertest");
const db = require("../data/dbConfig");
const server = require("./server");

const user1 = {username: "user1", password: "1234"};
const user2 = {username: "user2", password: "1234"};
const user3 = {username: "user3"};

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

// [GET] /api/jokes


// test('sanity', () => {
//   expect(true).toBe(false)
// })
