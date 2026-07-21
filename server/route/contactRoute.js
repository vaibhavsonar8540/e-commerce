const express = require("express");
const contactController = require("../Controller/contactController");

const router = express.Router();

router.post("/", contactController.submitContact);

module.exports = router;
