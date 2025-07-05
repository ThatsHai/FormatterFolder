package com.thesis_formatter.thesis_formatter.controller;

import com.thesis_formatter.thesis_formatter.dto.request.AddFormRecordRequest;
import com.thesis_formatter.thesis_formatter.dto.request.UpdateFormRecordRequest;
import com.thesis_formatter.thesis_formatter.dto.response.APIResponse;
import com.thesis_formatter.thesis_formatter.dto.response.FormRecordResponse;
import com.thesis_formatter.thesis_formatter.dto.response.PaginationResponse;
import com.thesis_formatter.thesis_formatter.entity.FormRecord;
import com.thesis_formatter.thesis_formatter.service.FormRecordService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class FormRecordController {
    FormRecordService formRecordService;

    @GetMapping("/formRecords/getAll")
    public APIResponse<List<FormRecordResponse>> getAll() {
        return formRecordService.getAll();
    }

    @PostMapping("/formRecords/create")
    public APIResponse<FormRecordResponse> createFormRecord(@RequestBody AddFormRecordRequest request) {
        return formRecordService.createFormRecord(request);
    }

    @PutMapping("/formRecords/update")
    public APIResponse<FormRecordResponse> update(@RequestBody UpdateFormRecordRequest request) {
        return formRecordService.updateFormRecord(request);
    }

    @PutMapping("/formRecords/status")
    public APIResponse<FormRecordResponse> updateStatus(@RequestParam String formRecordId, @RequestParam String status) {
        return formRecordService.updateStatus(formRecordId, status);
    }

    @GetMapping("/formRecords/student")
    public APIResponse<PaginationResponse<FormRecordResponse>> searchFormRecord(@RequestParam String studentId, @RequestParam("p") String page, @RequestParam("n") String numberOfRecords) {
        return formRecordService.searchByStudentId(studentId, page, numberOfRecords);
    }

    @GetMapping("/formRecords/{id}")
    public APIResponse<FormRecordResponse> getFormRecord(@PathVariable String id) {
        return formRecordService.getFormRecordById(id);
    }

    @GetMapping("/formRecords/{formRecordId}/downloadPdf/{designId}")
    public ResponseEntity<Resource> downloadFormRecordPdf(@PathVariable String formRecordId, @PathVariable String designId) throws IOException {
        return formRecordService.downloadFormRecordPdf(formRecordId, designId);
    }
}

