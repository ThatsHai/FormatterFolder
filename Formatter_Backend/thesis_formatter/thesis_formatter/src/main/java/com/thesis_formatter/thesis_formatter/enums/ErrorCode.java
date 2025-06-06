package com.thesis_formatter.thesis_formatter.enums;

import lombok.AccessLevel;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;

@Getter
public enum ErrorCode {
    UNCATEGORIZED_EXCEPTION("9999", "Uncategorized Exception", HttpStatus.INTERNAL_SERVER_ERROR),
    INVALID_KEYWORD("0001", "Invalid message keyword", HttpStatus.BAD_REQUEST),
    USER_EXISTED("1001", "User already existed", HttpStatus.BAD_REQUEST),
    USER_NOT_EXISTED("1002", "User not existed", HttpStatus.NOT_FOUND),
    UNAUTHENTICATED("1003", "Unauthenticated", HttpStatus.UNAUTHORIZED),
    UNAUTHORIZED("1004", "You do not have permission", HttpStatus.FORBIDDEN),
    NULL_PROPERTY("1005", "Has Null property", HttpStatus.BAD_REQUEST),
    PERMISSION_EXISTED("1006", "Permission existed", HttpStatus.BAD_REQUEST),
    TOKEN_INVALID("1007", "Token invalid", HttpStatus.BAD_REQUEST),

    ;

    private String code;
    private String message;
    private HttpStatus httpStatusCode;

    ErrorCode(String message, String code, HttpStatus httpStatusCode) {
        this.message = message;
        this.code = code;
        this.httpStatusCode = httpStatusCode;
    }
}
