package com.thesis_formatter.thesis_formatter.service;

import com.thesis_formatter.thesis_formatter.dto.request.AddStudentRequest;
import com.thesis_formatter.thesis_formatter.dto.request.AddTeacherTopicLimitRequest;
import com.thesis_formatter.thesis_formatter.dto.request.TeacherTopicLimitRequest;
import com.thesis_formatter.thesis_formatter.dto.response.APIResponse;
import com.thesis_formatter.thesis_formatter.dto.response.TeacherDTO;
import com.thesis_formatter.thesis_formatter.dto.response.TeacherTopicWithLimitResponse;
import com.thesis_formatter.thesis_formatter.entity.Teacher;
import com.thesis_formatter.thesis_formatter.entity.TeacherTopicLimit;
import com.thesis_formatter.thesis_formatter.entity.id.TeacherTopicLimitId;
import com.thesis_formatter.thesis_formatter.enums.ErrorCode;
import com.thesis_formatter.thesis_formatter.enums.Semester;
import com.thesis_formatter.thesis_formatter.exception.AppException;
import com.thesis_formatter.thesis_formatter.mapper.TeacherMapper;
import com.thesis_formatter.thesis_formatter.repo.TeacherRepo;
import com.thesis_formatter.thesis_formatter.repo.TeacherTopicLimitRepo;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class TeacherTopicLimitService {
    TeacherTopicLimitRepo teacherTopicLimitRepo;
    TeacherRepo teacherRepo;
    TeacherMapper teacherMapper;

    public APIResponse<List<TeacherTopicWithLimitResponse>> getAll() {
        List<TeacherTopicLimit> results = teacherTopicLimitRepo.findAll();
        List<TeacherTopicWithLimitResponse> responses = new ArrayList<>();
        for (TeacherTopicLimit teacherTopicLimit : results) {
            responses.add(TeacherTopicWithLimitResponse.builder()
                    .userId(teacherTopicLimit.getId().getTeacherId())
                    .maxTopics(teacherTopicLimit.getMaxTopics())
                    .name(teacherTopicLimit.getTeacher().getName())
                    .topicResponses(new ArrayList<>())
                    .build());
        }
        return APIResponse.<List<TeacherTopicWithLimitResponse>>builder()
                .code("200")
                .result(responses)
                .build();
    }

    public TeacherTopicWithLimitResponse getLimitTopicByTeacherId(String teacherAcId, String semester, String year) {
        TeacherTopicLimitId id = new TeacherTopicLimitId();
        id.setTeacherId(teacherAcId);
        id.setSemester(Semester.valueOf(semester.toUpperCase()));
        id.setSchoolYear(year);
        TeacherTopicLimit teacherTopicLimit = teacherTopicLimitRepo.findTeacherTopicLimitById(id);
        if (teacherTopicLimit == null) {
            throw new RuntimeException("Chưa có giới hạn số lượng đề tài cho giảng viên trong kỳ này!");
        }
        TeacherTopicWithLimitResponse response = TeacherTopicWithLimitResponse.builder()
                .userId(teacherTopicLimit.getTeacher().getUserId())
                .name(teacherTopicLimit.getTeacher().getName())
                .maxTopics(teacherTopicLimit.getMaxTopics())
                .build();
        return response;
    }

    public APIResponse<TeacherTopicWithLimitResponse> getByTeacherId(String teacherAcId, String semester, String year) {
        TeacherTopicWithLimitResponse response = getLimitTopicByTeacherId(teacherAcId, semester, year);
        return APIResponse.<TeacherTopicWithLimitResponse>builder()
                .code("200")
                .result(response)
                .build();
    }
//
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

        //TeacherTopicLimit saved teacher, but Request save DTO
        return APIResponse.<TeacherTopicLimitRequest>builder()
                .code("200")
                .result(teacherTopicLimitRequest)
                .build();
    }


    public APIResponse<List<AddTeacherTopicLimitRequest>> addTeacherTopicLimitWithId(List<AddTeacherTopicLimitRequest> addTeacherTopicLimitRequestList) {
        List<AddTeacherTopicLimitRequest> addTeacherTopicLimitRequests = new ArrayList<>();
        for (AddTeacherTopicLimitRequest addTeacherTopicLimitRequest : addTeacherTopicLimitRequestList) {
            Teacher teacher = teacherRepo.findByUserId(addTeacherTopicLimitRequest.getUserId());
            if (teacher == null) {
                continue;
            }

            String teacherId = teacher.getAcId();
            TeacherTopicLimitId id = new TeacherTopicLimitId();
            id.setTeacherId(teacherId);
            id.setSemester(addTeacherTopicLimitRequest.getSemester());
            id.setSchoolYear(addTeacherTopicLimitRequest.getSchoolYear());

            TeacherTopicLimit teacherTopicLimit = new TeacherTopicLimit();
            teacherTopicLimit.setId(id);
            teacherTopicLimit.setMaxTopics(addTeacherTopicLimitRequest.getMaxTopics());
            teacherTopicLimit.setTeacher(teacher);
            teacherTopicLimitRepo.save(teacherTopicLimit);
            addTeacherTopicLimitRequests.add(addTeacherTopicLimitRequest);
        }
        return APIResponse.<List<AddTeacherTopicLimitRequest>>builder().result(addTeacherTopicLimitRequests).code("200").build();
    }
}
