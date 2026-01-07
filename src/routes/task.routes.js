import express from "express";
import Task from "../models/task.js";
import redisClient from "../config/redis.js";

const router = express.Router();

// GET TASKS (REDIS CACHE)
router.get("/", async (req, res) => {
  const cacheKey = "tasks";

  const cachedTasks = await redisClient.get(cacheKey);

  if (cachedTasks) {
    return res.json({
      source: "redis",
      data: JSON.parse(cachedTasks),
    });
  }

  const tasks = await Task.find();

  await redisClient.set(cacheKey, JSON.stringify(tasks), {
    EX: 60,
  });

  res.json({
    source: "mongo",
    data: tasks,
  });
});

// CREATE TASK (CACHE INVALIDATION)
router.post("/", async (req, res) => {
  const task = await Task.create({
    title: req.body.title,
  });

  await redisClient.del("tasks");

  res.status(201).json({
    message: "Task created & cache cleared",
    task,
  });
});

export default router;
