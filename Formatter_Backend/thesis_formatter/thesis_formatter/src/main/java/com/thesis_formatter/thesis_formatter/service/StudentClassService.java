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
        if (studentClassRepo.findByStudentClassId(studentClassRequest.getStudentClassId()) != null) {
            throw new AppException(ErrorCode.DUPLICATE_KEY);
        }

        Major major = majorRepo.findById(studentClassRequest.getMajor().getMajorId())
                .orElseThrow(() -> new AppException(ErrorCode.MAJOR_NOT_EXISTED));

        studentClassRequest.setMajor(major);
        studentClassRepo.save(studentClassRequest);

        return APIResponse.<StudentClass>builder()
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

    public APIResponse<Major> getClassParent(String studentClassId) {
        StudentClass studentClass = studentClassRepo.findById(studentClassId)
                .orElseThrow(() -> new AppException(ErrorCode.STUDENTCLASS_NOT_FOUND));

        Major major = studentClass.getMajor();

        return APIResponse.<Major>builder()
                .code("200")
                .result(major)
                .build();
    }

    public APIResponse<StudentClass> updateClass(StudentClass studentClass) {
        StudentClass existedStudentClass = studentClassRepo.findByStudentClassId(studentClass.getStudentClassId());
        if (existedStudentClass == null) {
            throw new AppException(ErrorCode.STUDENTCLASS_NOT_FOUND);
        }
        Major major = majorRepo.findByMajorId(studentClass.getMajor().getMajorId());
        if (major == null) {
            throw new AppException(ErrorCode.MAJOR_NOT_EXISTED);
        }
        existedStudentClass.setMajor(major);
        existedStudentClass.setStudentClassName(studentClass.getStudentClassName());
        existedStudentClass.setAvailability(studentClass.getAvailability());
        studentClassRepo.save(existedStudentClass);
        return APIResponse.<StudentClass>builder()
                .code("200")
                .result(existedStudentClass)
                .build();
    }
}
