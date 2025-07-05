package com.thesis_formatter.thesis_formatter.service;

import com.thesis_formatter.thesis_formatter.dto.response.APIResponse;
import com.thesis_formatter.thesis_formatter.entity.TeacherTopicLimit;
import com.thesis_formatter.thesis_formatter.repo.AccountRepo;
import com.thesis_formatter.thesis_formatter.repo.TeacherTopicLimitRepo;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class TeacherTopicLimitService {
    TeacherTopicLimitRepo teacherTopicLimitRepo;

    public APIResponse<List<TeacherTopicLimit>> getAll() {
        List<TeacherTopicLimit> results = teacherTopicLimitRepo.findAll();
        return APIResponse.<List<TeacherTopicLimit>>builder()
                .code("200")
                .result(results)
                .build();
    }
}
