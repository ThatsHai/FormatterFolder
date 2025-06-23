package com.thesis_formatter.thesis_formatter.service;

import com.thesis_formatter.thesis_formatter.entity.*;
import com.thesis_formatter.thesis_formatter.repo.*;
import com.thesis_formatter.thesis_formatter.dto.response.APIResponse;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import javax.swing.text.html.Option;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class FormService {
    FormRepo formRepo;
    FormRecordRepo formRecordRepo;
    StudentRepo studentRepo;
    TeacherRepo teacherRepo;
    RoleRepo roleRepo;

    public APIResponse<Form> saveForm(Form form) {
//        Student student = studentRepo.findByStId(form.getStudent().getStId());
//
//        List<Teacher> teachers = new ArrayList<>();
//        for (Teacher teacher : form.getTeachers()) {
//            Teacher existingTeacher = teacherRepo.findByTcId(teacher.getTcId());
//            if (existingTeacher != null) {
//                teachers.add(existingTeacher);
//            }
//        }
//        form.setStudent(student);
//        form.setTeachers(teachers);
        formRepo.save(form);
        return APIResponse.<Form>builder()
                .code("200")
                .result(form)
                .build();
    }

    public APIResponse<List<Form>> getAllForms() {
        List<Form> forms = formRepo.findAll();
        return APIResponse.<List<Form>>builder()
                .code("200")
                .result(forms)
                .build();
    }

//    public APIResponse<List<Form>> getFormByTeacherId(String id) {
//        List<Form> forms = formRepo.findByTeachers_UserId(id);
//        return APIResponse.<List<Form>>builder()
//                .code("200")
//                .result(forms)
//                .build();
//    }

//    public APIResponse<List<Form>> getFormByStudentId(String id) {
//        List<Form> forms = formRepo.findByStudent_StId(id);
//        return APIResponse.<List<Form>>builder()
//                .code("200")
//                .result(forms)
//                .build();
//    }

    public APIResponse<Form> downloadForm(Form form) {
        return APIResponse.<Form>builder()
                .code("200")
                .result(form)
                .build();
    }

    public APIResponse<Form> createForm(Form form) {

        // Set the back-reference on each FormField
        if (form.getFormFields() != null) {
            for (FormField field : form.getFormFields()) {
                field.setForm(form);
            }
        }
        Form savedForm = formRepo.save(form);
        return APIResponse.<Form>builder()
                .code("200")
                .result(savedForm)
                .build();
    }

//    public APIResponse<FormRecord> submitForm(FormRecord formRecord) {
//        // Fetch and set the managed Student entity
//        if (formRecord.getStudent() != null && formRecord.getStudent().getAcId() != null) {
//            Student student = studentRepo.findById(formRecord.getStudent().getAcId())
//                    .orElseThrow(() -> new RuntimeException("Student not found"));
//            formRecord.setStudent(student);
//        }
//
//        // Fetch and set the managed Form entity
//        if (formRecord.getForm() != null && formRecord.getForm().getFormId() != null) {
//            Form form = formRepo.findById(formRecord.getForm().getFormId())
//                    .orElseThrow(() -> new RuntimeException("Form not found"));
//            formRecord.setForm(form);
//        }
//
//        // Set formRecord on each formRecordField (to ensure bidirectional consistency)
//        if (formRecord.getFormRecordFields() != null) {
//            formRecord.getFormRecordFields().forEach(field -> field.setFormRecord(formRecord));
//        }
//
//        // Save the complete formRecord
//        FormRecord savedRecord = formRecordRepo.save(formRecord);
//
//        return APIResponse.<FormRecord>builder()
//                .code("200")
//                .result(savedRecord)
//                .build();
//    }

    public APIResponse<Form> getFormById(String formId) {
        Form form = formRepo.findById(formId).orElseThrow(() -> new RuntimeException("Form not found"));
        return APIResponse.<Form>builder()
                .code("200")
                .result(form)
                .build();
    }

    public APIResponse<Form> getFormForReader(String reader) {
        Form form = formRepo.findByReadersListContainingIgnoreCase("TEACHER").orElseThrow(() -> new RuntimeException("Teacher not found"));

        return APIResponse.<Form>builder()
                .code("200")
                .result(form)
                .build();
    }
}
