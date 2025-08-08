package com.thesis_formatter.thesis_formatter.mapper;

import com.thesis_formatter.thesis_formatter.dto.request.AddDefenseScheduleRequest;
import com.thesis_formatter.thesis_formatter.dto.response.DefenseScheduleResponse;
import com.thesis_formatter.thesis_formatter.entity.DefenseSchedule;
import com.thesis_formatter.thesis_formatter.entity.Teacher;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface DefenseScheduleMapper {

    @Mapping(target = "studentId", source = "formRecord.student.userId")
    @Mapping(target = "studentName", source = "formRecord.student.name")
    @Mapping(target = "topicName", source = "formRecord.topic.title")
    @Mapping(target = "formRecordId", source = "formRecord.formRecordId")
    @Mapping(target = "guideNames", expression = "java(mapGuideTeachers(entity.getFormRecord().getTopic().getTeachers()))")
    @Mapping(target = "teacherNames", expression = "java(mapTeacherNames(entity.getTeachers()))")
    DefenseScheduleResponse toResponse(DefenseSchedule entity);

    List<DefenseScheduleResponse> toResponses(List<DefenseSchedule> entities);

    // guideNames
    default List<String> mapGuideTeachers(List<Teacher> guideTeachers) {
        if (guideTeachers == null) return null;
        return guideTeachers.stream()
                .map(Teacher::getName)
                .toList();
    }

    // teachers
    default List<String> mapTeacherNames(List<Teacher> teachers) {
        if (teachers == null) return null;
        return teachers.stream()
                .map(Teacher::getName)
                .toList();
    }

}
