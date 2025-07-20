package com.thesis_formatter.thesis_formatter.controller;

import com.thesis_formatter.thesis_formatter.dto.request.AddFormRecordRequest;
import com.thesis_formatter.thesis_formatter.dto.request.UpdateFormRecordRequest;
import com.thesis_formatter.thesis_formatter.dto.response.*;
import com.thesis_formatter.thesis_formatter.entity.FormRecord;
import com.thesis_formatter.thesis_formatter.service.FormRecordService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.security.Principal;
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
        return formRecordService.create(request);
    }

    @PutMapping("/formRecords/update")
    public APIResponse<FormRecordResponse> update(@RequestBody UpdateFormRecordRequest request) {
        return formRecordService.updateFormRecord(request);
    }

    @PostMapping("/formRecords/{formRecordId}/restore/{fromVersion}")
    public APIResponse<FormRecordResponse> restoreFormRecordFromVersion(
            @PathVariable String formRecordId,
            @PathVariable String fromVersion) {
        return formRecordService.restoreFormRecord(formRecordId, fromVersion);
    }

    @PutMapping("/formRecords/status")
    public APIResponse<FormRecordResponse> updateStatus(@RequestParam String formRecordId, @RequestParam String status) {
        return formRecordService.updateStatus(formRecordId, status);
    }

    @PutMapping("/formRecords/{formRecordId}/send")
    public APIResponse<FormRecordResponse> sendRecord(@PathVariable String formRecordId) {
        return formRecordService.updateStatus(formRecordId, "WAITING");
    }

    @GetMapping("/formRecords/student")
    public APIResponse<PaginationResponse<FormRecordResponse>> searchFormRecordForStudent(@RequestParam String studentId, @RequestParam("p") String page, @RequestParam("n") String numberOfRecords) {
        return formRecordService.searchByStudentId(studentId, page, numberOfRecords);
    }

    @GetMapping("/formRecords/teacher")
    public APIResponse<PaginationResponse<FormRecordResponse>> searchFormRecordForTeacher(@RequestParam String teacherId, @RequestParam String status, @RequestParam("p") String page, @RequestParam("n") String numberOfRecords) {
        return formRecordService.searchByTeacherId(teacherId, status, page, numberOfRecords);
    }

    @GetMapping("/formRecords/{id}")
    public APIResponse<FormRecordResponse> getFormRecord(@PathVariable String id, @RequestParam(required = false) String version) {
        return formRecordService.getFormRecordById(id, version);
    }

    @GetMapping("/formRecords/{formRecordId}/diff/{version}")
    public APIResponse<List<FormRecordFieldDiff>> getChangedFields(
            @PathVariable String formRecordId,
            @PathVariable String version) {
        return formRecordService.getChangedFieldsFromVersion(formRecordId, version);
    }


    @GetMapping("formRecords/{id}/versions")
    public APIResponse<List<FormRecordVersionInfo>> getAllVersions(@PathVariable String id) {
        return formRecordService.getAllVersions(id);
    }

    @GetMapping("/formRecords/{formRecordId}/downloadPdf/{designId}")
    public ResponseEntity<Resource> downloadFormRecordPdf(@PathVariable String formRecordId, @PathVariable String designId, @RequestParam(required = false) String version) throws IOException {
        return formRecordService.downloadFormRecordPdf(formRecordId, designId, version);
    }

    @DeleteMapping("/formRecords/delete/{id}")
    public APIResponse<FormRecord> deleteFormRecord(@PathVariable String id) {
        return formRecordService.deleteFormRecord(id);
    }
}

