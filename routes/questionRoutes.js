const express = require("express");
const { getQuestions, addQuestion } = require("../controllers/questionController");

const router = express.Router();

router.get("/", getQuestions);

module.exports = router;
