package com.thesis_formatter.thesis_formatter.controller;

import com.thesis_formatter.thesis_formatter.dto.request.AddMileStoneRequest;
import com.thesis_formatter.thesis_formatter.dto.response.APIResponse;
import com.thesis_formatter.thesis_formatter.dto.response.MilestoneResponse;
import com.thesis_formatter.thesis_formatter.dto.response.ProgressResponse;
import com.thesis_formatter.thesis_formatter.service.MilestoneService;
import com.thesis_formatter.thesis_formatter.service.ProgressService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.net.MalformedURLException;

@RestController
@RequiredArgsConstructor
@RequestMapping("/progresses")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ProgressController {
    ProgressService progressService;

    @PostMapping
    public APIResponse<ProgressResponse> create(@RequestParam String formRecordId) throws MalformedURLException {
        System.out.println(formRecordId);
        return progressService.createProgress(formRecordId);
    }

    @GetMapping("/{progressId}")
    public APIResponse<ProgressResponse> getProgressById(@PathVariable String progressId) throws MalformedURLException {
        return progressService.getProgressById(progressId);
    }

}
