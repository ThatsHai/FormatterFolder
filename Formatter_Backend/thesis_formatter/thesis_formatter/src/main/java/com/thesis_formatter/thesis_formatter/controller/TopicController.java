package com.thesis_formatter.thesis_formatter.controller;

import com.thesis_formatter.thesis_formatter.entity.Topic;
import com.thesis_formatter.thesis_formatter.response.APIResponse;
import com.thesis_formatter.thesis_formatter.service.TopicService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@CrossOrigin
public class TopicController {
    TopicService topicService;

    @GetMapping("/topics")
    public APIResponse<List<Topic>> getTopics() {
        return topicService.getAll();
    }

    @PostMapping("/topics/create")
    public APIResponse<Topic> createTopic(@RequestBody Topic topic) {
        return topicService.create(topic);
    }
}
