const express = require("express");
const Redis = require("ioredis");
const app = express();

// Configurations
app.use(express.json()); // Middleware to parse JSON request bodies

// Initialize Redis
const redis = new Redis();

// API Routes

// GET: Retrieve the counter value
app.get("/counter", async (req, res) => {
  let counter = await redis.get("counter");
  if (!counter) {
    await redis.set("counter", 1);
    counter = 1;
  }
  await redis.incr("counter");
  await redis.expire("counter", 10);

  return res.status(200).json({ msg: "This is an example for counter", counter });
});

// POST: Add items to a list from the left
app.post("/list/lpush", async (req, res) => {
  const { item } = req.body;
  if (!item) {
    return res.status(400).json({ msg: "Item is required" });
  }
  await redis.lpush("storage", item);
  return res.status(200).json({ msg: "Item pushed to the left of the list", length: await redis.llen("storage") });
});

// POST: Add items to a list from the right
app.post("/list/rpush", async (req, res) => {
  const { item } = req.body;
  if (!item) {
    return res.status(400).json({ msg: "Item is required" });
  }
  await redis.rpush("storage", item);
  return res.status(200).json({ msg: "Item pushed to the right of the list", length: await redis.llen("storage") });
});

// DELETE: Remove items from the left of the list
app.delete("/list/lpop", async (req, res) => {
  const poppedItem = await redis.lpop("storage");
  if (!poppedItem) {
    return res.status(404).json({ msg: "List is empty or does not exist" });
  }
  return res.status(200).json({ msg: "Item popped from the left of the list", length: await redis.llen("storage") });
});

// DELETE: Remove items from the right of the list
app.delete("/list/rpop", async (req, res) => {
  const poppedItem = await redis.rpop("storage");
  if (!poppedItem) {
    return res.status(404).json({ msg: "List is empty or does not exist" });
  }
  return res.status(200).json({ msg: "Item popped from the right of the list", length: await redis.llen("storage") });
});

// PUT: Update the counter value (for demonstration purposes)
app.put("/counter", async (req, res) => {
  const { value } = req.body;
  if (isNaN(value)) {
    return res.status(400).json({ msg: "A numeric value is required" });
  }
  await redis.set("counter", value);
  return res.status(200).json({ msg: "Counter value updated", counter: await redis.get("counter") });
});

// Start the server
app.listen(3005, () => {
  console.log("Server running on port 3005");
});
