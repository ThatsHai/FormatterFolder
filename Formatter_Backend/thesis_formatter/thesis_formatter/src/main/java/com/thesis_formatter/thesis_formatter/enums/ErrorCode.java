package com.thesis_formatter.thesis_formatter.enums;

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
