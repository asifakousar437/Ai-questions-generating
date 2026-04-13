package com.interview.ai.model;

import java.util.List;
import java.util.Map;

public class ChatRequest {
    private List<Map<String, String>> messages;

    public ChatRequest() {}

    public ChatRequest(List<Map<String, String>> messages) {
        this.messages = messages;
    }

    public List<Map<String, String>> getMessages() {
        return messages;
    }

    public void setMessages(List<Map<String, String>> messages) {
        this.messages = messages;
    }
}
