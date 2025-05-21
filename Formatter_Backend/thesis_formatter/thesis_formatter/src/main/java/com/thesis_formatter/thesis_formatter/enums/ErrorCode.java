package com.thesis_formatter.thesis_formatter.enums;

import lombok.AccessLevel;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

@Getter
public enum ErrorCode {
    UNCATEGORIZED_EXCEPTION("9999", "Uncategorized Exception"),
    INVALID_KEYWORD("0001", "Invalid message keyword"),
    USER_EXISTED("1001", "User already existed"),
    USER_NOT_EXISTED("1002", "User not existed"),
    UNAUTHENTICATED("1003", "Unauthenticated"),
    ;

    private String code;
    private String message;

    ErrorCode(String message, String code) {
        this.message = message;
        this.code = code;
    }
}
