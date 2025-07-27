package com.thesis_formatter.thesis_formatter.service;

import com.thesis_formatter.thesis_formatter.dto.request.AddDefenseScheduleRequest;
import com.thesis_formatter.thesis_formatter.dto.response.APIResponse;
import com.thesis_formatter.thesis_formatter.dto.response.DefenseScheduleResponse;
import com.thesis_formatter.thesis_formatter.entity.*;
import com.thesis_formatter.thesis_formatter.enums.ErrorCode;
import com.thesis_formatter.thesis_formatter.exception.AppException;
import com.thesis_formatter.thesis_formatter.mapper.DefenseScheduleMapper;
import com.thesis_formatter.thesis_formatter.repo.DefenseScheduleRepo;
import com.thesis_formatter.thesis_formatter.repo.FormRecordRepo;
import com.thesis_formatter.thesis_formatter.repo.TeacherRepo;
import com.thesis_formatter.thesis_formatter.repo.TopicRepo;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class DefenseScheduleService {
    DefenseScheduleRepo defenseScheduleRepo;
    private final TopicRepo topicRepo;
    private final TeacherRepo teacherRepo;
    private final DefenseScheduleMapper defenseScheduleMapper;
    private final FormRecordRepo formRecordRepo;

    public DefenseSchedule createDefenseSchedule(AddDefenseScheduleRequest request) {
        FormRecord formRecord = formRecordRepo.findById(request.getFormRecordId()).orElseThrow(() -> new AppException(ErrorCode.FormRecord_NOT_FOUND));
        Student student = formRecord.getStudent();
        List<Teacher> teachers = teacherRepo.findByUserIdIn(request.getTeacherIds());
        DefenseSchedule defenseSchedule = DefenseSchedule.builder()
                .stt(request.getStt())
                .formRecord(formRecord)
                .student(student)
                .teachers(teachers)
                .startTime(request.getStartTime())
                .place(request.getPlace())
                .build();
        DefenseSchedule savedschedule = defenseScheduleRepo.save(defenseSchedule);
        return savedschedule;
    }

    public APIResponse<List<DefenseScheduleResponse>> addDefenseSchedule(List<AddDefenseScheduleRequest> requests) {
        List<DefenseScheduleResponse> responses = new ArrayList<>();
        for (AddDefenseScheduleRequest request : requests) {
            DefenseSchedule defenseSchedule = createDefenseSchedule(request);
            responses.add(
                    defenseScheduleMapper.toResponse(defenseSchedule)
            );
        }
        return APIResponse.<List<DefenseScheduleResponse>>builder()
                .code("200")
                .result(responses)
                .build();
    }

    public APIResponse<List<DefenseScheduleResponse>> getAll() {
        List<DefenseSchedule> defenseSchedules = defenseScheduleRepo.findAll();
        List<DefenseScheduleResponse> responses = defenseScheduleMapper.toResponses(defenseSchedules);
//        for (DefenseSchedule defenseSchedule : defenseSchedules) {
//            responses.add(
//                    defenseScheduleMapper.toResponse(defenseSchedule)
//            );
//        }
        return APIResponse.<List<DefenseScheduleResponse>>builder()
                .code("200")
                .result(responses)
                .build();

    }
}

