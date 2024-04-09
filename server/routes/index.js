const Router = require("express");
const router = new Router();
const jsonServer = require("json-server");

// router.use("/users", jsonServer.router("users.json"));
// router.use("/courses", jsonServer.router("courses.json"));
router.use("/dataBase", jsonServer.router("dataBase.json"));

module.exports = router;