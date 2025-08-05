package com.thesis_formatter.thesis_formatter.enums;

import java.util.List;

public enum MilestoneTemplate {
    LITERATURE_REVIEW("Lược khảo tài liệu", 0, List.of()),
    IMPLEMENTATION("Triển khai thực hiện",1, List.of()),
    RESULT("Kết quả", 2,null); // task có thể truyền vào sau

    private final String name;
    private final int position;
    private final List<String> defaultTasks;

    MilestoneTemplate(String name, int position, List<String> defaultTasks) {
        this.position = position;
        this.name = name;
        this.defaultTasks = defaultTasks;
    }

    public String getName() {
        return name;
    }

    public int getPosition() {
        return position;
    }

    public List<String> getDefaultTasks() {
        return defaultTasks;
    }
}
