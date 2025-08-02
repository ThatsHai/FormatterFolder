package com.thesis_formatter.thesis_formatter.controller;

import com.thesis_formatter.thesis_formatter.dto.request.AddMileStoneRequest;
import com.thesis_formatter.thesis_formatter.dto.request.AddTaskRequest;
import com.thesis_formatter.thesis_formatter.dto.response.APIResponse;
import com.thesis_formatter.thesis_formatter.dto.response.MilestoneResponse;
import com.thesis_formatter.thesis_formatter.dto.response.TaskResponse;
import com.thesis_formatter.thesis_formatter.entity.Milestone;
import com.thesis_formatter.thesis_formatter.service.MilestoneService;
import com.thesis_formatter.thesis_formatter.service.TaskService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.net.MalformedURLException;

@RestController
@RequiredArgsConstructor
@RequestMapping("/milestones")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class MileStoneController {
    MilestoneService milestoneService;

    @PostMapping
    public APIResponse<MilestoneResponse> createTask(@RequestBody AddMileStoneRequest request) throws MalformedURLException {
        return milestoneService.create(request);
    }

    @GetMapping("/{milestoneId}")
    public APIResponse<MilestoneResponse> getMilestone(@PathVariable String milestoneId) throws MalformedURLException {
        return milestoneService.getById(milestoneId);
    }

    @DeleteMapping("/{milestoneId}")
    public APIResponse<Void> deleteTask(@PathVariable String milestoneId) {
        return milestoneService.delete(milestoneId);
    }

}
