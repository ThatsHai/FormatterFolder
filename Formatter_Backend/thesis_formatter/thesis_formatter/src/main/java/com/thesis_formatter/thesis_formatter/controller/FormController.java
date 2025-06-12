package com.thesis_formatter.thesis_formatter.controller;

import com.thesis_formatter.thesis_formatter.dto.response.APIResponse;
import com.thesis_formatter.thesis_formatter.entity.Form;
import com.thesis_formatter.thesis_formatter.entity.FormRecord;
import com.thesis_formatter.thesis_formatter.service.FormService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.core.context.SecurityContextHolder;
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

    @GetMapping("/forms")
    public APIResponse<?> getAllForm() {
        return formService.getAllForms();
    }

//    @GetMapping("/form/teacher/{teacherId}")
//    public APIResponse<?> getFormByTeacherId(@PathVariable String teacherId) {
//        return formService.getFormByTeacherId(teacherId);
//    }

//    @GetMapping("/form/student/{studentId}")
//    public APIResponse<?> getFormByStudentId(@PathVariable String studentId) {
//        return formService.getFormByStudentId(studentId);
//    }


    @PostMapping("/forms/download")
    public APIResponse<Form> downloadForm(@RequestBody Form form) {
        return formService.downloadForm(form);
    }

    @PostMapping("/forms/create")
    public APIResponse<Form> createForm(@RequestBody Form form) {
        return formService.createForm(form);
    }

    @PostMapping("/forms/submit")
    public APIResponse<FormRecord> submitForm(@RequestBody FormRecord formRecord) {
        return formService.submitForm(formRecord);
    }

    @GetMapping("/forms/{formId}")
    public APIResponse<Form> getFormByFormId(@PathVariable("formId") String formId) {
        return formService.getFormById(formId);
    }

    @GetMapping("/forms/students")
    public APIResponse<Form> getStudentForm() {
        return formService.getFormForReader("STUDENT");
    }

    @GetMapping("/forms/teachers")
    public APIResponse<Form> getTeacherForm() {
        return formService.getFormForReader("TEACHER");
    }
}
