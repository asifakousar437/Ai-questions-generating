import axios from 'axios';

async function test() {
  const apiKey = 'YOUR_GROQ_API_KEY';
  const url = 'https://api.groq.com/openai/v1/chat/completions';

  try {
    const response = await axios.post(url, {
      model: 'llama-3.1-8b-instant',
      messages: [{
        role: 'user',
        content: `You are a professional technical interviewer and mentor. Generate exactly 3 interview questions with answers based on: Skill: Java\nDifficulty: Easy\nRules:\nInclude conceptual, coding, and scenario-based questions.\nProvide clear and accurate answers. \nFor coding questions, include working code inside the 'answer' field using Markdown.\nEach object MUST have the following keys: "question", "type", "difficulty", "answer".`
      }],
      response_format: { type: 'json_object' }
    }, {
      headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' }
    });

    console.log(response.data.choices[0].message.content);
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
  }
}

test();
