package com.thesis_formatter.thesis_formatter.service;

import com.thesis_formatter.thesis_formatter.dto.response.APIResponse;
import com.thesis_formatter.thesis_formatter.dto.response.ProgressResponse;
import com.thesis_formatter.thesis_formatter.entity.FormRecord;
import com.thesis_formatter.thesis_formatter.entity.Progress;
import com.thesis_formatter.thesis_formatter.enums.ErrorCode;
import com.thesis_formatter.thesis_formatter.exception.AppException;
import com.thesis_formatter.thesis_formatter.mapper.ProgressMapper;
import com.thesis_formatter.thesis_formatter.repo.FormRecordRepo;
import com.thesis_formatter.thesis_formatter.repo.ProgressRepo;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ProgressService {
    ProgressMapper progressMapper;
    FormRecordRepo formRecordRepository;
    ProgressRepo progressRepository;

    public APIResponse<ProgressResponse> createProgress(String formRecordId) {
        FormRecord formRecord = formRecordRepository.findFormRecordByFormRecordId(formRecordId);
        if (formRecord == null) {
            throw new AppException(ErrorCode.FormRecord_NOT_FOUND);
        }

        Progress progress = Progress.builder().formRecord(formRecord).build();
        
        progressRepository.save(progress);

        return APIResponse.<ProgressResponse>builder()
                .code("200")
                .result(progressMapper.toProgressResponse(progress))
                .build();
    }

    public APIResponse<ProgressResponse> getProgressById(String progressId) {
        Progress progress = progressRepository.findById(progressId)
                .orElseThrow(() -> new AppException(ErrorCode.PROGRESS_NOT_FOUND));

        ProgressResponse response = progressMapper.toProgressResponse(progress);

        return APIResponse.<ProgressResponse>builder()
                .code("200")
                .result(response)
                .build();
    }

//    public APIResponse<Void> deleteProgress(String progressId) {
//        Progress progress = progressRepository.findById(progressId)
//                .orElseThrow(() -> new AppException(ErrorCode.PROGRESS_NOT_FOUND));
//
//        progressRepository.delete(progress);
//
//        return APIResponse.<Void>builder()
//                .code("200")
//                .message("Progress deleted")
//                .build();
//    }
}
