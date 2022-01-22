const db = require("../../data/dbConfig");

function getAll() {
  return db("users")
};

function findById(id) {
  return db("users")
    .select("id", "username")
    .where("id", id).first()
}

async function add(user) {
  const [id] = await db("users").insert(user)

  return findById(id)
}

module.exports = {
  getAll,
  findById,
  add
}