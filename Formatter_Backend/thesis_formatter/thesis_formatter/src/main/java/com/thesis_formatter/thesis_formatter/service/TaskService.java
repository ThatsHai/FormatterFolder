package com.thesis_formatter.thesis_formatter.service;

import com.thesis_formatter.thesis_formatter.dto.request.AddTaskRequest;
import com.thesis_formatter.thesis_formatter.dto.response.APIResponse;
import com.thesis_formatter.thesis_formatter.dto.response.TaskResponse;
import com.thesis_formatter.thesis_formatter.entity.Milestone;
import com.thesis_formatter.thesis_formatter.entity.Task;
import com.thesis_formatter.thesis_formatter.exception.AppException;
import com.thesis_formatter.thesis_formatter.mapper.TaskMapper;
import com.thesis_formatter.thesis_formatter.repo.MilestoneRepo;
import com.thesis_formatter.thesis_formatter.repo.TaskRepo;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.jsoup.internal.StringUtil;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

@Service
@Transactional
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class TaskService {

    private final TaskRepo taskRepo;
    private final MilestoneRepo milestoneRepo;
    private final TaskMapper taskMapper;

    public APIResponse<TaskResponse> createTask(AddTaskRequest request) throws AppException {
        String milestoneId = request.getMilestoneId();
        Milestone milestone = milestoneRepo.findById(milestoneId)
                .orElseThrow(() -> new RuntimeException("Milestone not found"));
        String title = request.getTitle();
        String description = request.getDescription();
        boolean requiredFile = request.isRequiredFile();

        Task task = Task.builder()
                .name(title)
                .description(description)
                .milestone(milestone)
                .requireFile(requiredFile)
                .build();
        TaskResponse response = taskMapper.taskToTaskResponse(taskRepo.save(task));
        return APIResponse.<TaskResponse>builder()
                .code("200")
                .result(response)
                .build();
    }


    public APIResponse<TaskResponse> getTaskById(String taskId) {
        Task task = taskRepo.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));
        return APIResponse.<TaskResponse>builder()
                .code("200")
                .result(taskMapper.taskToTaskResponse(task))
                .build();
    }


    public APIResponse<Void> markTaskComplete(String taskId) {
        Task task = taskRepo.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        if (task.isRequireFile() && !task.isFileSubmitted()) {
            throw new RuntimeException("Task requires a file to be submitted before completion.");
        }

        task.setCompleted(true);
        taskRepo.save(task);

        // Kiểm tra nếu tất cả các task trong milestone đều hoàn thành → milestone hoàn thành
        Milestone milestone = task.getMilestone();
        boolean allTasksComplete = milestone.getTasks().stream()
                .allMatch(Task::isCompleted);

        if (allTasksComplete && !milestone.isCompleted()) {
            milestone.setCompleted(true);
            milestoneRepo.save(milestone);
        }

        return APIResponse.<Void>builder()
                .code("200")
                .message("Task completed")
                .build();
    }

    public APIResponse<Void> uploadFile(String taskId, MultipartFile file) {
        Task task = taskRepo.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        String uploadDir = "./upload/tasks/" + taskId;
        String fileName = StringUtils.cleanPath(file.getOriginalFilename());
        Path filePath = Paths.get(uploadDir, fileName);

        try {
            Files.createDirectories(filePath.getParent());
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            task.setFilePath(filePath.toString());
            taskRepo.save(task);
        } catch (IOException e) {
            throw new RuntimeException("Error while uploading file");
        }
        return APIResponse.<Void>builder()
                .code("200")
                .message("Upload completed")
                .build();
    }

    public APIResponse<Resource> downloadFile(String taskId) throws MalformedURLException {
        Task task = taskRepo.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));
        String filePath = task.getFilePath();
        if (filePath == null || filePath.isBlank()) {
            throw new RuntimeException("File path is empty");
        }


        Path path = Paths.get(filePath);
        if (!Files.exists(path)) {
            throw new RuntimeException("File not found");
        }

        Resource resource = new UrlResource(path.toUri());
        if (!resource.exists() || !resource.isReadable()) {
            throw new RuntimeException("Không đọc được file");
        }

        return APIResponse.<Resource>builder()
                .code("200")
                .result(resource)
                .build();
    }

    public APIResponse<Void> deleteTask(String taskId) {
        Task task = taskRepo.findById(taskId)
                .orElseThrow(() -> new RuntimeException("task not found"));

        // Xóa file đính kèm nếu có
        String filePath = task.getFilePath();
        if (filePath != null && !filePath.isBlank()) {
            Path path = Paths.get(filePath);
            try {
                Files.deleteIfExists(path);
            } catch (IOException e) {
                throw new RuntimeException("Không thể xóa file đính kèm");
            }
        }

        // Xóa task trong database
        taskRepo.delete(task);

        return APIResponse.<Void>builder()
                .code("200")
                .message("Task deleted successfully")
                .build();
    }

}
