package com.thesis_formatter.thesis_formatter.controller;

import com.thesis_formatter.thesis_formatter.dto.request.AddTaskRequest;
import com.thesis_formatter.thesis_formatter.dto.response.APIResponse;
import com.thesis_formatter.thesis_formatter.dto.response.TaskResponse;
import org.springframework.core.io.FileSystemResource;
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

import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

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

    @DeleteMapping("/taskId")
    public APIResponse<Void> delete(@PathVariable String taskId) throws MalformedURLException {
        return taskService.deleteTask(taskId);
    }

    @GetMapping("/{taskId}/download/{fileId}")
    public ResponseEntity<Resource> downloadFile(@PathVariable String taskId, @PathVariable String fileId) throws MalformedURLException {
        Resource resource = taskService.downloadFile(taskId, fileId);
        String filename = URLEncoder.encode(resource.getFilename(), StandardCharsets.UTF_8).replaceAll("\\+", "%20");

        String contentType = "application/octet-stream"; // fallback
        try {
            Path filePath = Paths.get(resource.getFile().getAbsolutePath());
            contentType = Files.probeContentType(filePath);
        } catch (IOException e) {
            // ignore, dùng default contentType
        }
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .contentType(MediaType.parseMediaType(contentType))
                .body(resource);
    }

    @PutMapping("{taskId}/markTaskComplete")
    public APIResponse<Void> markTaskComplete(@PathVariable String taskId) throws MalformedURLException {
        return taskService.markTaskComplete(taskId);
    }

    @PostMapping("/{taskId}/upload")
    public APIResponse<Void> uploadTaskFile(
            @PathVariable String taskId,
            @RequestPart(value = "files", required = false) MultipartFile[] files,
            @RequestPart(value = "deletedFileNames", required = false) String deletedFileNamesJson
    ) {
        return taskService.uploadFile(taskId, files, deletedFileNamesJson);
    }



    @DeleteMapping("/{taskId}")
    public ResponseEntity<APIResponse<Void>> deleteTask(@PathVariable String taskId) {
        APIResponse<Void> response = taskService.deleteTask(taskId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/view")
    public ResponseEntity<Resource> viewFile(@RequestParam String path) throws IOException {
        Path file = Paths.get(path);
        Resource resource = new FileSystemResource(file);

        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=" + file.getFileName().toString());
        headers.add(HttpHeaders.CONTENT_TYPE, Files.probeContentType(file)); // auto detect type

        return ResponseEntity.ok()
                .headers(headers)
                .body(resource);
    }


}
