package com.interview.ai.controller;

import com.interview.ai.model.ChatRequest;
import com.interview.ai.model.InterviewQuestion;
import com.interview.ai.model.InterviewRequest;
import com.interview.ai.service.GroqAiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ai")
public class InterviewController {

    @Autowired
    private GroqAiService groqAiService;

    @PostMapping("/interview-questions")
    public ResponseEntity<List<InterviewQuestion>> getQuestions(@RequestBody InterviewRequest request) {
        List<InterviewQuestion> questions = groqAiService.generateQuestions(request.getSkill(), request.getDifficulty(), request.getCompany());
        if (questions == null || questions.isEmpty()) {
            return ResponseEntity.status(500).build();
        }
        return ResponseEntity.ok(questions);
    }

    @PostMapping("/chat")
    public ResponseEntity<Map<String, String>> getChatResponse(@RequestBody ChatRequest request) {
        String response = groqAiService.chatWithAI(request.getMessages());
        return ResponseEntity.ok(Map.of("message", response));
    }
}
