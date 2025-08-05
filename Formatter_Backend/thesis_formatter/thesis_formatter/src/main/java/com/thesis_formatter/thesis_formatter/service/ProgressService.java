package com.thesis_formatter.thesis_formatter.service;

import com.thesis_formatter.thesis_formatter.dto.response.APIResponse;
import com.thesis_formatter.thesis_formatter.dto.response.FormRecordResponse;
import com.thesis_formatter.thesis_formatter.dto.response.PaginationResponse;
import com.thesis_formatter.thesis_formatter.dto.response.ProgressResponse;
import com.thesis_formatter.thesis_formatter.entity.*;
import com.thesis_formatter.thesis_formatter.enums.ErrorCode;
import com.thesis_formatter.thesis_formatter.enums.Semester;
import com.thesis_formatter.thesis_formatter.exception.AppException;
import com.thesis_formatter.thesis_formatter.mapper.ProgressMapper;
import com.thesis_formatter.thesis_formatter.mapper.TopicMapper;
import com.thesis_formatter.thesis_formatter.repo.*;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.select.Elements;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ProgressService {
    ProgressMapper progressMapper;
    FormRecordRepo formRecordRepository;
    ProgressRepo progressRepository;
    private final TopicMapper topicMapper;
    private final TopicRepo topicRepo;
    private final TaskRepo taskRepo;
    private final MilestoneRepo milestoneRepo;

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
    public void autoGenerateProgress(String formRecordId) {

        FormRecord formRecord = formRecordRepository.findFormRecordByFormRecordId(formRecordId);
        if (formRecord == null) {
            throw new AppException(ErrorCode.FormRecord_NOT_FOUND);
        }

        Progress progress = Progress.builder()
                .formRecord(formRecord)
                .milestones(new ArrayList<>())
                .build();

        progressRepository.save(progress);

        //3 default milestone
        String[] names = {"Lược khảo tài liệu", "Triển khai thực hiện", "Kết quả"};
        List<Milestone> milestones = new ArrayList<>();

        for (int i = 0; i < names.length; i++) {
            Milestone milestone = Milestone.builder()
                    .name(names[i])
                    .tasks(new ArrayList<>())
                    .progress(progress)
                    .position(i)
                    .completed(false)
                    .build();
            if (i == 2) {
                String objectiveDetails = formRecord.getTopic().getObjectiveDetails();
                List<String> taskNames = extractTaskNames(objectiveDetails);
                for (String taskName : taskNames) {
                    Task task = Task.builder()
                            .name(taskName)
                            .milestone(milestone)
                            .build();
                    taskRepo.save(task);
                    milestone.getTasks().add(task);
                }
                milestoneRepo.save(milestone);
            }
            milestones.add(milestone);
        }
        progress.setMilestones(milestones);
        progressRepository.save(progress);
    }

    public static List<String> extractTaskNames(String htmlContent) {
        Document doc = Jsoup.parse(htmlContent);
        Elements liElements = doc.select("ol > li, p");

        return liElements.stream()
                .map(element -> element.text().trim())
                .filter(text -> !text.isEmpty())
                .collect(Collectors.toList());
    }

    public APIResponse<PaginationResponse<ProgressResponse>> getProgressesByTime(String userId, String page, String number) {

        int month = LocalDate.now().getMonth().getValue();
        Semester semester = month < 5 ? Semester.HK2 : month < 9 ? Semester.HK3 : Semester.HK1;
        String year = String.valueOf(LocalDate.now().getYear());
        Pageable pageable = PageRequest.of(Integer.parseInt(page), Integer.parseInt((number)));
        Page<Progress> progresses = progressRepository.findProgressByUserAndTime(userId, semester, year, pageable);

        List<ProgressResponse> progressResponses = progressMapper.toProgressResponseList(progresses.getContent());
        PaginationResponse<ProgressResponse> paginationResponse = new PaginationResponse<>();
        paginationResponse.setContent(progressResponses);
        paginationResponse.setTotalElements(progresses.getTotalElements());
        paginationResponse.setTotalPages(progresses.getTotalPages());
        paginationResponse.setCurrentPage(progresses.getNumber());

        return APIResponse.<PaginationResponse<ProgressResponse>>builder()
                .code("200")
                .result(paginationResponse)
                .build();
    }

    public APIResponse<?> getProgressByStudent(String userId) {
        Progress progress = progressRepository.findByStudent(userId);

        if (progress == null) {
            return APIResponse.builder()
                    .code("404")
                    .message("Sinh viên chưa có đề tài được duyệt!")
                    .build();
        }
        ProgressResponse response = progressMapper.toProgressResponse(progress);
        return APIResponse.<ProgressResponse>builder()
                .code("200")
                .result(response)
                .build();
    }
}
