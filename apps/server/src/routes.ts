import express from "express";
import userController from "./controllers/User/user.controller";
import categoryController from "./controllers/Category/category.controller";
import { authMiddleware } from "./middleware/auth";

const routers = express.Router();

routers.get("/", (_, response) => {
  response.send("newsletter-io server is up and running!");
});

routers.use("/users", userController);
routers.use("/categories", authMiddleware, categoryController);

export default routers;
