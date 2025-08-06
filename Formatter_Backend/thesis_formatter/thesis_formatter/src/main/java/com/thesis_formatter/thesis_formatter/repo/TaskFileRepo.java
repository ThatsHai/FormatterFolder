package com.thesis_formatter.thesis_formatter.repo;

import com.thesis_formatter.thesis_formatter.entity.Task;
import com.thesis_formatter.thesis_formatter.entity.TaskFile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TaskFileRepo extends JpaRepository<TaskFile, String> {
    Optional<TaskFile> findByTaskAndFilename(Task task, String filename);

}
