package com.thesis_formatter.thesis_formatter.service;

import com.thesis_formatter.thesis_formatter.dto.request.TopicRequest;
import com.thesis_formatter.thesis_formatter.dto.response.APIResponse;
import com.thesis_formatter.thesis_formatter.dto.response.TopicResponse;
import com.thesis_formatter.thesis_formatter.entity.Form;
import com.thesis_formatter.thesis_formatter.entity.Major;
import com.thesis_formatter.thesis_formatter.entity.Teacher;
import com.thesis_formatter.thesis_formatter.entity.Topic;
import com.thesis_formatter.thesis_formatter.enums.ErrorCode;
import com.thesis_formatter.thesis_formatter.exception.AppException;
import com.thesis_formatter.thesis_formatter.mapper.TopicMapper;
import com.thesis_formatter.thesis_formatter.repo.FormRepo;
import com.thesis_formatter.thesis_formatter.repo.MajorRepo;
import com.thesis_formatter.thesis_formatter.repo.TeacherRepo;
import com.thesis_formatter.thesis_formatter.repo.TopicRepo;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class TopicService {
    TopicRepo topicRepo;
    TeacherRepo teacherRepo;
    private final MajorRepo majorRepo;
    private final TopicMapper topicMapper;
    private final FormRepo formRepo;

    public APIResponse<List<Topic>> getAll() {
        List<Topic> topics = topicRepo.findAll();
        return APIResponse.<List<Topic>>builder()
                .code("200")
                .result(topics)
                .build();
    }

    //    public APIResponse<Topic> create(Topic topic) {
//        if (topic.getTeacher() == null || topic.getTeacher().getAcId() == null) {
//            throw new IllegalArgumentException("Teacher ID must be provided");
//        }
//
//
//        Teacher teacher = teacherRepo.findById(topic.getTeacher().getAcId())
//                .orElseThrow(() -> new RuntimeException("Teacher not found"));
//
//        topic.setTeacher(teacher);
//        Topic savedTopic = topicRepo.save(topic);
//        return APIResponse.<Topic>builder()
//                .code("200")
//                .result(savedTopic)
//                .build();
//    }
    public APIResponse<TopicResponse> create(TopicRequest topicRequest) {
        List<String> teacherIds = topicRequest.getTeacherIds();
        if (teacherIds.isEmpty()) {
            throw new AppException(ErrorCode.TEACHER_NOT_EXISTED);
        }
        List<Teacher> teachers = new ArrayList<>();
        List<String> teacherNames = new ArrayList<>();
        for (String teacherId : teacherIds) {
            Teacher teacher = teacherRepo.findByUserId(teacherId);
            System.out.println(teacherId);
            teachers.add(teacher);
            teacherNames.add(teacher.getName());
            System.out.println(teacherId);
        }

        List<String> majorIds = topicRequest.getMajorIds();
        if (majorIds.isEmpty()) {
            throw new AppException(ErrorCode.MAJOR_NOT_EXISTED);
        }
        List<Major> majors = new ArrayList<>();
        List<String> majorNames = new ArrayList<>();
        for (String majorId : majorIds) {
            Major major = majorRepo.findByMajorId(majorId);
            majors.add(major);
            majorNames.add(major.getMajorName());
        }

        Form form = formRepo.findByFormId(topicRequest.getFormId());
        if (form == null) {
            throw new AppException(ErrorCode.FORM_NOT_FOUND);
        }

        Topic topic = topicMapper.toTopic(topicRequest);
        topic.setTeachers(teachers);
        topic.setMajors(majors);
        topic.setForm(form);
        topicRepo.save(topic);

        TopicResponse topicResponse = topicMapper.toTopicResponse(topic);
        topicResponse.setTeacherNames(teacherNames);
        topicResponse.setMajorNames(majorNames);
        topicResponse.setFormName(form.getTitle());
        return APIResponse.<TopicResponse>builder()
                .code("200")
                .result(topicResponse)
                .build();
    }

    public APIResponse<List<Topic>> getTopicByFormId(String formId) {
        List<Topic> topics = topicRepo.findTopicsByForm_FormId(formId);

        return APIResponse.<List<Topic>>builder()
                .code("200")
                .result(topics).build();
    }

    public APIResponse<List<Topic>> getTopicByTeacher_AcId(String acId) {
        List<Topic> topics = topicRepo.findTopicsByTeachers_AcId(acId);

        return APIResponse.<List<Topic>>builder()
                .code("200")
                .result(topics).build();
    }

}
