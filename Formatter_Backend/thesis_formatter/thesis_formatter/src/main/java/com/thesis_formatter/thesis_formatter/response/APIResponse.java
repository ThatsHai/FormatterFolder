package com.thesis_formatter.thesis_formatter.response;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class APIResponse<T> {
    private String code;
    private T result;
}
