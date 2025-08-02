package com.thesis_formatter.thesis_formatter.controller;

import com.thesis_formatter.thesis_formatter.dto.request.AddTaskRequest;
import com.thesis_formatter.thesis_formatter.dto.response.APIResponse;
import com.thesis_formatter.thesis_formatter.dto.response.TaskResponse;
import org.springframework.core.io.Resource;
import com.thesis_formatter.thesis_formatter.service.TaskService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.net.MalformedURLException;

@RestController
@RequiredArgsConstructor
@RequestMapping("/tasks")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class TaskController {
    TaskService taskService;

    @PostMapping
    public APIResponse<TaskResponse> createTask(@RequestBody AddTaskRequest request) throws MalformedURLException {
        return taskService.createTask(request);
    }

    @GetMapping("/{taskId}")
    public APIResponse<TaskResponse> getTask(@PathVariable String taskId) throws MalformedURLException {
        return taskService.getTaskById(taskId);
    }

    @GetMapping("/{taskId}/download")
    public ResponseEntity<APIResponse<Resource>> downloadFile(@PathVariable String taskId) throws MalformedURLException {
        APIResponse<Resource> response = taskService.downloadFile(taskId);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + response.getResult().getFilename() + "\"")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(response);
    }

    @PutMapping("{taskId}/markTaskComplete")
    public APIResponse<Void> markTaskComplete(@PathVariable String taskId) throws MalformedURLException {
        return taskService.markTaskComplete(taskId);
    }

    @PostMapping("/{taskId}/upload")
    public APIResponse<Void> uploadTaskFile(
            @PathVariable String taskId,
            @RequestParam("file") MultipartFile file) {


        return taskService.uploadFile(taskId, file);
    }

    @DeleteMapping("/{taskId}")
    public ResponseEntity<APIResponse<Void>> deleteTask(@PathVariable String taskId) {
        APIResponse<Void> response = taskService.deleteTask(taskId);
        return ResponseEntity.ok(response);
    }

}
