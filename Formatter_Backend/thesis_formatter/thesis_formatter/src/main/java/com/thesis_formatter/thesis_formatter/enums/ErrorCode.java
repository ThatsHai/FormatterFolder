package com.thesis_formatter.thesis_formatter.enums;

import com.thesis_formatter.thesis_formatter.entity.FormRecord;
import lombok.AccessLevel;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

@Getter
public enum ErrorCode {
    UNCATEGORIZED_EXCEPTION("9999", "Uncategorized Exception", HttpStatus.INTERNAL_SERVER_ERROR),
    INVALID_KEYWORD("0001", "Invalid message keyword", HttpStatus.BAD_REQUEST),
    USER_EXISTED("1001", "User already existed", HttpStatus.BAD_REQUEST),
    USER_NOT_EXISTED("1002", "User not existed", HttpStatus.NOT_FOUND),
    UNAUTHENTICATED("1003", "Unauthenticated", HttpStatus.UNAUTHORIZED),
    UNAUTHORIZED("1004", "you don't have permission", HttpStatus.FORBIDDEN),
    NULL_PROPERTY("1005", " has Null property", HttpStatus.BAD_REQUEST),
    PERMISSION_EXISTED("1006", "Permission existed", HttpStatus.BAD_REQUEST),
    TOKEN_INVALID("1007", "Token invalid", HttpStatus.BAD_REQUEST),
    INCORRECT_PASSWORD("1008", "Incorrect password", HttpStatus.UNAUTHORIZED),
    DUPLICATE_KEY("1009", "Duplicate key", HttpStatus.BAD_REQUEST),
    TEACHER_NOT_EXISTED("1010", "Teacher not existed", HttpStatus.NOT_FOUND),
    MAJOR_NOT_EXISTED("1011", "Major not existed", HttpStatus.NOT_FOUND),
    FORM_NOT_FOUND("1012", "Form not found", HttpStatus.NOT_FOUND),
    RECORD_NOT_FOUND("1013", "Form record not found", HttpStatus.NOT_FOUND),
    DESIGN_NOT_FOUND("1014", "Design not found", HttpStatus.NOT_FOUND),
    FormRecord_NOT_FOUND("1015", "Form record not found", HttpStatus.NOT_FOUND),
    INVALID_FORM_STATUS("1016", "Invalid form status", HttpStatus.BAD_REQUEST),
    STUDENTCLASS_NOT_FOUND("1017", "Student class not found", HttpStatus.NOT_FOUND),
    DEPARTMENT_NOT_FOUND("1018", "Department not found", HttpStatus.NOT_FOUND),
    FACULTY_NOT_FOUND("1019", "Faculty not found", HttpStatus.NOT_FOUND),
    ENTITY_NOT_FOUND("1020", "This entity does not exist", HttpStatus.NOT_FOUND),
    INVALID_ARGUMENT("1021", "Invalid argument", HttpStatus.BAD_REQUEST),
    TOPIC_NOT_FOUND("1022", "Topic not found", HttpStatus.NOT_FOUND),
    STUDENT_ALREADY_IN_OTHER_TOPIC("1023", "Student already in other topic", HttpStatus.BAD_REQUEST),
    DUPLICATE_NAME("1024", "Duplicate name", HttpStatus.CONFLICT),
    NOTIFICATION_RECEIVER_NOT_FOUND("1025", "Notification receiver not found", HttpStatus.NOT_FOUND),
    PROGRESS_NOT_FOUND("1026", "Progress not found", HttpStatus.NOT_FOUND),
    MILESTONE_NOT_FOUND("1027", "Milestone not found", HttpStatus.NOT_FOUND),

    ;

    private String code;
    private String message;
    private HttpStatusCode httpStatusCode;

    ErrorCode(String code, String message, HttpStatusCode httpStatusCode) {
        this.code = code;
        this.message = message;
        this.httpStatusCode = httpStatusCode;
    }
}
