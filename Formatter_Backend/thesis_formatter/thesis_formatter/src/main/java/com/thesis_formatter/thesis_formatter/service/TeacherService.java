package com.thesis_formatter.thesis_formatter.service;

import com.thesis_formatter.thesis_formatter.dto.request.TeacherFiltersDTO;
import com.thesis_formatter.thesis_formatter.dto.request.TeacherSearchCriteria;
import com.thesis_formatter.thesis_formatter.dto.response.*;
import com.thesis_formatter.thesis_formatter.entity.*;
import com.thesis_formatter.thesis_formatter.entity.id.TeacherTopicLimitId;
import com.thesis_formatter.thesis_formatter.enums.ErrorCode;
import com.thesis_formatter.thesis_formatter.enums.Semester;
import com.thesis_formatter.thesis_formatter.exception.AppException;
import com.thesis_formatter.thesis_formatter.mapper.RoleMapper;
import com.thesis_formatter.thesis_formatter.mapper.TeacherMapper;
import com.thesis_formatter.thesis_formatter.mapper.TopicMapper;
import com.thesis_formatter.thesis_formatter.repo.*;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;


@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)

public class TeacherService {
    TeacherRepo teacherRepo;
    DepartmentRepo departmentRepo;
    TeacherMapper teacherMapper;
    AuthenticationService authenticationService;
    RoleRepo roleRepo;
    TopicRepo topicRepo;
    TopicMapper topicMapper;
    TeacherTopicLimitRepo teacherTopicLimitRepo;
//    private final FacultyRepo facultyRepo;

    private final FacultyRepo facultyRepo;

    @PreAuthorize("hasRole('ADMIN')")
//    @PreAuthorize("hasAuthority('CREATE_TEACHER')")

    public APIResponse<TeacherDTO> addTeacher(Teacher teacher) {
        Teacher checkDuplicate = teacherRepo.findByUserId(teacher.getUserId());
        if (checkDuplicate != null) {
            throw new AppException(ErrorCode.DUPLICATE_KEY);
        }

        Department department = departmentRepo.findByDepartmentId(teacher.getDepartment().getDepartmentId());
        teacher.setDepartment(department);
        authenticationService.encodePassword(teacher);
        Role role = roleRepo.findByName("TEACHER");
        teacher.setRole(role);
        teacher.setStatus("active");
        teacherRepo.save(teacher);

        TeacherDTO teacherDTO = teacherMapper.toDTO(teacher);
        return APIResponse
                .<TeacherDTO>builder()
                .code("200")
                .result(teacherDTO)
                .build();
    }

