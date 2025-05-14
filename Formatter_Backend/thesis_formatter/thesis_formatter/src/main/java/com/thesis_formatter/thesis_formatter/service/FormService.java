package com.thesis_formatter.thesis_formatter.service;

import com.thesis_formatter.thesis_formatter.entity.Form;
import com.thesis_formatter.thesis_formatter.entity.Student;
import com.thesis_formatter.thesis_formatter.entity.Teacher;
import com.thesis_formatter.thesis_formatter.repo.FormRepo;
import com.thesis_formatter.thesis_formatter.repo.StudentRepo;
import com.thesis_formatter.thesis_formatter.repo.TeacherRepo;
import com.thesis_formatter.thesis_formatter.response.APIResponse;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class FormService {
    FormRepo formRepo;
    StudentRepo studentRepo;
    TeacherRepo teacherRepo;

    public APIResponse<Form> saveForm(Form form) {
        Student student = studentRepo.findByStId(form.getStudent().getStId());

        List <Teacher> teachers = new ArrayList<>();
        for (Teacher teacher : form.getTeachers()){
            Teacher existingTeacher = teacherRepo.findByTcId(teacher.getTcId());
            if (existingTeacher != null){
                teachers.add(existingTeacher);
            }
        }
        form.setStudent(student);
        form.setTeachers(teachers);
        formRepo.save(form);
        return APIResponse.<Form>builder()
                .code("200")
                .result(form)
                .build();
    }

    public APIResponse<List<Form>> getAllForms() {
        List <Form>  forms = formRepo.findAll();
        return APIResponse.<List<Form>>builder()
                .code("200")
                .result(forms)
                .build();
    }

    public APIResponse<List<Form>> getFormByTeacherId(String id) {
        List <Form>  forms = formRepo.findByTeachers_TcId(id);
        return APIResponse.<List<Form>>builder()
                .code("200")
                .result(forms)
                .build();
    }

    public APIResponse<List<Form>> getFormByStudentId(String id) {
        List <Form>  forms = formRepo.findByStudent_StId(id);
        return APIResponse.<List<Form>>builder()
                .code("200")
                .result(forms)
                .build();
    }

}
