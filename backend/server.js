require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors({
    origin: "*",  // Allows any domain (Not recommended for production)
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
}));


const GROQ_API_KEY = process.env.GROQ_API_KEY;

// API Route to detect stance
app.post("/detect-stance", async (req, res) => {
    try {
        const { tweet } = req.body;
        console.log(tweet);

        const response = await axios.post(
            "https://api.groq.com/openai/v1/chat/completions",
            {
                model: "llama3-8b-8192",
                messages: [
                    { role: "system", content: "Classify the stance of the following tweet as Positive, Negative, or Neutral." },
                    { role: "user", content: tweet }
                ]
            },
            {
                headers: {
                    "Authorization": `Bearer ${GROQ_API_KEY}`,
                    "Content-Type": "application/json"
                }
            }
        );
        console.log(response);

        res.json({ stance: response.data.choices[0].message.content.trim() });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Something went wrong!" });
    }
});

// Start server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
