package com.thesis_formatter.thesis_formatter.controller;

import com.thesis_formatter.thesis_formatter.dto.response.APIResponse;
import com.thesis_formatter.thesis_formatter.dto.response.PaginationResponse;
import com.thesis_formatter.thesis_formatter.entity.Design;
import com.thesis_formatter.thesis_formatter.service.DesignService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.awt.print.Pageable;
import java.io.IOException;
import java.net.http.HttpResponse;
import java.util.List;

@RestController
@RequestMapping
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@CrossOrigin
public class DesignController {
    DesignService designService;

    @GetMapping("/designs")
    public APIResponse<List<Design>> getDesigns() {
        return designService.getDesigns();
    }

    @PostMapping("/designs")
    public APIResponse<Design> addDesign(@RequestBody Design design) {
        return designService.addDesign(design);
    }

    @GetMapping("/designs/{designId}/downloadPdf")
    public ResponseEntity<Resource> downloadDesign(@PathVariable String designId) throws IOException {
        return designService.downloadDesign(designId);
    }

    @GetMapping("/designs/search")
    public APIResponse<PaginationResponse<Design>> getDesignByFormId(@RequestParam("formId") String formId, @RequestParam("p") String page, @RequestParam("n") String numberOfRecords) {
        return designService.getDesignsByFormId(formId, page, numberOfRecords);
    }
}
