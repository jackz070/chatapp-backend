/* 
  NOTE: replace the openai.js file with this file and uncomment 
  the code if you want to use the newer version of the openai API.
  OPENAI released their gpt-3.5-turbo version on 3/1/2023, this is
  gpt-3.5 version which is what powers the ChatGPT bot. most of the
  code is the same with some minor changes.
*/

import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import { openai } from "../index.js";

dotenv.config();
const router = express.Router();

router.post("/text", async (req, res) => {
  try {
    const { text, messageHistory, activeChatId } = req.body;

    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant, who is friendly and caring.",
        },
        ...messageHistory,
        { role: "user", content: text },
      ],
    });

    await axios.post(
      `https:api.chatengine.io/chats/${activeChatId}/messages/`,
      { text: response.data.choices[0].message.content },
      {
        headers: {
          "Project-ID": process.env.PROJECT_ID,
          "User-Name": process.env.BOT_USER_NAME,
          "User-Secret": process.env.BOT_USER_SECRET,
        },
      }
    );
    res.status(200).json({ text: response.data.choices[0].message.content });
  } catch (error) {
    console.error("error", error.response.data.error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
