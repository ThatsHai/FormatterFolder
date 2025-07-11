package com.thesis_formatter.thesis_formatter.service;

import com.thesis_formatter.thesis_formatter.dto.request.TeacherTopicLimitRequest;
import com.thesis_formatter.thesis_formatter.dto.response.APIResponse;
import com.thesis_formatter.thesis_formatter.entity.Teacher;
import com.thesis_formatter.thesis_formatter.entity.TeacherTopicLimit;
import com.thesis_formatter.thesis_formatter.entity.id.TeacherTopicLimitId;
import com.thesis_formatter.thesis_formatter.enums.ErrorCode;
import com.thesis_formatter.thesis_formatter.exception.AppException;
import com.thesis_formatter.thesis_formatter.mapper.TeacherMapper;
import com.thesis_formatter.thesis_formatter.repo.TeacherRepo;
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
    TeacherRepo teacherRepo;
    TeacherMapper teacherMapper;

    public APIResponse<List<TeacherTopicLimit>> getAll() {
        List<TeacherTopicLimit> results = teacherTopicLimitRepo.findAll();
        return APIResponse.<List<TeacherTopicLimit>>builder()
                .code("200")
                .result(results)
                .build();
    }

//    public APIResponse<String> getByTeacherId(String teacherId) {
//        TeacherTopicLimit teacherTopicLimit = teacherTopicLimitRepo.findById(teacherId).orElseThrow(() -> new AppException(ErrorCode.ENTITY_NOT_FOUND));
//        return APIResponse.<String>builder()
//                .code("200")
//                .result(Integer.toString(teacherTopicLimit.getMaxTopics()))
//                .build();
//    }

//    private TeacherTopicLimitResponse toDTO(TeacherTopicLimit teacherTopicLimit) {
//        TeacherTopicLimitResponse teacherTopicLimitResponse = new TeacherTopicLimitResponse();
//
//    }

    public APIResponse<TeacherTopicLimitRequest> createTeacherTopicLimit(TeacherTopicLimitRequest teacherTopicLimitRequest) {
        // Change this line
        String teacherId = teacherTopicLimitRequest.getTeacherDTO().getAcId();

        Teacher teacher = teacherRepo.findById(teacherId)
                .orElseThrow(() -> new AppException(ErrorCode.TEACHER_NOT_EXISTED));

        TeacherTopicLimitId id = new TeacherTopicLimitId();
        id.setTeacherId(teacherId); // This teacherId now matches acId
        id.setSemester(teacherTopicLimitRequest.getSemester());
        id.setSchoolYear(teacherTopicLimitRequest.getSchoolYear());

        TeacherTopicLimit teacherTopicLimit = new TeacherTopicLimit();
        teacherTopicLimit.setId(id);
        teacherTopicLimit.setTeacher(teacher); // Don't forget this line to set the relationship
        teacherTopicLimit.setMaxTopics(teacherTopicLimitRequest.getMaxTopics());

        teacherTopicLimitRepo.save(teacherTopicLimit);

        return APIResponse.<TeacherTopicLimitRequest>builder()
                .code("200")
                .result(teacherTopicLimitRequest)
                .build();
    }


}
