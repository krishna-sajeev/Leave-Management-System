package com.leavemanagement.backend.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import java.util.*;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "*")
public class ChatController {

    @Value("${gemini.api.key}")
    private String apiKey;

    private static final String GEMINI_URL =
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=";

    private static final String BASE_URL = "http://localhost:8080/api/";

    private final RestTemplate restTemplate = new RestTemplate();

    @PostMapping
    public Map<String, Object> chat(@RequestParam String message, @RequestParam String userId) {

        String lowerMsg = message.toLowerCase();
        String contextData = "";

        try {
            //  Detect user intent and fetch real-time info
            if (lowerMsg.contains("balance") || lowerMsg.contains("leave left")) {
                String url = BASE_URL + "leave-balance/user/" + userId;
                ResponseEntity<String> res = restTemplate.getForEntity(url, String.class);
                contextData = "Here is your latest leave balance data:\n" + res.getBody();
            } else if (lowerMsg.contains("holiday") || lowerMsg.contains("holidays")) {
                String url = BASE_URL + "holidays";
                ResponseEntity<String> res = restTemplate.getForEntity(url, String.class);
                contextData = "Here is the current holiday calendar:\n" + res.getBody();
            } else if (lowerMsg.contains("leave type") || lowerMsg.contains("types of leave")) {
                String url = BASE_URL + "leave-types";
                ResponseEntity<String> res = restTemplate.getForEntity(url, String.class);
                contextData = "These are the available leave types:\n" + res.getBody();
            } else if (lowerMsg.contains("apply") && lowerMsg.contains("leave")) {
                contextData = """
                        To apply for leave in LMS:
                        1. Go to the Leave Application dashboard.
                        2. Select Apply Leave .
                        3. Select leave type, start and end dates.
                        4. Click Submit — your manager will receive a notification.
                        """;
            }

        } catch (Exception e) {
            contextData = "Unable to fetch backend data: " + e.getMessage();
        }

        //  Policy context
        String policyPrompt = """
            You are an assistant for the Leave Management System (LMS).
            Only respond to questions about:
            - Leave balance
            - How to apply leave
            - Leave types
            - Holiday calendar
            - Leave approval process
            If asked something else, reply: 
            "I can only help you with leave management related queries."
            """;

        String finalPrompt = policyPrompt + "\n\nBackend data:\n" + contextData + "\n\nUser question: " + message;

        //  Prepare Gemini API request
        Map<String, Object> requestBody = Map.of(
                "contents", new Object[]{
                        Map.of("parts", new Object[]{
                                Map.of("text", finalPrompt)
                        })
                }
        );

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        try {
            ResponseEntity<Map> response = restTemplate.exchange(
                    GEMINI_URL + apiKey, HttpMethod.POST, entity, Map.class);

            Map<String, Object> body = response.getBody();
            if (body == null) return Map.of("reply", "No response from Gemini.");

            List<Map<String, Object>> candidates = (List<Map<String, Object>>) body.get("candidates");
            if (candidates == null || candidates.isEmpty()) return Map.of("reply", "No candidates returned.");

            Map<String, Object> content = (Map<String, Object>) candidates.get(0).get("content");
            List<Map<String, Object>> parts = (List<Map<String, Object>>) content.get("parts");
            String replyText = parts.get(0).get("text").toString();

            return Map.of("reply", replyText);

        } catch (Exception e) {
            e.printStackTrace();
            return Map.of("reply", "Error contacting Gemini: " + e.getMessage());
        }
    }
}
