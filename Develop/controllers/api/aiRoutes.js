const router = require('express').Router();
const { OpenAI } = require('openai');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

router.post("/", async (req, res) => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: req.body.messages,
      temperature: 0.7,
      max_tokens: 200,
    });

    // Access the generated message content
    const generatedMessage = response.choices[0].message.content;
    console.log("Generated Message:", generatedMessage);

    // Send back the generated message
    res.json({ message: generatedMessage });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;