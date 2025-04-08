const express = require("express")
const router = express.Router()
const { chatbotPrompt } = require("../controllers/chatbot")

router.post("/chat", chatbotPrompt)

module.exports = router