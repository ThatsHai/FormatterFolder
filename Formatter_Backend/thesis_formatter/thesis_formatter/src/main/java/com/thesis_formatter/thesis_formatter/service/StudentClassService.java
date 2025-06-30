package com.thesis_formatter.thesis_formatter.service;

import com.thesis_formatter.thesis_formatter.dto.response.APIResponse;
import com.thesis_formatter.thesis_formatter.entity.StudentClass;
import com.thesis_formatter.thesis_formatter.entity.Major;
import com.thesis_formatter.thesis_formatter.enums.ErrorCode;
import com.thesis_formatter.thesis_formatter.exception.AppException;
import com.thesis_formatter.thesis_formatter.repo.StudentClassRepo;
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
public class StudentClassService {
    MajorRepo majorRepo;
    StudentClassRepo studentClassRepo;

    public APIResponse<StudentClass> addClass(StudentClass studentClassRequest) {
        StudentClass classFinding = studentClassRepo.findByStudentClassId(studentClassRequest.getStudentClassId());
        if (classFinding != null) {
            throw new AppException(ErrorCode.DUPLICATE_KEY);
        }
        Optional<Major> major = majorRepo.findById(studentClassRequest.getMajor().getMajorId());
        studentClassRequest.setMajor(major.orElse(null));
        studentClassRepo.save(studentClassRequest);
        return APIResponse
                .<StudentClass>builder()
                .code("200")
                .result(studentClassRequest)
                .build();
    }

    public APIResponse<List<StudentClass>> getAll() {
        List<StudentClass> studentClasses = studentClassRepo.findAll();
        return APIResponse.<List<StudentClass>>builder()
                .code("200")
                .result(studentClasses)
                .build();
    }

    public APIResponse<List<StudentClass>> getClassByMajorId(String majorId) {
        List<StudentClass> classes = studentClassRepo.findByMajor_MajorId(majorId);
        return APIResponse.<List<StudentClass>>builder()
                .code("200")
                .result(classes)
                .build();
    }

}
