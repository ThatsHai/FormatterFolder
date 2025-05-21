package com.thesis_formatter.thesis_formatter.exception;

import com.thesis_formatter.thesis_formatter.enums.ErrorCode;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AppException extends RuntimeException {
    private ErrorCode errorCode;
}
