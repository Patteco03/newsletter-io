import express from "express";
import userController from "./controllers/User/user.controller";
import categoryController from "./controllers/Category/category.controller";
import ArticleController from "./controllers/Article/article.controller";
import { authMiddleware } from "./middleware/auth";

const routers = express.Router();

routers.get("/", (_, response) => {
  response.send("newsletter-io server is up and running!");
});

routers.use("/users", userController);
routers.use("/categories", authMiddleware, categoryController);
routers.use("/news", authMiddleware, ArticleController);

export default routers;
