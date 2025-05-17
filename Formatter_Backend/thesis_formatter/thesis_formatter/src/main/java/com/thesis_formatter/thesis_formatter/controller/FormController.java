package com.thesis_formatter.thesis_formatter.controller;

import com.thesis_formatter.thesis_formatter.entity.Form;
import com.thesis_formatter.thesis_formatter.entity.Teacher;
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
@CrossOrigin
public class FormController {
    FormService formService;

    @PostMapping("/form/submit")
    public APIResponse<Form> submitForm(@RequestBody Form form) {
        return formService.saveForm(form);
    }

    @GetMapping("/form")
    public APIResponse<?> getAllForm() {
        return formService.getAllForms();
    }

    @GetMapping("/form/teacher/{teacherId}")
    public APIResponse<?> getFormByTeacherId(@PathVariable String teacherId) {
        return formService.getFormByTeacherId(teacherId);
    }

    @GetMapping("/form/student/{studentId}")
    public APIResponse<?> getFormByStudentId(@PathVariable String studentId) {
        return formService.getFormByStudentId(studentId);
    }


    @PostMapping("/form/download")
    public APIResponse<Form> downloadForm(@RequestBody Form form) {
        return formService.downloadForm(form);
    }
}
