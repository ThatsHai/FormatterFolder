package com.thesis_formatter.thesis_formatter.controller;

import com.thesis_formatter.thesis_formatter.entity.Form;
import com.thesis_formatter.thesis_formatter.repo.FormRepo;
import com.thesis_formatter.thesis_formatter.response.APIResponse;
import com.thesis_formatter.thesis_formatter.service.FormService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class FormController {
    FormService formService;

    @PostMapping("/forms/submitForm")
    public ResponseEntity<?> submitForm(@RequestBody Form form) {
        System.out.println(form.toString());
        formService.saveForm(form);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/form/download")
    public APIResponse<?> downloadForm(@RequestBody Form form) {
        System.out.println(form.toString());
        return APIResponse.<String>builder()
                .code("200")
                .result(form.toString())
                .build();
    }

}
