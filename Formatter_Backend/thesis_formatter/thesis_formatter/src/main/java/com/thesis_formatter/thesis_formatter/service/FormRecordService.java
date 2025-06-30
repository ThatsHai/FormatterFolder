package com.thesis_formatter.thesis_formatter.service;

import com.thesis_formatter.thesis_formatter.dto.request.AddFormRecordRequest;
import com.thesis_formatter.thesis_formatter.dto.request.FormRecordFieldRequest;
import com.thesis_formatter.thesis_formatter.dto.response.APIResponse;
import com.thesis_formatter.thesis_formatter.entity.*;
import com.thesis_formatter.thesis_formatter.enums.ErrorCode;
import com.thesis_formatter.thesis_formatter.exception.AppException;
import com.thesis_formatter.thesis_formatter.repo.FormFieldRepo;
import com.thesis_formatter.thesis_formatter.repo.FormRecordRepo;
import com.thesis_formatter.thesis_formatter.repo.StudentRepo;
import com.thesis_formatter.thesis_formatter.repo.TopicRepo;
import jakarta.persistence.criteria.From;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class FormRecordService {
    FormRecordRepo formRecordRepo;
    private final FormFieldRepo formFieldRepo;
    private final StudentRepo studentRepo;
    private final TopicRepo topicRepo;

    public APIResponse<FormRecord> createFormRecord(AddFormRecordRequest request) {
        Student student = studentRepo.findByUserId(request.getStudentId());
        Topic topic = topicRepo.findById(request.getTopicId())
                .orElseThrow(() -> new RuntimeException("ko co topic trong formrecord"));
        Form form = topic.getForm();
        FormRecord formRecord = new FormRecord();

        formRecord.setStudent(student);
        formRecord.setTopic(topic);
        if (request.getFormRecordFields() != null) {
            List<FormRecordField> recordFields = new ArrayList<>();

            for (FormRecordFieldRequest fieldRequest : request.getFormRecordFields()) {
                FormField formField = formFieldRepo.findById(fieldRequest.getFormFieldId())
                        .orElseThrow(() -> new RuntimeException("Không tìm thấy formField"));

                FormRecordField recordField = FormRecordField.builder()
                        .value(fieldRequest.getValue())
                        .formField(formField)
                        .formRecord(formRecord)
                        .build();

                recordFields.add(recordField);
            }

            formRecord.setFormRecordFields(recordFields);
        }

        FormRecord savedFormRecord = formRecordRepo.save(formRecord);
        return APIResponse.<FormRecord>builder()
                .code("200")
                .result(savedFormRecord)
                .build();
    }

    public APIResponse<List<FormRecord>> searchByStudentId(String studentId) {
        Student student = studentRepo.findByUserId(studentId);
        if (student == null) {
            throw new AppException(ErrorCode.USER_NOT_EXISTED);
        }
        List<FormRecord> formRecords = formRecordRepo.findAllByStudent_UserId(studentId);
        return APIResponse.<List<FormRecord>>builder()
                .code("200")
                .result(formRecords)
                .build();
    }

    public APIResponse<List<FormRecord>> getAll() {
        return APIResponse.<List<FormRecord>>builder()
                .code("200")
                .result(formRecordRepo.findAll())
                .build();
    }
}
