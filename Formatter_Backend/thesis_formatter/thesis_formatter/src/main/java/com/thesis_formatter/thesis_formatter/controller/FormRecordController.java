package com.thesis_formatter.thesis_formatter.controller;

import com.thesis_formatter.thesis_formatter.dto.request.AddFormRecordRequest;
import com.thesis_formatter.thesis_formatter.dto.response.APIResponse;
import com.thesis_formatter.thesis_formatter.entity.FormRecord;
import com.thesis_formatter.thesis_formatter.service.FormRecordService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class FormRecordController {
    FormRecordService formRecordService;

    @PostMapping("/formRecords/create")
    public APIResponse<FormRecord> createFormRecord(@RequestBody AddFormRecordRequest request) {
        return formRecordService.createFormRecord(request);
    }

    @GetMapping("/formRecords/student")
    public APIResponse<List<FormRecord>> getFormRecordsByStudentId(@RequestParam String acId) {
        return formRecordService.findFormRecordsByStudentId(acId);
    }
}

