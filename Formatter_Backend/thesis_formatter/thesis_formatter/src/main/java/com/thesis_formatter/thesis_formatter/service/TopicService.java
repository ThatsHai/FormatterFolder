package com.thesis_formatter.thesis_formatter.service;

import com.thesis_formatter.thesis_formatter.dto.request.AddFormRecordFieldRequest;
import com.thesis_formatter.thesis_formatter.dto.request.AddFormRecordRequest;
import com.thesis_formatter.thesis_formatter.dto.request.TopicRequest;
import com.thesis_formatter.thesis_formatter.dto.request.UpdateTopicRequest;
import com.thesis_formatter.thesis_formatter.dto.response.*;
import com.thesis_formatter.thesis_formatter.entity.*;
import com.thesis_formatter.thesis_formatter.entity.id.TeacherTopicLimitId;
import com.thesis_formatter.thesis_formatter.enums.ErrorCode;
import com.thesis_formatter.thesis_formatter.enums.FormStatus;
import com.thesis_formatter.thesis_formatter.enums.Semester;
import com.thesis_formatter.thesis_formatter.exception.AppException;
import com.thesis_formatter.thesis_formatter.mapper.TeacherMapper;
import com.thesis_formatter.thesis_formatter.mapper.TopicMapper;
import com.thesis_formatter.thesis_formatter.repo.*;
import jakarta.persistence.criteria.From;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.crossstore.ChangeSetPersister;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class TopicService {
    TopicRepo topicRepo;
    TeacherRepo teacherRepo;
    MajorRepo majorRepo;
    TopicMapper topicMapper;
    FormRepo formRepo;
    TeacherMapper teacherMapper;
    TeacherTopicLimitRepo teacherTopicLimitRepo;
    StudentRepo studentRepo;
    FormRecordService formRecordService;
    FormRecordRepo formRecordRepo;

    public APIResponse<List<TopicResponse>> getAll() {
        List<Topic> topics = topicRepo.findAll();
        List<TopicResponse> topicResponses = topicMapper.toTopicResponses(topics);
        return APIResponse.<List<TopicResponse>>builder()
                .code("200")
                .result(topicResponses)
                .build();
    }

    public APIResponse<TopicResponse> create(TopicRequest topicRequest) {
        List<String> teacherIds = topicRequest.getTeacherIds();
        if (teacherIds.isEmpty()) {
            throw new AppException(ErrorCode.TEACHER_NOT_EXISTED);
        }
        List<Teacher> teachers = teacherRepo.findByUserIdIn(teacherIds);

        List<String> majorIds = topicRequest.getMajorIds();
        if (majorIds.isEmpty()) {
            throw new AppException(ErrorCode.MAJOR_NOT_EXISTED);
        }
        List<Major> majors = majorRepo.findByMajorIdIn(majorIds);

        Form form = formRepo.findByFormId(topicRequest.getFormId());
        if (form == null) {
            throw new AppException(ErrorCode.FORM_NOT_FOUND);
        }

        Topic topic = topicMapper.toTopic(topicRequest);
        topic.setTeachers(teachers);
        topic.setMajors(majors);
        topic.setForm(form);
        topic.setSemester(topicRequest.getSemester());
        topic.setYear(topicRequest.getYear());

        List<String> studentIds = topicRequest.getStudentIds();
        if (studentIds != null && !studentIds.isEmpty()) {
            List<Student> students = studentRepo.findByUserIdIn(studentIds);
            topic.setStudents(students);
        }

        Topic savedTopic = topicRepo.save(topic);
        if (studentIds != null && !studentIds.isEmpty()) {
            createFormRecordsForNewStudents(savedTopic, studentIds);
        }

        TopicResponse topicResponse = topicMapper.toTopicResponse(savedTopic);
        return APIResponse.<TopicResponse>builder()
                .code("200")
                .result(topicResponse)
                .build();
    }


    @Transactional
    public APIResponse<TopicResponse> update(UpdateTopicRequest request) {
        Topic topic = topicRepo.findById(request.getTopicId())
                .orElseThrow(() -> new AppException(ErrorCode.TOPIC_NOT_FOUND));


        topic.setTitle(request.getTitle());
        topic.setDescription(request.getDescription());
        topic.setResearchContent(request.getResearchContent());
        topic.setObjective(request.getObjective());
        topic.setObjectiveDetails(request.getObjectiveDetails());
        topic.setFunding(request.getFunding());
        topic.setContactInfo(request.getContactInfo());
        topic.setTime(request.getTime());
        topic.setImplementationTime(request.getImplementationTime());
        topic.setSemester(request.getSemester());
        topic.setYear(request.getYear());
        topic.setUpdatedAt(LocalDateTime.now());

        // Cập nhật giảng viên nếu khác
        updateTeachersInTopic(topic, request.getTeacherIds());

        // Cập nhật sinh viên và FormRecord tương ứng
        updateStudentsAndFormRecords(topic, request.getStudentIds());

        // Cập nhật ngành nếu khác
        updateMajorsInTopic(topic, request.getMajorIds());

        Topic savedTopic = topicRepo.save(topic);
        return APIResponse.<TopicResponse>builder()
                .code("200")
                .result(topicMapper.toTopicResponse(savedTopic))
                .build();
    }

    private void updateMajorsInTopic(Topic topic, List<String> newMajorIds) {
        Set<String> oldIds = topic.getMajors().stream()
                .map(Major::getMajorId)
                .collect(Collectors.toSet());

        Set<String> newIds = new HashSet<>(newMajorIds);

        if (!oldIds.equals(newIds)) {
            List<Major> newMajors = majorRepo.findAllById(newMajorIds);
            topic.setMajors(newMajors);
        }
    }

    private void updateTeachersInTopic(Topic topic, List<String> newTeacherIds) {
        Set<String> oldIds = topic.getTeachers().stream()
                .map(Teacher::getUserId)
                .collect(Collectors.toSet());

        Set<String> newIds = new HashSet<>(newTeacherIds);

        if (!oldIds.equals(newIds)) {
            List<Teacher> newTeachers = teacherRepo.findByUserIdIn(newTeacherIds);
            topic.setTeachers(newTeachers);
        }
    }


    private void updateStudentsAndFormRecords(Topic topic, List<String> newStudentIds) {

        Set<String> oldIds = topic.getStudents().stream()
                .map(student -> student.getUserId())
                .collect(Collectors.toSet());

        Set<String> newIds = new HashSet<>(newStudentIds);
        Set<String> toAdd = new HashSet<>(newIds);
        toAdd.removeAll(oldIds);

        Set<String> toRemove = new HashSet<>(oldIds);
        toRemove.removeAll(newIds);

        System.out.println("Them sinh vien: " + toAdd);
        System.out.println("Xoa sinh vien: " + toRemove);

        List<Student> updatedStudents = newStudentIds.stream()
                .map(studentRepo::findByUserId)
                .collect(Collectors.toList());
        topic.setStudents(updatedStudents);

        // Tạo FormRecord cho sinh viên mới
        createFormRecordsForNewStudents(topic, new ArrayList<>(toAdd));

        // Xoá FormRecord của sinh viên bị loại
        deleteFormRecordsByStudentsAndTopic(topic, new ArrayList<>(toRemove));
    }

    public void deleteFormRecordsByStudentsAndTopic(Topic topic, List<String> studentIds) {

        for (String studentId : studentIds) {
            Student student = studentRepo.findByUserId(studentId);
            if (student == null) continue;

            List<FormRecord> formRecords = formRecordRepo.findByStudentAndTopic(student, topic);
            for (FormRecord formRecord : formRecords) {
                formRecord.setStatus(FormStatus.DELETED);
            }
            formRecordRepo.saveAll(formRecords);
        }
    }


    public void createFormRecordsForNewStudents(Topic topic, List<String> studentIds) {
        Form form = topic.getForm();
        if (form == null) return;

        List<AddFormRecordFieldRequest> fieldRequests = form.getFormFields().stream()
                .map(field -> AddFormRecordFieldRequest.builder()
                        .formFieldId(field.getFormFieldId())
                        .build())
                .collect(Collectors.toList());

        for (String studentId : studentIds) {
            Optional<FormRecord> deletedRecordOpt = formRecordRepo
                    .findDeletedByStudentAndTopic(studentId, topic.getTopicId());

            if (deletedRecordOpt.isPresent()) {
                FormRecord deletedRecord = deletedRecordOpt.get();
                deletedRecord.setStatus(FormStatus.PENDING);
                formRecordRepo.save(deletedRecord);
            } else {
                formRecordService.createFormRecord(AddFormRecordRequest.builder()
                        .studentId(studentId)
                        .topicId(topic.getTopicId())
                        .formRecordFields(fieldRequests)
                        .build());
            }
        }
    }


    public APIResponse<TopicResponse> getByTopicId(String topicId) {
        Topic topic = topicRepo.findById(topicId).orElseThrow(() -> new AppException(ErrorCode.TOPIC_NOT_FOUND));
        TopicResponse topicResponse = topicMapper.toTopicResponse(topic);
        return APIResponse.<TopicResponse>builder()
                .code("200")
                .result(topicResponse)
                .build();
    }


    public APIResponse<List<TopicResponse>> getTopicByFormId(String formId) {
        List<Topic> topics = topicRepo.findTopicsByForm_FormId(formId);
        List<TopicResponse> topicResponses = topicMapper.toTopicResponses(topics);
        return APIResponse.<List<TopicResponse>>builder()
                .code("200")
                .result(topicResponses).build();
    }

    public APIResponse<List<Topic>> getTopicByTeacher_AcId(String acId) {
        List<Topic> topics = topicRepo.findTopicsByTeachers_AcId(acId);

        return APIResponse.<List<Topic>>builder()
                .code("200")
                .result(topics).build();
    }

    //    public APIResponse<PaginationResponse<TeacherTopicsResponse>> getTopicByTeachersGroups() {
//        List<Object[]> results = topicRepo.findTopicsGroupedByUserIdAndName();
//
//        // Group topics by userId and name
//        Map<String, TeacherTopicsResponse> groupedMap = new HashMap<>();
//
//        for (Object[] result : results) {
//            String userId = (String) result[0];
//            String name = (String) result[1];
//            Topic topic = (Topic) result[2];
//
//            // If the teacher is not in the map, create a new DTO
//            groupedMap.computeIfAbsent(userId, k -> new TeacherTopicsResponse(userId, name, new ArrayList<>())).getTopics().add(topic);
//        }
//
//        List<TeacherTopicsResponse> groupedList = new ArrayList<>(groupedMap.values());
//
//        // Manual pagination
//        int page = 0;
//        int size = 4;
//        int start = page * size;
//        int end = Math.min(start + size, groupedList.size());
//        List<TeacherTopicsResponse> paginatedContent = groupedList.subList(start, end);
//
//        PaginationResponse<TeacherTopicsResponse> paginationResponse = new PaginationResponse<>();
//        paginationResponse.setTotalPages((int) Math.ceil((double) groupedList.size() / size));
//        paginationResponse.setTotalElements(groupedList.size());
//        paginationResponse.setContent(paginatedContent);
//        paginationResponse.setCurrentPage(page);
//
//        return APIResponse.<PaginationResponse<TeacherTopicsResponse>>builder()
//                .code("200")
//                .result(paginationResponse)
//                .build();
//    }
    private <T> PaginationResponse<T> paginate(List<T> content, String page, String numberOfRecords) {
        int pageInt = Integer.parseInt(page);
        int size = Integer.parseInt(numberOfRecords);

        int start = pageInt * size;
        int end = Math.min(start + size, content.size());

        List<T> paginatedContent = content.subList(start, end);

        PaginationResponse<T> paginationResponse = new PaginationResponse<>();
        paginationResponse.setTotalPages((int) Math.ceil((double) content.size() / size));
        paginationResponse.setTotalElements(content.size());
        paginationResponse.setContent(paginatedContent);
        paginationResponse.setCurrentPage(pageInt);

        return paginationResponse;
    }

    private <T> APIResponse<PaginationResponse<T>> buildSuccessResponse(PaginationResponse<T> paginationResponse) {
        return APIResponse.<PaginationResponse<T>>builder()
                .code("200")
                .result(paginationResponse)
                .build();
    }

    public APIResponse<PaginationResponse<TeacherTopicsResponse>> getTopicsGroupByTeacher(String semester, String year, String teacherQueryName, String page, String numberOfRecords) {
        Semester semesterObj = Semester.valueOf(semester);
        List<Object[]> results = topicRepo.findTopicsGroupedByUserIdAndName(semesterObj, year, teacherQueryName);

        Map<String, TeacherTopicsResponse> groupedMap = new LinkedHashMap<>();

        for (Object[] result : results) {
            String userId = (String) result[0];
            String name = (String) result[1];
            Topic topic = (Topic) result[2];

            TopicResponse topicResponse = topicMapper.toTopicResponse(topic);

            groupedMap.computeIfAbsent(userId, k -> new TeacherTopicsResponse(userId, name, new ArrayList<>()))
                    .getTopicResponses().add(topicResponse);
        }

        List<TeacherTopicsResponse> groupedList = new ArrayList<>(groupedMap.values());
        PaginationResponse<TeacherTopicsResponse> paginationResponse = paginate(groupedList, page, numberOfRecords);

        return buildSuccessResponse(paginationResponse);
    }

    public APIResponse<PaginationResponse<TeacherTopicsResponse>> getTopicsGroupByTeacher(String year, String teacherQueryName, String page, String numberOfRecords) {
        List<Object[]> results = topicRepo.findTopicsGroupedByUserIdAndName(year, teacherQueryName);

        Map<String, TeacherTopicsResponse> groupedMap = new LinkedHashMap<>();

        for (Object[] result : results) {
            String userId = (String) result[0];
            String name = (String) result[1];
            Topic topic = (Topic) result[2];

            TopicResponse topicResponse = topicMapper.toTopicResponse(topic);

            groupedMap.computeIfAbsent(userId, k -> new TeacherTopicsResponse(userId, name, new ArrayList<>()))
                    .getTopicResponses().add(topicResponse);
        }

        List<TeacherTopicsResponse> groupedList = new ArrayList<>(groupedMap.values());
        PaginationResponse<TeacherTopicsResponse> paginationResponse = paginate(groupedList, page, numberOfRecords);

        return buildSuccessResponse(paginationResponse);
    }

    public APIResponse<PaginationResponse<TeacherTopicWithLimitResponse>> getTopicsGroupByTeacherWithLimit(
            String semester, String year, String teacherQueryName, String page, String numberOfRecords) {

        Semester semesterObj = Semester.valueOf(semester);
        List<Object[]> results = topicRepo.findTopicsGroupedByUserIdAndName(semesterObj, year, teacherQueryName);

        Map<String, TeacherTopicWithLimitResponse> groupedMap = new LinkedHashMap<>();

        for (Object[] result : results) {
            String userId = (String) result[0];
            String name = (String) result[1];
            Topic topic = (Topic) result[2];

            TopicResponse topicResponse = topicMapper.toTopicResponse(topic);

            TeacherTopicLimitId teacherTopicLimitId = new TeacherTopicLimitId(userId, semesterObj, year);
            Optional<TeacherTopicLimit> topicLimitOpt = teacherTopicLimitRepo.findById(teacherTopicLimitId);

            int maxTopics = topicLimitOpt.map(TeacherTopicLimit::getMaxTopics).orElse(0);

            groupedMap.computeIfAbsent(userId, k -> {
                TeacherTopicWithLimitResponse response = new TeacherTopicWithLimitResponse();
                response.setUserId(userId);
                response.setName(name);
                response.setMaxTopics(maxTopics);
                response.setTopicResponses(new ArrayList<>());
                return response;
            }).getTopicResponses().add(topicResponse);
        }

        List<TeacherTopicWithLimitResponse> groupedList = new ArrayList<>(groupedMap.values());
        PaginationResponse<TeacherTopicWithLimitResponse> paginationResponse = paginate(groupedList, page, numberOfRecords);

        return buildSuccessResponse(paginationResponse);
    }


    public APIResponse<PaginationResponse<TeacherTopicWithLimitResponse>> getTopicsGroupByTeacherWithLimit(
            String year, String teacherQueryName, String page, String numberOfRecords) {

        List<Object[]> results = topicRepo.findTopicsGroupedByUserIdAndName(year, teacherQueryName);

        Map<String, TeacherTopicWithLimitResponse> groupedMap = new LinkedHashMap<>();

        for (Object[] result : results) {
            String userId = (String) result[0];
            String name = (String) result[1];
            Topic topic = (Topic) result[2];

            TopicResponse topicResponse = topicMapper.toTopicResponse(topic);

            List<TeacherTopicLimit> topicLimits = teacherTopicLimitRepo.findAllById_TeacherIdAndId_SchoolYear(userId, year);

            int maxTopics = topicLimits.stream()
                    .mapToInt(TeacherTopicLimit::getMaxTopics)
                    .sum();

            groupedMap.computeIfAbsent(userId, k -> {
                TeacherTopicWithLimitResponse response = new TeacherTopicWithLimitResponse();
                response.setUserId(userId);
                response.setName(name);
                response.setMaxTopics(maxTopics);
                response.setTopicResponses(new ArrayList<>());
                return response;
            }).getTopicResponses().add(topicResponse);
        }

        List<TeacherTopicWithLimitResponse> groupedList = new ArrayList<>(groupedMap.values());
        PaginationResponse<TeacherTopicWithLimitResponse> paginationResponse = paginate(groupedList, page, numberOfRecords);

        return buildSuccessResponse(paginationResponse);
    }


}


