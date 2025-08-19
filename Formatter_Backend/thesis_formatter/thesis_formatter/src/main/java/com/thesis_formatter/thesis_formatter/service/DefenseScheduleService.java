package com.thesis_formatter.thesis_formatter.service;

import com.thesis_formatter.thesis_formatter.dto.request.AddDefenseScheduleRequest;
import com.thesis_formatter.thesis_formatter.dto.request.SchedulePDFRequest;
import com.thesis_formatter.thesis_formatter.dto.response.APIResponse;
import com.thesis_formatter.thesis_formatter.dto.response.DefenseScheduleResponse;
import com.thesis_formatter.thesis_formatter.entity.*;
import com.thesis_formatter.thesis_formatter.enums.ErrorCode;
import com.thesis_formatter.thesis_formatter.enums.Semester;
import com.thesis_formatter.thesis_formatter.exception.AppException;
import com.thesis_formatter.thesis_formatter.mapper.DefenseScheduleMapper;
import com.thesis_formatter.thesis_formatter.repo.DefenseScheduleRepo;
import com.thesis_formatter.thesis_formatter.repo.FormRecordRepo;
import com.thesis_formatter.thesis_formatter.repo.TeacherRepo;
import com.thesis_formatter.thesis_formatter.repo.TopicRepo;
import com.thesis_formatter.thesis_formatter.utils.DefenseScheduleToPDF;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
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
//        FormRecord formRecord = formRecordRepo.findById(request.getFormRecordId()).orElseThrow(() -> new AppException(ErrorCode.FormRecord_NOT_FOUND));
//        List<Teacher> teachers = teacherRepo.findByUserIdIn(request.getTeacherIds());
//        DefenseSchedule defenseSchedule = DefenseSchedule.builder()
//                .formRecord(formRecord)
//                .teachers(teachers)
//                .startTime(request.getStartTime())
//                .place(request.getPlace())
//                .build();
//        DefenseSchedule savedschedule = defenseScheduleRepo.save(defenseSchedule);
//        return savedschedule;
        FormRecord formRecord = formRecordRepo.findById(request.getFormRecordId())
                .orElseThrow(() -> new AppException(ErrorCode.FormRecord_NOT_FOUND));

        DefenseSchedule defenseSchedule = defenseScheduleRepo
                .findDefenseScheduleByFormRecord_FormRecordId(formRecord.getFormRecordId());

        if (defenseSchedule == null) {
            // no existing schedule → create new
            defenseSchedule = DefenseSchedule.builder()
                    .formRecord(formRecord)
                    .build();
        }

        List<Teacher> teachers = teacherRepo.findByUserIdIn(request.getTeacherIds());

        defenseSchedule.setTeachers(teachers);
        defenseSchedule.setStartTime(request.getStartTime());
        defenseSchedule.setPlace(request.getPlace());

        return defenseScheduleRepo.save(defenseSchedule);
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

    public ResponseEntity<Resource> getPDF(List<SchedulePDFRequest> schedulePDFRequests) throws Exception {
        String filename = "schedule_" + ".pdf";
        File tempFile = File.createTempFile(filename, null);

        // 2. Generate the PDF using your utility
        DefenseScheduleToPDF.generateStudentTopicPdf(tempFile.getAbsolutePath(), schedulePDFRequests);

        // 3. Return the PDF as a download
        InputStreamResource resource = new InputStreamResource(new FileInputStream(tempFile));

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + filename)
                .contentType(MediaType.APPLICATION_PDF)
                .contentLength(tempFile.length())
                .body(resource);
    }

    public APIResponse<List<DefenseScheduleResponse>> getByFormRecordIds(List<String> formRecordIds) {
        List<DefenseScheduleResponse> responseList = new ArrayList<>();

        for (String formRecordId : formRecordIds) {
            FormRecord formRecord = formRecordRepo.findById(formRecordId)
                    .orElseThrow(() -> new AppException(ErrorCode.FormRecord_NOT_FOUND));

            DefenseSchedule defenseSchedule = defenseScheduleRepo.findDefenseScheduleByFormRecord_FormRecordId(formRecordId);

            if (defenseSchedule == null) {
                // Optional: create a placeholder response
                DefenseScheduleResponse placeholder = new DefenseScheduleResponse();
                placeholder.setFormRecordId(formRecordId);
                placeholder.setStartTime(null);
                placeholder.setPlace(null);
                responseList.add(placeholder);
            } else {
                DefenseScheduleResponse response = defenseScheduleMapper.toResponse(defenseSchedule);
                responseList.add(response);
            }
        }

        return APIResponse.<List<DefenseScheduleResponse>>builder()
                .result(responseList)
                .code("200")
                .build();
    }

    public APIResponse<List<DefenseScheduleResponse>> getBySemesterAndYear(Semester semester, String year) {
        List<DefenseSchedule> responseList = defenseScheduleRepo.findByFormRecord_Topic_SemesterAndFormRecord_Topic_Year(semester, year);
        List<DefenseScheduleResponse> responses = defenseScheduleMapper.toResponses(responseList);
        return APIResponse.<List<DefenseScheduleResponse>>builder()
                .code("200")
                .result(responses)
                .build();

    }
}

