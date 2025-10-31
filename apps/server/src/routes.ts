import express from "express";
const routers = express.Router();

routers.get("/", (_, response) => {
  response.send("newsletter-io server is up and running!");
});

export default routers;