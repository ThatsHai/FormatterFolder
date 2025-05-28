package com.thesis_formatter.thesis_formatter.enums;

import lombok.AccessLevel;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

@Getter
public enum ErrorCode {
    UNCATEGORIZED_EXCEPTION( "Uncategorized Exception","9999"),
    INVALID_KEYWORD( "Invalid message keyword","0001"),
    USER_EXISTED("User already existed","1001"),
    USER_NOT_EXISTED( "User not existed","1002"),
    UNAUTHENTICATED("Unauthenticated", "1003"),
    NULL_PROPERTY(" has Null property", "1004"),
    PERMISSION_EXISTED("Permission existed", "1005"),
    ;

    private String code;
    private String message;

    ErrorCode(String message, String code) {
        this.message = message;
        this.code = code;
    }
}
