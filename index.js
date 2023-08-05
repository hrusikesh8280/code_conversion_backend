
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const axios = require('axios');
require("dotenv").config()
const cors=require('cors');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors());

// Route for converting code
app.post('/convert',async (req, res) => {
  const { code, targetLang } = req.body;
  const apiKey = process.env.OPENAI_API_KEY; // Replace this with your OpenAI API key
  // const prompt=`what is ${code} and ${targetLang}`
  const prompt=`Translate the following code from JavaScript to ${targetLang}:\n${code} and only respond with converted code`
  try {
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      messages:[{"role":"user","content":prompt}],
      model:"gpt-3.5-turbo",
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
    });

    const convertedCode = response.data.choices[0].message.content;
    res.status(200).json({ convertedCode });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }

});

// Route for debugging code using OpenAI GPT
app.post('/debug', async (req, res) => {
  const { code } = req.body;
  const apiKey = process.env.OPENAI_API_KEY;; // Replace this with your OpenAI API key
  const prompt=`Debug the following ${code} and provide possible solution`
  try {
    const response = await axios.post('https://api.openai.com/v1/chat//completions', {
      messages:[{"role":"user","content":prompt}],
      model:"gpt-3.5-turbo",
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
    });

    const debugOutput = response.data.choices[0].message.content;
    res.status(200).json({ debugOutput });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error debugging code' });
  }
});

// Route for code quality check using OpenAI GPT
app.post('/quality', async (req, res) => {
  const { code } = req.body;
  const apiKey = process.env.OPENAI_API_KEY; // Replace this with your OpenAI API key
  const prompt= `Perform a quality check on the following code:\n${code} and response should have overall summary of code quanlity. 
  Also evaluate the code based on Code consistency, Code performance, Code documentation, Error handling, Code testability,
  Code modularity, Code complexity, Code duplication, Code readability. Also provide a score out of 10 for every evaluation and overall score.`
  try {
    const response = await axios.post('https://api.openai.com/v1/chat//completions', {
      messages:[{"role":"user","content":prompt}],
      model:"gpt-3.5-turbo",
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
    });

    const qualityCheckOutput = response.data.choices[0].message.content;
    res.status(200).json({ qualityCheckOutput });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error performing quality check' });
  }
});

const PORT = process.env.port||6090;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

