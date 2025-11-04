import "dotenv/config";

import express from "express";
import cors from "cors";
import routes from "./routes";

import { errorHandler } from "./middleware/errorHandler";

import { queue } from "./queue";
import { CreateArticleConsumer } from "./article/consumers/create-article.consumer";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(routes);
app.use(errorHandler);

// Initialize RabbitMQ consumer
const createArticleConsumer = new CreateArticleConsumer();

createArticleConsumer.start().catch((error) => {
  console.error("Failed to start CreateArticleConsumer:", error);
});

process.on("SIGINT", async () => {
  console.log("Shutting down gracefully...");
  await queue.close();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("Shutting down gracefully...");
  await queue.close();
  process.exit(0);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
