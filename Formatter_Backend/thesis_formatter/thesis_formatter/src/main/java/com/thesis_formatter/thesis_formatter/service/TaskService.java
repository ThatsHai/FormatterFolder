package com.thesis_formatter.thesis_formatter.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.thesis_formatter.thesis_formatter.dto.request.AddTaskRequest;
import com.thesis_formatter.thesis_formatter.dto.response.APIResponse;
import com.thesis_formatter.thesis_formatter.dto.response.TaskResponse;
import com.thesis_formatter.thesis_formatter.entity.Milestone;
import com.thesis_formatter.thesis_formatter.entity.Task;
import com.thesis_formatter.thesis_formatter.entity.TaskFile;
import com.thesis_formatter.thesis_formatter.exception.AppException;
import com.thesis_formatter.thesis_formatter.mapper.TaskMapper;
import com.thesis_formatter.thesis_formatter.repo.MilestoneRepo;
import com.thesis_formatter.thesis_formatter.repo.TaskFileRepo;
import com.thesis_formatter.thesis_formatter.repo.TaskRepo;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.FileSystemUtils;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import com.fasterxml.jackson.core.type.TypeReference;


@Service
@Transactional
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class TaskService {

    private final TaskRepo taskRepo;
    private final MilestoneRepo milestoneRepo;
    private final TaskMapper taskMapper;
    private final TaskFileRepo taskFileRepo;

    public APIResponse<TaskResponse> createTask(AddTaskRequest request) throws AppException {
        String milestoneId = request.getMilestoneId();
        Milestone milestone = milestoneRepo.findById(milestoneId)
                .orElseThrow(() -> new RuntimeException("Milestone not found"));
        milestone.setCompleted(false);
        milestoneRepo.save(milestone);
        String title = request.getTitle();
        String description = request.getDescription();
        boolean requiredFile = request.isRequiredFile();

        Task task = Task.builder()
                .name(title)
                .description(description)
                .milestone(milestone)
                .requireFile(requiredFile)
                .maxNumberOfFiles(request.getMaxNumberOfFiles())
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
        task.setCompletedDate(new Date());
        taskRepo.save(task);

        // Kiểm tra nếu tất cả các task trong milestone đều hoàn thành → milestone hoàn thành
        String milestoneId = task.getMilestone().getId();
        Milestone milestone = milestoneRepo.findById(milestoneId)
                .orElseThrow(() -> new RuntimeException("Milestone not found"));
        List<Task> tasks = milestone.getTasks();
        for (Task task1 : tasks) {
            System.out.println("name = " + task1.getName() + ". complted = " + task1.isCompleted());
        }
        boolean allTasksComplete = milestone.getTasks().stream()
                .allMatch(Task::isCompleted);

        if (allTasksComplete && !milestone.getCompleted()) {
            milestone.setCompleted(true);
            milestoneRepo.save(milestone);
        }

        return APIResponse.<Void>builder()
                .code("200")
                .message("Task completed")
                .build();
    }
//
//    public APIResponse<Void> uploadFile(String taskId, MultipartFile[] files) {
//        Task task = taskRepo.findById(taskId)
//                .orElseThrow(() -> new RuntimeException("Task not found"));
//
//        String uploadDir = "./upload/tasks/" + taskId;
//        for (MultipartFile file : files) {
//            String fileName = StringUtils.cleanPath(file.getOriginalFilename());
//            Path filePath = Paths.get(uploadDir, fileName);
//
//            try {
//                Files.createDirectories(filePath.getParent());
//                Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
//
//                TaskFile taskFile = TaskFile.builder()
//                        .filename(fileName)
//                        .filePath(filePath.toString())
//                        .task(task)
//                        .build();
//
//                taskFileRepo.save(taskFile);
//                task.getFiles().add(taskFile);
//            } catch (IOException e) {
//                throw new RuntimeException("Error while uploading file");
//            }
//        }
//        taskRepo.save(task);
//        return APIResponse.<Void>builder()
//                .code("200")
//                .message("Upload completed")
//                .build();
//    }

    public APIResponse<Void> uploadFile(String taskId, MultipartFile[] files, String deletedFileNamesJson) {
        Task task = taskRepo.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        String uploadDir = "./upload/tasks/" + taskId;

        // Xoá các file bị xoá từ FE
        if (deletedFileNamesJson != null && !deletedFileNamesJson.isEmpty()) {
            try {
                ObjectMapper mapper = new ObjectMapper();
                List<String> deletedNames = mapper.readValue(deletedFileNamesJson, new TypeReference<>() {
                });
                for (String fileName : deletedNames) {
                    Optional<TaskFile> fileToDelete = taskFileRepo.findByTaskAndFilename(task, fileName);
                    if (fileToDelete.isPresent()) {
                        TaskFile tf = fileToDelete.get();

                        // Xoá trên ổ đĩa
                        try {
                            Files.deleteIfExists(Paths.get(tf.getFilePath()));
                        } catch (IOException e) {

                        }

                        // Xoá trong DB
                        taskFileRepo.delete(tf);
                        task.getFiles().remove(tf);
                    }
                }
            } catch (IOException e) {
                throw new RuntimeException("Failed to parse deletedFileNames");
            }
        }

        // Upload các file mới
        if (files != null && files.length > 0) {
            for (MultipartFile file : files) {
                String fileName = StringUtils.cleanPath(file.getOriginalFilename());
                Path filePath = Paths.get(uploadDir, fileName);

                try {

                    Files.createDirectories(filePath.getParent());

                    // Ghi đè file nếu đã tồn tại
                    Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

                    // Kiểm tra file đã tồn tại trong DB chưa
                    Optional<TaskFile> existing = taskFileRepo.findByTaskAndFilename(task, fileName);
                    if (existing.isEmpty()) {
                        // Tạo bản ghi mới
                        TaskFile taskFile = TaskFile.builder()
                                .filename(fileName)
                                .filePath(filePath.toString())
                                .task(task)
                                .build();
                        taskFileRepo.save(taskFile);
                        task.getFiles().add(taskFile);
                    }
                } catch (IOException e) {
                    throw new RuntimeException("Error while uploading file: " + fileName, e);
                }
            }
        }

        taskRepo.save(task);
        return APIResponse.<Void>builder()
                .code("200")
                .message("Upload completed")
                .build();
    }

    public Resource downloadFile(String taskId, String fileId) throws MalformedURLException {
        Task task = taskRepo.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        // Tìm file thuộc task
        TaskFile taskFile = task.getFiles().stream()
                .filter(f -> f.getId().equals(fileId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("File not found in this task"));

        String filePath = taskFile.getFilePath();
        if (filePath == null || filePath.isBlank()) {
            throw new RuntimeException("File path is empty");
        }

        Path path = Paths.get(filePath);
        if (!Files.exists(path)) {
            throw new RuntimeException("File not found");
        }

        Resource resource = new UrlResource(path.toUri());
        if (!resource.exists() || !resource.isReadable()) {
            throw new RuntimeException("Cannot read file");
        }

        return resource;
    }


    public APIResponse<Void> deleteTask(String taskId) {
        Task task = taskRepo.findById(taskId)
                .orElseThrow(() -> new RuntimeException("task not found"));

        // Xóa thư mục file
        Path taskDir = Paths.get("./upload/tasks/" + taskId);
        try {
            FileSystemUtils.deleteRecursively(taskDir);
        } catch (IOException e) {
            throw new RuntimeException("Không thể xóa thư mục chứa file đính kèm", e);
        }

        taskRepo.delete(task);

        return APIResponse.<Void>builder()
                .code("200")
                .message("Task deleted successfully")
                .build();
    }

}
