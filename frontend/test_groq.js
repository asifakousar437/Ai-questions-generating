import axios from 'axios';

async function testGroq() {
  try {
    const res = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: `You are a professional technical interviewer and mentor. Generate exactly 20 interview questions with answers based on: Skill: React\nDifficulty: Medium\nRules:\nInclude conceptual, coding, and scenario-based questions.\nProvide clear and accurate answers. For coding questions, include working code inside the 'answer' field formatted properly using Markdown (e.g., \`\`\`java ... \`\`\`). Avoid repetition.\nThe final output MUST be exactly ONE valid JSON array. Do not wrap the entire JSON output in markdown formatting, just output the raw JSON array string.\nEach object MUST have the following keys: "question", "type" (either 'Conceptual', 'Coding', or 'Scenario'), "difficulty", "answer".` }],
      temperature: 0.7,
      max_tokens: 8192,
      response_format: { type: "json_object" }
    }, {
      headers: {
        'Authorization': 'Bearer YOUR_GROQ_API_KEY',
        'Content-Type': 'application/json'
      }
    });
    console.log("FULL CONTENT:", res.data.choices[0].message.content);
  } catch (err) {
    console.error("ERROR:", err.response ? JSON.stringify(err.response.data) : err.message);
  }
}
testGroq();
