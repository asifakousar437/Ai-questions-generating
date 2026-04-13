package com.interview.ai.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.interview.ai.model.InterviewQuestion;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class GroqAiService {

    @Value("${groq.api.key}")
    private String apiKey;

    @Value("${groq.chatbot.key}")
    private String chatbotKey;

    private static final String GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

    public String chatWithAI(List<Map<String, String>> messages) {
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(chatbotKey);

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", "llama-3.3-70b-versatile");
        requestBody.put("messages", messages);
        requestBody.put("temperature", 0.7);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, entityHeaders(headers));

        try {
            Map<String, Object> response = restTemplate.postForObject(GROQ_API_URL, entity, Map.class);
            if (response != null && response.containsKey("choices")) {
                List<Map<String, Object>> choices = (List<Map<String, Object>>) response.get("choices");
                if (!choices.isEmpty()) {
                    Map<String, Object> messageObj = (Map<String, Object>) choices.get(0).get("message");
                    return (String) messageObj.get("content");
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return "I'm having trouble connecting to my AI brain right now. Please try again in a moment!";
    }

    public List<InterviewQuestion> generateQuestions(String skill, String difficulty, String company) {
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey);

        String targetCompany = (company != null && !company.isBlank()) ? company : "Any company";
        String prompt = String.format(
            "You are a professional technical interviewer and mentor.\n\n" +
            "TASK: Generate exactly 10 interview questions with detailed answers based on:\n" +
            "Skill: %s\nDifficulty: %s\nCompany: %s\n\n" +
            "If the company is 'Any company', generate general questions and answers that are still applicable for that skill. If a specific company is provided, tailor the questions to that company's style and typical interview focus.\n\n" +
            "### RULES:\n" +
            "1. Format ONLY as a valid JSON object with a key 'questions' containing an array of objects.\n" +
            "2. Include Conceptual, Coding, and Scenario-based questions.\n" +
            "3. **MANDATORY**: Every question MUST have a high-quality 'answer' field. It must never be null or empty.\n" +
            "4. **Conceptual/Scenario**: Provide a thorough explanation and include a specific real-world example using a bold header (**Example:**).\n" +
            "5. **Coding questions**: Provide working, optimized code formatted with Markdown triple backticks inside the 'answer' field. Always include complete executable code inside the fenced block; do not return an empty code block or placeholder code.\n\n" +
            "6. If code is not applicable, include a specific plain-text example after the code fence.\n\n" +
            "### EXAMPLE CODING FORMAT:\n" +
            "{\n" +
            "  \"question\": \"How do you reverse a string in Java?\",\n" +
            "  \"type\": \"Coding\",\n" +
            "  \"difficulty\": \"Easy\",\n" +
            "  \"answer\": \"You can use `StringBuilder.reverse()`.\\n\\n```java\\nString rev = new StringBuilder(\\\"hello\\\").reverse().toString();\\n```\"\n" +
            "}\n\n" +
            "Each object MUST have: \"question\", \"type\", \"difficulty\", \"answer\".",
            skill, difficulty, targetCompany
        );

        Map<String, Object> message = new HashMap<>();
        message.put("role", "user");
        message.put("content", prompt);

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", "llama-3.3-70b-versatile");
        requestBody.put("messages", new Object[]{message});
        requestBody.put("temperature", 0.5);
        requestBody.put("max_tokens", 8192);
        
        Map<String, String> responseFormat = new HashMap<>();
        responseFormat.put("type", "json_object");
        requestBody.put("response_format", responseFormat);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, entityHeaders(headers));

        try {
            Map<String, Object> response = restTemplate.postForObject(GROQ_API_URL, entity, Map.class);
            
            if (response != null && response.containsKey("choices")) {
                List<Map<String, Object>> choices = (List<Map<String, Object>>) response.get("choices");
                if (!choices.isEmpty()) {
                    Map<String, Object> firstChoice = choices.get(0);
                    Map<String, Object> messageObj = (Map<String, Object>) firstChoice.get("message");
                    String content = (String) messageObj.get("content");
                    
                    return parseJson(content);
                }
            }
        } catch (Exception e) {
            System.err.println("API ERROR: " + e.getMessage());
            if (e.getMessage() != null && (e.getMessage().contains("429") || e.getMessage().contains("rate_limit_exceeded"))) {
                throw new RuntimeException("RATE_LIMIT_EXCEEDED");
            }
            throw new RuntimeException("GENERATION_FAILED");
        }
        
        return new ArrayList<>();
    }

    private HttpHeaders entityHeaders(HttpHeaders headers) {
        return headers;
    }

    private List<InterviewQuestion> parseJson(String content) {
        ObjectMapper mapper = new ObjectMapper();
        try {
            content = content.trim();
            JsonNode rootNode = mapper.readTree(content);
            
            // Handle raw array: [...]
            if (rootNode.isArray()) {
                return mapper.convertValue(rootNode, new TypeReference<List<InterviewQuestion>>(){});
            }
            
            // Handle wrapped object: {"questions": [...]} or {"data": [...]}
            if (rootNode.isObject()) {
                JsonNode questionsNode = rootNode.get("questions");
                if (questionsNode == null) questionsNode = rootNode.get("interview_questions");
                if (questionsNode == null) questionsNode = rootNode.get("data");
                
                if (questionsNode != null && questionsNode.isArray()) {
                    return mapper.convertValue(questionsNode, new TypeReference<List<InterviewQuestion>>(){});
                }
            }
            
            System.err.println("AI returned JSON but no 'questions' array found. Raw: " + content);
            return new ArrayList<>();
        } catch (Exception e) {
            System.err.println("CRITICAL: Failed to navigate JSON structure.");
            System.err.println("RAW CONTENT FROM AI: " + content);
            e.printStackTrace();
            return new ArrayList<>();
        }
    }
}
