package com.thesis_formatter.thesis_formatter.service;

import com.thesis_formatter.thesis_formatter.dto.response.APIResponse;
import com.thesis_formatter.thesis_formatter.entity.StudentClass;
import com.thesis_formatter.thesis_formatter.entity.Major;
import com.thesis_formatter.thesis_formatter.repo.ClassRepo;
import com.thesis_formatter.thesis_formatter.repo.MajorRepo;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ClassService {
    MajorRepo majorRepo;
    ClassRepo classRepo;

    public APIResponse<StudentClass> addClass(StudentClass studentClassRequest) {
        Optional<Major> major = majorRepo.findById(studentClassRequest.getMajor().getMajorId());
        studentClassRequest.setMajor(major.orElse(null));
        classRepo.save(studentClassRequest);
        return APIResponse
                .<StudentClass>builder()
                .code("200")
                .result(studentClassRequest)
                .build();
    }

    public APIResponse<List<StudentClass>> getAll() {
        List<StudentClass> studentClasses = classRepo.findAll();
        return APIResponse.<List<StudentClass>>builder()
                .code("200")
                .result(studentClasses)
                .build();
    }
}
