import express from "express";
import userController from "./controllers/User/user.controller";

const routers = express.Router();

routers.get("/", (_, response) => {
  response.send("newsletter-io server is up and running!");
});

routers.use("/users", userController);

export default routers;
