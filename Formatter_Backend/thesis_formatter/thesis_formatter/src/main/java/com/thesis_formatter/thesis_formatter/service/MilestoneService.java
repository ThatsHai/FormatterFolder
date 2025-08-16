package com.thesis_formatter.thesis_formatter.service;


import com.thesis_formatter.thesis_formatter.dto.request.AddMileStoneRequest;
import com.thesis_formatter.thesis_formatter.dto.request.SetDueDateOfMileStoneRequest;
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
import java.util.List;
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

        List<Milestone> milestones = progress.getMilestones();

        int insertPos = request.getPosition() != null ? request.getPosition() : milestones.size();

        //insertPos <= size
        insertPos = Math.max(0, Math.min(insertPos, milestones.size()));

        // Tăng position các milestone hiện có
        for (Milestone m : milestones) {
            if (m.getPosition() >= insertPos) {
                m.setPosition(m.getPosition() + 1);
            }
        }

        milestoneRepo.saveAll(milestones); // cập nhật lại position các milestone cũ

        Milestone milestone = Milestone.builder()
                .name(request.getName())
                .dueDate(request.getDueDate())
                .completed(false)
                .progress(progress)
                .tasks(new ArrayList<>())
                .position(insertPos)
                .build();
        System.out.println("Position: " + milestone.getPosition());
        milestoneRepo.save(milestone);
        MilestoneResponse milestoneResponse = milestoneMapper.toResponse(milestone);
        System.out.println("Position res: " + milestoneResponse.getPosition());
        return APIResponse.<MilestoneResponse>builder()
                .code("200")
                .result(milestoneResponse)
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

    @Transactional
    public APIResponse<Void> delete(String id) {
        Milestone milestone = milestoneRepo.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.MILESTONE_NOT_FOUND));
        if (milestone.getTasks() != null && !milestone.getTasks().isEmpty()) {
            throw new RuntimeException("Không thể xoá do cột mốc, hãy xoá toàn bộ công việc bên trong!");
        }
        Progress progress = milestone.getProgress();
        List<Milestone> milestones = progress.getMilestones();
        System.out.println("Gốc: " + milestone.getPosition());
        for (Milestone m : milestones) {
            if (m.getPosition() > milestone.getPosition()) {
                m.setPosition(m.getPosition() - 1);
                milestoneRepo.save(m);
            }

        }
        progress.getMilestones().remove(milestone);
        milestoneRepo.deleteById(milestone.getId());

        return APIResponse.<Void>builder()
                .code("200")
                .message("Milestone deleted")
                .build();
    }


    public APIResponse<Void> setDueDate(SetDueDateOfMileStoneRequest request) {
        Milestone milestone = milestoneRepo.findById(request.getMilestoneId()).orElseThrow(() -> new AppException(ErrorCode.MILESTONE_NOT_FOUND));
        milestone.setDueDate(request.getDueDate());
        milestoneRepo.save(milestone);
        return APIResponse.<Void>builder()
                .code("200")
                .message("Milestone dueDate updated")
                .build();

    }

}
