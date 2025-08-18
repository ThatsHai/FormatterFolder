package com.thesis_formatter.thesis_formatter.utils;

import com.thesis_formatter.thesis_formatter.entity.*;

import java.util.*;
import java.util.stream.Collectors;

public class ConvertPlaceholderInFormRecord {
    public static Map<String, String> buildPlaceholderValueMap(FormRecord formRecord) {
        Map<String, String> placeholderValueMap = new HashMap<>();

        // Add formRecord fields
        for (FormRecordField f : formRecord.getFormRecordFields()) {
            String key = safe(f != null && f.getFormField() != null ? f.getFormField().getFieldName() : null);
            String val = safe(f != null ? f.getValue() : null);
            if (!key.isEmpty()) {
                placeholderValueMap.put(key, val);
            }
        }

        // Add student placeholders
        placeholderValueMap.putAll(buildStudentPlaceholders(formRecord));

        // Add teacher placeholders
        placeholderValueMap.putAll(buildTeacherPlaceholders(formRecord));

        return placeholderValueMap;
    }

    private static Map<String, String> buildTeacherPlaceholders(FormRecord formRecord) {
        Map<String, String> map = new HashMap<>();

        List<Teacher> teachers = Optional.ofNullable(formRecord.getTopic())
                .map(Topic::getTeachers)
                .orElse(Collections.emptyList());

        String teacherNames = teachers.stream()
                .map(t -> safe(t != null ? t.getName() : null))
                .filter(s -> !s.isEmpty())
                .collect(Collectors.joining("\n"));

        String teacherEmails = teachers.stream()
                .map(t -> safe(t != null ? t.getEmail() : null))
                .filter(s -> !s.isEmpty())
                .collect(Collectors.joining("\n"));

        String teacherDepartments = teachers.stream()
                .map(t -> {
                    if (t == null) return "";
                    Department d = t.getDepartment();
                    return safe(d != null ? d.getDepartmentName() : null);
                })
                .filter(s -> !s.isEmpty())
                .collect(Collectors.joining("\n"));

        map.put("Họ và tên giảng viên", teacherNames);
        map.put("Email giảng viên", teacherEmails);
        map.put("Khoa/Bộ môn giảng viên", teacherDepartments);

        return map;
    }

    private static Map<String, String> buildStudentPlaceholders(FormRecord formRecord) {
        Map<String, String> map = new HashMap<>();

        Student student = formRecord.getStudent();
        if (student != null) {
            String studentName = Objects.toString(student.getName(), "");
            String studentEmail = Objects.toString(student.getEmail(), "");
            String studentClass = "";
            String studentMajor = "";

            if (student.getStudentClass() != null) {
                studentClass = Objects.toString(student.getStudentClass().getStudentClassName(), "");
                if (student.getStudentClass().getMajor() != null) {
                    studentMajor = Objects.toString(student.getStudentClass().getMajor().getMajorName(), "");
                }
            }

            map.put("Họ và tên sinh viên", studentName);
            map.put("Email sinh viên", studentEmail);
            map.put("Lớp sinh viên", studentClass);
            map.put("Ngành học sinh viên", studentMajor);
        }

        return map;
    }

    private static String safe(String s) {
        return s == null ? "" : s;
    }

    //Use to convert design string to formRecordString and its value
    public static String convertToHtmlTableCompact(String input) {
        String[] parts = input.split(":::", 2);
        String prefix = parts[0];
        String headersPart = parts.length > 1 ? parts[1] : "";

        // Split headers by 2 or more pipes
        String[] rawHeaders = headersPart.split("\\|{2,}");
        StringBuilder tableHtml = new StringBuilder();

        tableHtml.append("<table><thead><tr>");
        for (String header : rawHeaders) {
            header = header.trim();
            if (!header.isEmpty()) {
                tableHtml.append("<th>").append(header).append("</th>");
            }
        }
        tableHtml.append("</tr></thead></table>");

        return prefix + ":::" + tableHtml.toString();
    }

}
