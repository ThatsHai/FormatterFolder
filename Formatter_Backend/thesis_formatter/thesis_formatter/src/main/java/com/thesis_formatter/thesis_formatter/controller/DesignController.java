package com.thesis_formatter.thesis_formatter.controller;

import com.thesis_formatter.thesis_formatter.dto.response.APIResponse;
import com.thesis_formatter.thesis_formatter.entity.Design;
import com.thesis_formatter.thesis_formatter.service.DesignService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

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

    @GetMapping("/designs/{designId}/download")
    public APIResponse<Design> downloadDesign(@PathVariable String designId) {
        return designService.downloadDesign(designId);
    }

}
