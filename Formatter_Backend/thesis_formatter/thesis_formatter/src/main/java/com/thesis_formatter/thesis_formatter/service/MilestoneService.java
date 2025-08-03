package com.thesis_formatter.thesis_formatter.service;


import com.thesis_formatter.thesis_formatter.dto.request.AddMileStoneRequest;
import com.thesis_formatter.thesis_formatter.dto.response.APIResponse;
import com.thesis_formatter.thesis_formatter.dto.response.MilestoneResponse;
import com.thesis_formatter.thesis_formatter.entity.Milestone;
import com.thesis_formatter.thesis_formatter.entity.Progress;
import com.thesis_formatter.thesis_formatter.enums.ErrorCode;
import com.thesis_formatter.thesis_formatter.exception.AppException;
import com.thesis_formatter.thesis_formatter.mapper.MilestoneMapper;
import com.thesis_formatter.thesis_formatter.repo.MilestoneRepo;
import com.thesis_formatter.thesis_formatter.repo.ProgressRepo;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.UUID;

@Service
@RequiredArgsConstructor
//@Transactional
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class MilestoneService {

    MilestoneRepo milestoneRepo;
    ProgressRepo progressRepo;
    MilestoneMapper milestoneMapper;

    public APIResponse<MilestoneResponse> create(AddMileStoneRequest request) {
        Progress progress = progressRepo.findById(request.getProgressId())
                .orElseThrow(() -> new AppException(ErrorCode.PROGRESS_NOT_FOUND));

        Milestone milestone = Milestone.builder()
                .name(request.getName())
                .dueDate(request.getDueDate())
                .completed(false)
                .progress(progress)
                .tasks(new ArrayList<>())
                .build();

        milestoneRepo.save(milestone);

        return APIResponse.<MilestoneResponse>builder()
                .code("200")
                .result(milestoneMapper.toResponse(milestone))
                .build();
    }

    public APIResponse<MilestoneResponse> getById(String id) {
        Milestone milestone = milestoneRepo.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.MILESTONE_NOT_FOUND));

        return APIResponse.<MilestoneResponse>builder()
                .code("200")
                .result(milestoneMapper.toResponse(milestone))
                .build();
    }

    public APIResponse<Void> delete(String id) {
        Milestone milestone = milestoneRepo.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.MILESTONE_NOT_FOUND));

        milestoneRepo.delete(milestone);
        return APIResponse.<Void>builder()
                .code("200")
                .message("Milestone deleted")
                .build();
    }
}
