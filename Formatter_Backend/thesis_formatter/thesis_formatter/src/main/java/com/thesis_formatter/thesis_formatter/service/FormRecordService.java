package com.thesis_formatter.thesis_formatter.service;

import com.thesis_formatter.thesis_formatter.dto.response.APIResponse;
import com.thesis_formatter.thesis_formatter.entity.Form;
import com.thesis_formatter.thesis_formatter.entity.FormField;
import com.thesis_formatter.thesis_formatter.entity.FormRecord;
import com.thesis_formatter.thesis_formatter.entity.FormRecordField;
import com.thesis_formatter.thesis_formatter.repo.FormRecordRepo;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class FormRecordService {
    FormRecordRepo formRecordRepo;
    public APIResponse<FormRecord> createFormRecord(FormRecord formRecord) {

        // Set the back-reference on each FormRecordField
//        if (formRecord.getFormRecordFields() != null) {
//            for (FormRecordField field : formRecord.getFormRecordFields()) {
//                field.setFormRecord(formRecord);
//            }
//        }
        FormRecord savedRecord = formRecordRepo.save(formRecord);
        return APIResponse.<FormRecord>builder()
                .code("200")
                .result(savedRecord)
                .build();
    }
}
