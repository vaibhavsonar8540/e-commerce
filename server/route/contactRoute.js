const express = require("express");
const contactController = require("../Controller/contactController");

const contactRouter = express.Router();

contactRouter.post("/", contactController.submitContact);
contactRouter.get("/", contactController.getAllContacts);

module.exports = contactRouter;
