const routes = require("express").Router();
const lesson1Controller = require("../controllers/lesson1")

routes.get("/", lesson1Controller.worldRoute)
routes.get("/lisa", lesson1Controller.lisaRoute)
routes.get("/banana", lesson1Controller.bananaRoute)

module.exports = routes