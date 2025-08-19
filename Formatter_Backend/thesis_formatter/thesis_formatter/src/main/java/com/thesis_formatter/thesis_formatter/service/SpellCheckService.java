package com.thesis_formatter.thesis_formatter.service;

import com.thesis_formatter.thesis_formatter.dto.response.APIResponse;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
public class SpellCheckService {

    private final RestTemplate restTemplate = new RestTemplate();
    private final String apiUrl = "http://localhost:8000/spellcheck";

    public APIResponse<Map<String, List<String>>> checkSpelling(String text) {
        // Tạo payload JSON
        Map<String, String> payload = new HashMap<>();
        payload.put("text", text);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, String>> entity = new HttpEntity<>(payload, headers);

        // Gọi API FastAPI
        ResponseEntity<Map> response = restTemplate.exchange(
                apiUrl,
                HttpMethod.POST,
                entity,
                Map.class
        );

        // Trích xuất "misspelled" từ response
        Map<String, Object> body = response.getBody();
        Map<String, List<String>> misspelled = (Map<String, List<String>>) body.get("misspelled");

        // Trả về APIResponse
        return new APIResponse<>("200", "Spellcheck completed", misspelled);
    }
}