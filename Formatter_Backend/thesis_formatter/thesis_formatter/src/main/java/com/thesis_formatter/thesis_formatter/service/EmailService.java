package com.thesis_formatter.thesis_formatter.service;

import java.text.Normalizer;
import java.util.Locale;
import java.util.regex.Pattern;

public class EmailService {

    public static String generateStudentEmail(String name, String userId) {

        String parts[] = name.split("\\s+");
        String lastName = parts[parts.length - 1];

        //  chuyển tên thành không dấu và viết liền
        String baseName = removeAccents(lastName).toLowerCase();

        return baseName + userId + "@student.ctu.edu.vn";
    }

    private static String removeAccents(String text) {
        String normalized = Normalizer.normalize(text, Normalizer.Form.NFD);
        Pattern pattern = Pattern.compile("\\p{InCombiningDiacriticalMarks}+");
        return pattern.matcher(normalized).replaceAll("");
    }

}
