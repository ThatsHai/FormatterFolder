package com.thesis_formatter.thesis_formatter.controller;

import com.thesis_formatter.thesis_formatter.dto.request.AddDefenseScheduleRequest;
import com.thesis_formatter.thesis_formatter.dto.request.SchedulePDFRequest;
import com.thesis_formatter.thesis_formatter.dto.response.APIResponse;
import com.thesis_formatter.thesis_formatter.dto.response.DefenseScheduleResponse;
import com.thesis_formatter.thesis_formatter.entity.DefenseSchedule;
import com.thesis_formatter.thesis_formatter.service.DefenseScheduleService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/defenseSchedules")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@CrossOrigin
public class DefenseScheduleController {
    DefenseScheduleService defenseScheduleService;

    @PostMapping
    public APIResponse<List<DefenseScheduleResponse>> create(@RequestBody List<AddDefenseScheduleRequest> requests) {
        return defenseScheduleService.addDefenseSchedule(requests);
    }

    @GetMapping
    public APIResponse<List<DefenseScheduleResponse>> getAll() {
        return defenseScheduleService.getAll();
    }

    @PostMapping("/getPDF")
    public ResponseEntity<Resource> getSchedulePDF(@RequestBody List<SchedulePDFRequest> schedulePDFRequests) throws Exception {
        return defenseScheduleService.getPDF(schedulePDFRequests);
    }

}
