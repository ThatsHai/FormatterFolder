package com.thesis_formatter.thesis_formatter.enums;

import lombok.AccessLevel;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

@Getter
public enum ErrorCode {
<<<<<<< Updated upstream
    UNCATEGORIZED_EXCEPTION("9999", "Uncategorized Exception"),
    INVALID_KEYWORD("0001", "Invalid message keyword"),
    USER_EXISTED("1001", "User already existed"),
    USER_NOT_EXISTED("1002", "User not existed"),
    UNAUTHENTICATED("1003", "Unauthenticated"),
=======
    UNCATEGORIZED_EXCEPTION("9999", "Uncategorized Exception", HttpStatus.INTERNAL_SERVER_ERROR),
    INVALID_KEYWORD("0001", "Invalid message keyword", HttpStatus.BAD_REQUEST),
    USER_EXISTED("1001", "User already existed", HttpStatus.BAD_REQUEST),
    USER_NOT_EXISTED("1002", "User not existed", HttpStatus.NOT_FOUND),
    UNAUTHENTICATED("1003", "Unauthenticated", HttpStatus.UNAUTHORIZED),
    UNAUTHORIZED("1004", "You do not have permission", HttpStatus.FORBIDDEN),
    NULL_PROPERTY("1005", "Has Null property", HttpStatus.BAD_REQUEST),
    PERMISSION_EXISTED("1006", "Permission existed", HttpStatus.BAD_REQUEST),
    TOKEN_INVALID("1007", "Token invalid", HttpStatus.BAD_REQUEST),

>>>>>>> Stashed changes
    ;

    private String code;
    private String message;

    ErrorCode(String message, String code) {
        this.message = message;
        this.code = code;
    }
}