    public ResponseEntity<?> findTeacherByFilters(TeacherFiltersDTO teacherFiltersDTO) {
        try {
            String faculty = teacherFiltersDTO.faculty();
            String departmentName = teacherFiltersDTO.departmentName();
            String teacherName = teacherFiltersDTO.teacherName();
            String teacherId = teacherFiltersDTO.teacherId();
            Teacher teacher = teacherRepo.findTeachersByFilters(faculty, departmentName, teacherId, teacherName);
            if (teacher == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy giảng viên phù hợp");
            }
            TeacherFiltersReponseDTO teacherFiltersReponseDTO = convertTeacherToTeacherFiltersReponseDTO(teacher);
            return ResponseEntity.status(HttpStatus.OK).body(teacherFiltersReponseDTO);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    private TeacherFiltersReponseDTO convertTeacherToTeacherFiltersReponseDTO(Teacher teacher) {
        return new TeacherFiltersReponseDTO(
                teacher.getUserId(),
                teacher.getName()
        );
    }

    public APIResponse<List<TeacherDTO>> getAll() {
        List<Teacher> teachers = teacherRepo.findAll();
        return buildTeacherResponse(teachers);
    }

    //    public APIResponse<List<TeacherDTO>> getTeachersByDepartmentId(String departmentId) {
//        Department department = departmentRepo.findByDepartmentId(departmentId);
//        if (department == null) {
//            return APIResponse.<List<TeacherDTO>>builder()
//                    .code("404")
//                    .result(Collections.emptyList())
//                    .build();
//        }
//        List<Teacher> teachers = teacherRepo.findByDepartmentDepartmentId(departmentId);
//        return buildTeacherResponse(teachers);
//    }
//
//    public APIResponse<List<TeacherDTO>> getTeachersByFacultyId(String facultyId) {
//        Faculty faculty = facultyRepo.findByFacultyId(facultyId);
//        if (faculty == null) {
//            return APIResponse.<List<TeacherDTO>>builder()
//                    .code("404")
//                    .result(Collections.emptyList())
//                    .build();
//        }
//        //No departments
//        List<Department> departments = departmentRepo.findByFacultyFacultyId(facultyId);
//        if (departments.isEmpty()) {
//            return APIResponse.<List<TeacherDTO>>builder()
//                    .code("200")
//                    .result(Collections.emptyList())
//                    .build();
//        }
//        List<Teacher> teachers = teacherRepo.findByDepartmentIn(departments);
//        return buildTeacherResponse(teachers);
//    }
//
//    public APIResponse<List<TeacherDTO>> getTeacherByUserId(String userId) {
//        Optional<Teacher> teacherOptional = teacherRepo.findByUserId(userId);
//
//        if (teacherOptional.isPresent()) {
//            TeacherDTO dto = teacherMapper.toDTO(teacherOptional.get());
//            return APIResponse.<List<TeacherDTO>>builder()
//                    .code("200")
//                    .result(Collections.singletonList(dto))
//                    .build();
//        } else {
//            return APIResponse.<List<TeacherDTO>>builder()
//                    .code("404")
//                    .result(Collections.emptyList())
//                    .build();
//        }
//    }
//
//    public APIResponse<List<TeacherDTO>> getTeachersByName(String name) {
//        List<Teacher> teachers = teacherRepo.findByNameContainingIgnoreCase(name);
//        return buildTeacherResponse(teachers);
//    }
//
    private APIResponse<List<TeacherDTO>> buildTeacherResponse(List<Teacher> teachers) {
        List<TeacherDTO> teacherDTOs = teachers.stream()
                .map(teacherMapper::toDTO)
                .collect(Collectors.toList());

        return APIResponse.<List<TeacherDTO>>builder()
                .code("200")
                .result(teacherDTOs)
                .build();
    }

    public APIResponse<PaginationResponse<TeacherDTO>> searchTeachers(TeacherSearchCriteria criteria, String page, String numberOfRecords) {
        Pageable pageable = PageRequest.of(Integer.parseInt(page), Integer.parseInt(numberOfRecords));

        Page<Teacher> teacherPage = teacherRepo.findAll(TeacherSpecification.withCriteria(criteria), pageable);
        List<TeacherDTO> teacherDTOList = teacherPage.getContent()
                .stream()
                .map(teacherMapper::toDTO)
                .toList();

        PaginationResponse<TeacherDTO> pageResponse = new PaginationResponse<>();
        pageResponse.setCurrentPage(teacherPage.getNumber());
        pageResponse.setContent(teacherDTOList);
        pageResponse.setTotalElements(teacherPage.getTotalElements());
        pageResponse.setTotalPages(teacherPage.getTotalPages());

        return APIResponse.<PaginationResponse<TeacherDTO>>builder()
                .result(pageResponse)
                .code("200")
                .build();
//        return buildTeacherResponse(teachers);
    }

    public APIResponse<PaginationResponse<TeacherTopicWithLimitResponse>> getTeachersWithTopicsAndLimits(
            String semester, String year, String teacherQueryName, String page, String numberOfRecords) {

        Semester semesterObj = Semester.valueOf(semester);
        Pageable pageable = PageRequest.of(Integer.parseInt(page), Integer.parseInt(numberOfRecords));

        Page<Teacher> teacherPage = (teacherQueryName == null || teacherQueryName.isBlank())
                ? teacherRepo.findAll(pageable)
                : teacherRepo.findAllByNameContainingIgnoreCase(teacherQueryName, pageable);

        List<TeacherTopicWithLimitResponse> responses = teacherPage.getContent().stream().map(teacher -> {
            List<Topic> topics = topicRepo.findTopicsByTeacherAndSemesterAndYear(teacher, semesterObj, year);
            List<TopicResponse> topicResponses = topics.stream()
                    .map(topicMapper::toTopicResponse)
                    .toList();
            TeacherTopicLimitId teacherTopicLimitId = new TeacherTopicLimitId(teacher.getAcId(), semesterObj, year);
            Optional<TeacherTopicLimit> topicLimitOpt = teacherTopicLimitRepo.findById(teacherTopicLimitId);

            int maxTopics = topicLimitOpt.map(TeacherTopicLimit::getMaxTopics).orElse(0);

            TeacherTopicWithLimitResponse response = new TeacherTopicWithLimitResponse();
            response.setUserId(teacher.getUserId());
            response.setName(teacher.getName());
            response.setMaxTopics(maxTopics);
            response.setTopicResponses(topicResponses);

            return response;
        }).toList();

        PaginationResponse<TeacherTopicWithLimitResponse> paginationResponse = new PaginationResponse<>();
        paginationResponse.setTotalPages(teacherPage.getTotalPages());
        paginationResponse.setTotalElements(teacherPage.getTotalElements());
        paginationResponse.setContent(responses);
        paginationResponse.setCurrentPage(teacherPage.getNumber());

        return APIResponse.<PaginationResponse<TeacherTopicWithLimitResponse>>builder()
                .code("200")
                .result(paginationResponse)
                .build();
    }

    public APIResponse<PaginationResponse<TeacherTopicWithLimitResponse>> getTeachersWithTopicsAndLimits(
            String year, String teacherQueryName, String page, String numberOfRecords) {

        Pageable pageable = PageRequest.of(Integer.parseInt(page), Integer.parseInt(numberOfRecords));

        Page<Teacher> teacherPage = (teacherQueryName == null || teacherQueryName.isBlank())
                ? teacherRepo.findAll(pageable)
                : teacherRepo.findAllByNameContainingIgnoreCase(teacherQueryName, pageable);

        List<TeacherTopicWithLimitResponse> responses = teacherPage.getContent().stream().map(teacher -> {
            List<Topic> topics = topicRepo.findTopicsByTeacherAndYear(teacher, year);
            List<TopicResponse> topicResponses = topics.stream()
                    .map(topicMapper::toTopicResponse)
                    .toList();

            List<TeacherTopicLimit> topicLimits = teacherTopicLimitRepo.findAllById_TeacherIdAndId_SchoolYear(teacher.getAcId(), year);
            int maxTopics = topicLimits.stream()
                    .mapToInt(TeacherTopicLimit::getMaxTopics)
                    .sum();

            TeacherTopicWithLimitResponse response = new TeacherTopicWithLimitResponse();
            response.setUserId(teacher.getUserId());
            response.setName(teacher.getName());
            response.setMaxTopics(maxTopics);
            response.setTopicResponses(topicResponses);
            return response;
        }).toList();

        PaginationResponse<TeacherTopicWithLimitResponse> paginationResponse = new PaginationResponse<>();
        paginationResponse.setTotalPages(teacherPage.getTotalPages());
        paginationResponse.setTotalElements(teacherPage.getTotalElements());
        paginationResponse.setContent(responses);
        paginationResponse.setCurrentPage(teacherPage.getNumber());

        return APIResponse.<PaginationResponse<TeacherTopicWithLimitResponse>>builder()
                .code("200")
                .result(paginationResponse)
                .build();
    }

}
