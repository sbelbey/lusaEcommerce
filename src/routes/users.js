const { Router } = require("express");
const router = Router();

const { allUsers } = require("../controllers/usersController");

//Get all users
router.get("/", allUsers);

module.exports = router;
